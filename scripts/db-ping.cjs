const postgres = require('postgres');
require('dotenv').config();

async function testConnection() {
  const dbUrl = process.env.DATABASE_URL;
  console.log('--- DATABASE CONNECTION DIAGNOSTIC ---');
  if (!dbUrl || dbUrl.includes('username:password@host:port')) {
    console.log('Status: DATABASE_URL is not set or contains default placeholder.');
    console.log('Running in local memory fallback mode (Zero DB dependency for local dev).');
    return { status: 'fallback', message: 'No valid database URL provided' };
  }

  console.log('Testing connection to PostgreSQL target...');
  try {
    const sql = postgres(dbUrl, {
      ssl: 'require',
      connect_timeout: 5,
      idle_timeout: 5,
    });
    const result = await sql`SELECT 1 as connected, NOW() as server_time;`;
    console.log('Connection successful!');
    console.log('Server response:', result);
    await sql.end();
    return { status: 'connected', result };
  } catch (err) {
    console.error('PostgreSQL Connection Error details:');
    console.error(`Code: ${err.code}`);
    console.error(`Message: ${err.message}`);
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      console.error('Diagnosis: Remote database is unreachable, paused, or network firewall is blocking the connection.');
    } else if (err.message && err.message.includes('password authentication failed')) {
      console.error('Diagnosis: Authentication failed. Please check POSTGRES_PASSWORD / username credentials.');
    }
    return { status: 'error', error: err.message, code: err.code };
  }
}

testConnection();
