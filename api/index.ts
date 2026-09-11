import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { Resend } from 'resend';
import multer from 'multer';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// CORS configuration matching Vercel domain and localhost for dev
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['https://akpereraphael.vercel.app', 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'];
  if (origin && (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Multer in-memory storage configuration for handling file uploads (e.g. CV PDF)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Environment configs & production enforcement
const isProd = process.env.NODE_ENV === 'production';
const dbUrl = process.env.DATABASE_URL;
const resendApiKey = process.env.RESEND_API_KEY;

// Authentication Configs with Production Lockdown
const JWT_SECRET = process.env.JWT_SECRET || (isProd ? '' : 'dev-fallback-jwt-secret-key-123');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || (isProd ? '' : 'akpereraphael@gmail.com');
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || (isProd ? '' : bcrypt.hashSync('admin123', 10));

if (!isProd) {
  if (!process.env.JWT_SECRET || !process.env.ADMIN_PASSWORD_HASH) {
    console.warn('[DEV NOTICE] Running with local development fallback admin credentials. In production, JWT_SECRET, ADMIN_EMAIL, and ADMIN_PASSWORD_HASH are strictly enforced.');
  }
} else {
  if (!JWT_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
    console.error('[CRITICAL PRODUCTION CONFIGURATION ERROR] Missing required authentication variables (JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH). Admin authentication is locked down.');
  }
}

// Initialize postgres client
let sql: postgres.Sql | null = null;
if (dbUrl && !dbUrl.includes('username:password@host:port')) {
  try {
    sql = postgres(dbUrl, { ssl: 'require' });
    console.log('PostgreSQL database client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize postgres connection:', err);
  }
} else {
  if (isProd) {
    console.error('[CRITICAL PRODUCTION CONFIGURATION ERROR] DATABASE_URL is required in production. Operating without persistent database storage is disabled.');
  } else {
    console.log('[DEV NOTICE] DATABASE_URL is not set or contains placeholder. Operating with in-memory database storage for local testing.');
  }
}

// In-Memory Database Fallbacks with Enriched Case Studies
let mockProjects: any[] = [
  {
    id: 1,
    title: 'Automated Workflow & KPI Tracking Dashboard',
    slug: 'automated-workflow-kpi-tracking-dashboard',
    description: 'Built an automated tracking system for project milestones, team workload distribution, and operational performance metrics.',
    overview: 'An operational intelligence and tracking engine designed to eliminate manual status reporting, monitor project health, and provide executive visibility across multi-disciplinary technical initiatives.',
    problem: 'Stakeholders previously relied on decentralized spreadsheets and fragmented communication channels, leading to delayed milestone reporting, unmonitored workload imbalances, and reactive risk management.',
    architecture: 'Developed data extraction and transformation pipelines using Python to ingest operational milestones from multiple internal sources. Built a normalized analytical data model connected to an interactive Power BI and Streamlit interface with automated daily KPI refreshes and SLA breach alerts.',
    metrics: 'Reduced manual weekly reporting overhead by 80%, enabled real-time workload balancing across 12+ parallel workstreams, and improved milestone delivery predictability by 35%.',
    key_results: [
      'Automated daily data ingestion pipelines with automated schema validation.',
      'Designed executive KPI matrix tracking throughput, delivery velocity, and SLA compliance.',
      'Implemented proactive bottleneck alerts preventing critical project deadline overruns.'
    ],
    technologies: ['Python', 'Power BI', 'SQL', 'Automated Pipelines', 'Streamlit'],
    github_url: 'https://github.com/Akpere38',
    demo_url: '',
    image_url: '',
    featured: true,
    published: true,
    display_order: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    title: 'Customer Behavior & Transaction Analysis',
    slug: 'customer-behavior-transaction-analysis',
    description: 'Analyzed 100K+ transaction records to identify customer purchasing patterns, retention cohorts, and revenue optimization opportunities.',
    overview: 'A large-scale transactional data analysis initiative designed to discover behavioral customer cohorts, optimize inventory movement, and improve retention rates through data-driven segmentation.',
    problem: 'The business lacked clear visibility into customer lifetime value (LTV), churn drivers, and repeat purchase patterns across diverse regional demographic segments.',
    architecture: 'Engineered high-performance SQL queries and Python (Pandas/NumPy) analytical workflows to clean, aggregate, and analyze over 100,000 raw transaction logs. Applied RFM (Recency, Frequency, Monetary) segmentation and cohort analysis, visualizing findings through interactive analytical dashboards.',
    metrics: 'Processed and validated 100K+ transaction logs with 99.8% data hygiene, identified 4 key high-value customer clusters responsible for 62% of gross revenue, and uncovered repeat purchase retention insights.',
    key_results: [
      'Built automated data cleaning and deduplication scripts handling large historical transaction volumes.',
      'Segmented customer cohorts using Recency-Frequency-Monetary (RFM) modeling.',
      'Delivered actionable executive dashboard showcasing customer lifetime trends and churn risks.'
    ],
    technologies: ['Python', 'SQL', 'Excel', 'Pandas', 'NumPy', 'Data Visualization'],
    github_url: 'https://github.com/Akpere38',
    demo_url: '',
    image_url: '',
    featured: true,
    published: true,
    display_order: 2,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 3,
    title: 'Healthcare Appointment Analysis System',
    slug: 'healthcare-appointment-analysis-system',
    description: 'Analyzed 1,000+ appointment records and developed statistical analysis focused on appointment no-show patterns and scheduling optimization.',
    overview: 'A healthcare analytics case study focused on patient scheduling dynamics, appointment adherence patterns, and operational efficiency across outpatient departments.',
    problem: 'High rates of unexpected patient appointment no-shows led to underutilized clinical staff, inflated wait times for acute cases, and financial inefficiencies in daily schedule allocation.',
    architecture: 'Extracted and structured 1,000+ anonymized clinical appointment records. Utilized statistical hypothesis testing, correlation analysis, and multivariate regression in Python to identify primary predictors of patient absenteeism (lead time, reminder timing, appointment hour, and historical visit patterns).',
    metrics: 'Identified top 3 statistically significant predictors of missed appointments, providing scheduling optimization recommendations capable of lowering slot vacancy rates by up to 22%.',
    key_results: [
      'Conducted exploratory data analysis (EDA) and bivariate correlation testing on clinical cohorts.',
      'Formulated risk-scoring heuristic for high-probability no-show patient slots.',
      'Designed strategic recommendations for smart reminder cadences and dynamic buffer scheduling.'
    ],
    technologies: ['Python', 'Statistical Analysis', 'Predictive Modeling', 'Pandas', 'Matplotlib'],
    github_url: 'https://github.com/Akpere38',
    demo_url: '',
    image_url: '',
    featured: true,
    published: true,
    display_order: 3,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 4,
    title: 'Business Risk & Performance Monitoring Dashboard',
    slug: 'business-risk-performance-monitoring-dashboard',
    description: 'Designed an interactive intelligence dashboard for monitoring operational KPIs and proactively identifying emerging business risks.',
    overview: 'An executive business intelligence dashboard consolidating risk indicators, financial metrics, and operational performance across distributed corporate initiatives.',
    problem: 'Leadership lacked a unified real-time reporting view to identify financial and operational anomalies before they compounded into critical business risks.',
    architecture: 'Engineered an end-to-end Power BI reporting solution integrated with structured relational databases. Designed complex DAX calculations for dynamic trend forecasting, variance analysis, and automated risk scoring thresholds.',
    metrics: 'Consolidated 5 disparate reporting streams into 1 interactive executive command center, speeding up leadership decision cycles from bi-weekly reviews to real-time oversight.',
    key_results: [
      'Developed advanced DAX measures for variance tracking and anomaly detection.',
      'Created intuitive executive visual hierarchy with drill-through capability down to department levels.',
      'Established automated alerts for risk thresholds exceeding defined operational parameters.'
    ],
    technologies: ['Power BI', 'DAX', 'SQL', 'Risk Analytics', 'KPI Monitoring'],
    github_url: 'https://github.com/Akpere38',
    demo_url: '',
    image_url: '',
    featured: true,
    published: true,
    display_order: 4,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 5,
    title: 'Data Quality & Compliance Initiative',
    slug: 'data-quality-compliance-initiative',
    description: 'Implemented automated data validation and quality-control processes ensuring high reporting accuracy and governance consistency.',
    overview: 'A data governance framework focused on standardizing data ingestion pipelines, enforcing integrity constraints, and preventing dirty data from contaminating downstream analytics.',
    problem: 'Inconsistent data formats, duplicate records, and unvalidated manual entry points corrupted executive BI reports and caused discrepancies across team analytics.',
    architecture: 'Built automated Python validation workflows with schema testing rules, outlier bounds checking, and referential integrity assertions. Created audit logging tables to track data lineage and validation failures.',
    metrics: 'Achieved 99.9% data reliability across critical analytical tables and eliminated recurring reconciliation errors in stakeholder reports.',
    key_results: [
      'Implemented automated pre-ingestion validation rules and schema verification.',
      'Constructed error-logging and quarantine workflows for non-compliant records.',
      'Authored standardized data documentation and validation runbooks.'
    ],
    technologies: ['Python', 'SQL', 'Data Quality', 'Validation Pipelines', 'Governance'],
    github_url: 'https://github.com/Akpere38',
    demo_url: '',
    image_url: '',
    featured: true,
    published: true,
    display_order: 5,
    created_at: new Date(),
    updated_at: new Date()
  }
];
let mockInquiries: any[] = [];
let mockCv: { filename: string; mime_type: string; file_data: Buffer } | null = null;

let mockExperiences: any[] = [
  {
    id: 1,
    role: 'Data Analyst',
    company: 'Big Data Consult',
    location: 'Nigeria',
    duration: 'Jan 2024 – Present',
    highlights: [
      'Perform core data analysis and deliver actionable business intelligence reports.',
      'Develop interactive, real-time KPI dashboards using Power BI and Streamlit.',
      'Optimize database queries and data ingestion workflows using Python and SQL.',
      'Conduct workflow analysis to identify bottlenecks and improve overall data quality.'
    ],
    display_order: 1,
    created_at: new Date()
  },
  {
    id: 2,
    role: 'Senior IT Administrative Staff / Project Manager',
    company: 'Lins Consult',
    location: 'Nigeria',
    duration: 'Oct 2022 – Present',
    highlights: [
      'Manage IT administration and operational project planning.',
      'Coordinate cross-functional teams to align project deliverables with client requirements.',
      'Research technical solutions and provide progress reports to stakeholders.',
      'Maintain operational monitoring pipelines to track project health and milestones.'
    ],
    display_order: 2,
    created_at: new Date()
  }
];

let mockEducation: any[] = [
  {
    id: 1,
    degree: 'Bachelor of Science in Computer Science',
    institution: 'National Open University of Nigeria',
    year: 'Expected 2027',
    display_order: 1,
    created_at: new Date()
  },
  {
    id: 2,
    degree: 'Ordinary National Diploma – Science Laboratory Technology',
    institution: 'Delta State Polytechnic, Otefe',
    year: '2015',
    display_order: 2,
    created_at: new Date()
  }
];

let mockCertifications: any[] = [
  {
    id: 1,
    name: 'Google Advanced Data Analytics Professional Certificate',
    year: '2024',
    display_order: 1,
    created_at: new Date()
  },
  {
    id: 2,
    name: 'Python Developer Certificate',
    year: '2023',
    display_order: 2,
    created_at: new Date()
  }
];

let mockSkills: any[] = [
  {
    id: 1,
    title: 'Data & Analytics',
    icon: 'query_stats',
    skills: ['SQL', 'Python', 'Pandas', 'NumPy', 'Excel', 'Power BI', 'Tableau', 'Streamlit', 'Statistical Analysis'],
    display_order: 1,
    created_at: new Date()
  },
  {
    id: 2,
    title: 'Software Development',
    icon: 'code',
    skills: ['FastAPI', 'REST APIs', 'PostgreSQL', 'SQLAlchemy / SQLModel', 'Alembic', 'React', 'Vite', 'Next.js', 'Tailwind CSS'],
    display_order: 2,
    created_at: new Date()
  },
  {
    id: 3,
    title: 'Tools & Platforms',
    icon: 'build',
    skills: ['Git', 'GitHub', 'Supabase', 'Redis', 'Postman'],
    display_order: 3,
    created_at: new Date()
  }
];

// Database tables helper function (Guarded against redundant startup execution)
let dbInitialized = false;
async function initDb() {
  if (!sql || dbInitialized) return;
  dbInitialized = true;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        technologies TEXT[] NOT NULL,
        github_url VARCHAR(1024),
        demo_url VARCHAR(1024),
        image_url TEXT,
        featured BOOLEAN DEFAULT FALSE,
        published BOOLEAN DEFAULT FALSE,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'NEW',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS cv (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        file_data BYTEA NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        role VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        duration VARCHAR(255) NOT NULL,
        highlights TEXT[] NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        degree VARCHAR(255) NOT NULL,
        institution VARCHAR(255) NOT NULL,
        year VARCHAR(100) NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS certifications (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        year VARCHAR(100) NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS skill_categories (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        icon VARCHAR(100) NOT NULL,
        skills TEXT[] NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Seed default projects if projects table is empty
    const countResult = await sql`SELECT COUNT(*)::int as count FROM projects`;
    if (countResult[0].count === 0) {
      for (const p of mockProjects) {
        await sql`
          INSERT INTO projects (title, slug, description, technologies, github_url, demo_url, featured, published, display_order)
          VALUES (${p.title}, ${p.slug}, ${p.description}, ${p.technologies}, ${p.github_url}, ${p.demo_url}, ${p.featured}, ${p.published}, ${p.display_order})
        `;
      }
    }

    // Seed experiences
    const expCount = await sql`SELECT COUNT(*)::int as count FROM experiences`;
    if (expCount[0].count === 0) {
      for (const e of mockExperiences) {
        await sql`
          INSERT INTO experiences (role, company, location, duration, highlights, display_order)
          VALUES (${e.role}, ${e.company}, ${e.location}, ${e.duration}, ${e.highlights}, ${e.display_order})
        `;
      }
    }

    // Seed education
    const eduCount = await sql`SELECT COUNT(*)::int as count FROM education`;
    if (eduCount[0].count === 0) {
      for (const ed of mockEducation) {
        await sql`
          INSERT INTO education (degree, institution, year, display_order)
          VALUES (${ed.degree}, ${ed.institution}, ${ed.year}, ${ed.display_order})
        `;
      }
    }

    // Seed certifications
    const certCount = await sql`SELECT COUNT(*)::int as count FROM certifications`;
    if (certCount[0].count === 0) {
      for (const c of mockCertifications) {
        await sql`
          INSERT INTO certifications (name, year, display_order)
          VALUES (${c.name}, ${c.year}, ${c.display_order})
        `;
      }
    }

    // Seed skills
    const skillCount = await sql`SELECT COUNT(*)::int as count FROM skill_categories`;
    if (skillCount[0].count === 0) {
      for (const s of mockSkills) {
        await sql`
          INSERT INTO skill_categories (title, icon, skills, display_order)
          VALUES (${s.title}, ${s.icon}, ${s.skills}, ${s.display_order})
        `;
      }
    }

    console.log('Database tables successfully verified and initialized.');
  } catch (err) {
    console.error('Database migration/init failed:', err);
  }
}

// Call database initializer
initDb();

// Authentication Middleware
const authenticateAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = req.cookies.admin_token || bearerToken;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  if (!JWT_SECRET) {
    return res.status(500).json({ error: 'Server authentication configuration missing.' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

/* ── PUBLIC ENDPOINTS ── */

// Get public projects (published and ordered, supports optional featured query)
app.get('/api/projects', async (req, res) => {
  const { featured } = req.query;
  try {
    if (sql) {
      let projects;
      if (featured === 'true') {
        projects = await sql`
          SELECT * FROM projects 
          WHERE published = true AND featured = true 
          ORDER BY display_order ASC, id ASC
        `;
      } else {
        projects = await sql`
          SELECT * FROM projects 
          WHERE published = true 
          ORDER BY display_order ASC, id ASC
        `;
      }
      return res.json(projects);
    } else {
      let projects = mockProjects
        .filter((p) => p.published)
        .sort((a, b) => a.display_order - b.display_order);
      if (featured === 'true') {
        projects = projects.filter((p) => p.featured);
      }
      return res.json(projects);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve projects', details: err.message });
  }
});

// Get single project details
app.get('/api/projects/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    let project: any = null;
    if (sql) {
      const projects = await sql`
        SELECT * FROM projects 
        WHERE slug = ${slug} AND published = true
      `;
      if (projects.length > 0) {
        project = projects[0];
      }
    } else {
      project = mockProjects.find((p) => p.slug === slug && p.published);
    }

    if (!project) {
      // Check mockProjects fallback for rich case study details if DB had basic record
      const fallback = mockProjects.find((p) => p.slug === slug);
      if (!fallback) {
        return res.status(404).json({ error: 'Project not found' });
      }
      project = fallback;
    } else {
      // Enrich with case study structure if matching mock project has extended sections
      const enriched = mockProjects.find((p) => p.slug === slug);
      if (enriched) {
        project = {
          ...enriched,
          ...project,
          overview: project.overview || enriched.overview,
          problem: project.problem || enriched.problem,
          architecture: project.architecture || enriched.architecture,
          metrics: project.metrics || enriched.metrics,
          key_results: project.key_results || enriched.key_results,
        };
      }
    }

    return res.json(project);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve project details', details: err.message });
  }
});

// Post inquiry/contact submission
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All message fields (name, email, subject, message) are required.' });
  }

  try {
    // 1. Save to Database
    if (sql) {
      await sql`
        INSERT INTO inquiries (name, email, subject, message, status)
        VALUES (${name}, ${email}, ${subject}, ${message}, 'NEW')
      `;
    } else {
      if (isProd) {
        console.error('[DATABASE WRITE ERROR] Inquiries cannot be recorded in production without a valid DATABASE_URL.');
        return res.status(500).json({ error: 'Database service is currently unconfigured.' });
      }
      mockInquiries.push({
        id: mockInquiries.length + 1,
        name,
        email,
        subject,
        message,
        status: 'NEW',
        created_at: new Date()
      });
    }

    // 2. Send email via Resend
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: 'Portfolio Site <onboarding@resend.dev>',
        to: ADMIN_EMAIL || 'akpereraphael@gmail.com',
        replyTo: email,
        subject: `New Inquiry: ${subject}`,
        html: `
          <h3>New Message from Portfolio Website</h3>
          <p><strong>Sender Name:</strong> ${name}</p>
          <p><strong>Sender Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p><strong>Received At:</strong> ${new Date().toLocaleString()}</p>
        `
      });
      console.log(`Inquiry email dispatched successfully.`);
    } else {
      console.log('Resend key not set. Email dispatch bypassed.');
    }

    return res.json({ success: true, message: 'Your message has been successfully received!' });
  } catch (err: any) {
    console.error('Contact submission error:', err);
    return res.status(500).json({ error: 'Failed to submit inquiry', details: err.message });
  }
});

// Get current CV (Streams from DB or static file fallback)
app.get('/api/cv', async (req, res) => {
  const download = req.query.download === 'true';
  try {
    let currentCv: { filename: string; mime_type: string; file_data: Buffer } | null = null;

    // 1. Try retrieving from PostgreSQL database
    if (sql) {
      try {
        const result = await sql`
          SELECT filename, mime_type, file_data 
          FROM cv 
          ORDER BY uploaded_at DESC 
          LIMIT 1
        `;
        if (result.length > 0 && result[0].file_data) {
          currentCv = {
            filename: result[0].filename || 'Raphael-Akpere-CV.pdf',
            mime_type: result[0].mime_type || 'application/pdf',
            file_data: result[0].file_data
          };
        }
      } catch (dbErr) {
        console.error('Database CV query error:', dbErr);
      }
    } else if (mockCv) {
      currentCv = mockCv;
    }

    if (currentCv && currentCv.file_data) {
      res.setHeader('Content-Type', currentCv.mime_type || 'application/pdf');
      res.setHeader('Content-Disposition', `${download ? 'attachment' : 'inline'}; filename="${currentCv.filename || 'Raphael-Akpere-CV.pdf'}"`);
      return res.send(currentCv.file_data);
    }

    // 2. Check static file fallback in public/ directory
    const staticCvPath = path.join(process.cwd(), 'public', 'Raphael-Akpere-CV.pdf');
    if (fs.existsSync(staticCvPath)) {
      const fileBuffer = fs.readFileSync(staticCvPath);
      if (fileBuffer.length > 0) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `${download ? 'attachment' : 'inline'}; filename="Raphael-Akpere-CV.pdf"`);
        return res.send(fileBuffer);
      }
    }

    return res.status(404).json({ error: 'CV document is currently unavailable.' });
  } catch (err: any) {
    console.error('CV endpoint error:', err);
    return res.status(500).json({ error: 'Failed to retrieve CV file', details: err.message });
  }
});

/* ── AUTH ENDPOINTS ── */

// Admin login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Production authentication configuration verification
  if (isProd && (!JWT_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD_HASH)) {
    console.error('[CRITICAL AUTH ERROR] Admin authentication is disabled because production secrets are not configured.');
    return res.status(500).json({ error: 'Server authentication is not configured.' });
  }

  if (
    !ADMIN_EMAIL ||
    !ADMIN_PASSWORD_HASH ||
    email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
    !bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)
  ) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ error: 'Server authentication configuration missing.' });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '8h' });
  
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000 // 8 hours
  });

  return res.json({ success: true, token, message: 'Access authorized' });
});

// Admin logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('admin_token');
  return res.json({ success: true, message: 'Session closed' });
});

// Auth status check
app.get('/api/auth/status', (req, res) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = req.cookies.admin_token || bearerToken;
  if (!token || !JWT_SECRET) {
    return res.json({ authenticated: false });
  }
  try {
    jwt.verify(token, JWT_SECRET);
    return res.json({ authenticated: true });
  } catch {
    return res.json({ authenticated: false });
  }
});


/* ── PROTECTED ADMIN ENDPOINTS ── */

// Get all projects (including unpublished)
app.get('/api/admin/projects', authenticateAdmin, async (req, res) => {
  try {
    if (sql) {
      const projects = await sql`SELECT * FROM projects ORDER BY display_order ASC, id ASC`;
      return res.json(projects);
    } else {
      const projects = [...mockProjects].sort((a, b) => a.display_order - b.display_order);
      return res.json(projects);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve admin projects', details: err.message });
  }
});

// Create project
app.post('/api/admin/projects', authenticateAdmin, async (req, res) => {
  const { title, slug, description, technologies, github_url, demo_url, image_url, featured, published, display_order } = req.body;
  
  if (!title || !slug || !description || !Array.isArray(technologies)) {
    return res.status(400).json({ error: 'Fields (title, slug, description, technologies array) are required.' });
  }

  try {
    if (sql) {
      const newProject = await sql`
        INSERT INTO projects (title, slug, description, technologies, github_url, demo_url, image_url, featured, published, display_order, updated_at)
        VALUES (${title}, ${slug}, ${description}, ${technologies}, ${github_url || ''}, ${demo_url || ''}, ${image_url || ''}, ${!!featured}, ${!!published}, ${Number(display_order) || 0}, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      return res.json(newProject[0]);
    } else {
      const newProject = {
        id: mockProjects.length > 0 ? Math.max(...mockProjects.map(p => p.id)) + 1 : 1,
        title,
        slug,
        description,
        technologies,
        github_url: github_url || '',
        demo_url: demo_url || '',
        image_url: image_url || '',
        featured: !!featured,
        published: !!published,
        display_order: Number(display_order) || 0,
        created_at: new Date(),
        updated_at: new Date()
      };
      mockProjects.push(newProject);
      return res.json(newProject);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create project', details: err.message });
  }
});

// Update project
app.put('/api/admin/projects/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, slug, description, technologies, github_url, demo_url, image_url, featured, published, display_order } = req.body;
  
  if (!title || !slug || !description || !Array.isArray(technologies)) {
    return res.status(400).json({ error: 'Fields (title, slug, description, technologies array) are required.' });
  }

  try {
    if (sql) {
      const updatedProject = await sql`
        UPDATE projects
        SET title = ${title},
            slug = ${slug},
            description = ${description},
            technologies = ${technologies},
            github_url = ${github_url || ''},
            demo_url = ${demo_url || ''},
            image_url = ${image_url || ''},
            featured = ${!!featured},
            published = ${!!published},
            display_order = ${Number(display_order) || 0},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
      if (updatedProject.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.json(updatedProject[0]);
    } else {
      const index = mockProjects.findIndex((p) => p.id === Number(id));
      if (index === -1) {
        return res.status(404).json({ error: 'Project not found' });
      }
      mockProjects[index] = {
        ...mockProjects[index],
        title,
        slug,
        description,
        technologies,
        github_url: github_url || '',
        demo_url: demo_url || '',
        image_url: image_url || '',
        featured: !!featured,
        published: !!published,
        display_order: Number(display_order) || 0,
        updated_at: new Date()
      };
      return res.json(mockProjects[index]);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update project', details: err.message });
  }
});

// Delete project
app.delete('/api/admin/projects/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (sql) {
      const result = await sql`DELETE FROM projects WHERE id = ${id} RETURNING id`;
      if (result.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.json({ success: true, id: result[0].id });
    } else {
      const index = mockProjects.findIndex((p) => p.id === Number(id));
      if (index === -1) {
        return res.status(404).json({ error: 'Project not found' });
      }
      const deletedId = mockProjects[index].id;
      mockProjects.splice(index, 1);
      return res.json({ success: true, id: deletedId });
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete project', details: err.message });
  }
});

// Get all contact messages
app.get('/api/admin/messages', authenticateAdmin, async (req, res) => {
  try {
    if (sql) {
      const messages = await sql`SELECT * FROM inquiries ORDER BY created_at DESC`;
      return res.json(messages);
    } else {
      const messages = [...mockInquiries].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
      return res.json(messages);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve messages', details: err.message });
  }
});

// Update contact message status (READ/ARCHIVED)
app.patch('/api/admin/messages/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['NEW', 'READ', 'ARCHIVED'].includes(status)) {
    return res.status(400).json({ error: 'Valid status (NEW, READ, ARCHIVED) is required.' });
  }

  try {
    if (sql) {
      const updated = await sql`
        UPDATE inquiries 
        SET status = ${status} 
        WHERE id = ${id} 
        RETURNING *
      `;
      if (updated.length === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
      return res.json(updated[0]);
    } else {
      const index = mockInquiries.findIndex((m) => m.id === Number(id));
      if (index === -1) {
        return res.status(404).json({ error: 'Message not found' });
      }
      mockInquiries[index].status = status;
      return res.json(mockInquiries[index]);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update message status', details: err.message });
  }
});

// Upload CV
app.post('/api/admin/cv', authenticateAdmin, upload.single('cv'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Please upload a PDF file.' });
  }

  const { originalname, mimetype, buffer } = req.file;

  try {
    if (sql) {
      await sql`
        INSERT INTO cv (filename, mime_type, file_data)
        VALUES (${originalname}, ${mimetype}, ${buffer})
      `;
    } else {
      mockCv = {
        filename: originalname,
        mime_type: mimetype,
        file_data: buffer
      };
    }
    return res.json({ success: true, message: 'CV uploaded successfully!' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to save CV upload', details: err.message });
  }
});

/* ── EXPERIENCE PUBLIC & ADMIN ENDPOINTS ── */

app.get('/api/experience', async (req, res) => {
  try {
    if (sql) {
      const items = await sql`SELECT * FROM experiences ORDER BY display_order ASC, id ASC`;
      return res.json(items);
    } else {
      return res.json([...mockExperiences].sort((a, b) => a.display_order - b.display_order));
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch experiences', details: err.message });
  }
});

app.get('/api/admin/experience', authenticateAdmin, async (req, res) => {
  try {
    if (sql) {
      const items = await sql`SELECT * FROM experiences ORDER BY display_order ASC, id ASC`;
      return res.json(items);
    } else {
      return res.json([...mockExperiences].sort((a, b) => a.display_order - b.display_order));
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch experiences', details: err.message });
  }
});

app.post('/api/admin/experience', authenticateAdmin, async (req, res) => {
  const { role, company, location, duration, highlights, display_order } = req.body;
  if (!role || !company || !location || !duration) {
    return res.status(400).json({ error: 'Role, company, location, and duration are required.' });
  }
  const cleanHighlights = Array.isArray(highlights) ? highlights : [];
  const order = typeof display_order === 'number' ? display_order : 0;
  try {
    if (sql) {
      const inserted = await sql`
        INSERT INTO experiences (role, company, location, duration, highlights, display_order)
        VALUES (${role}, ${company}, ${location}, ${duration}, ${cleanHighlights}, ${order})
        RETURNING *
      `;
      return res.status(201).json(inserted[0]);
    } else {
      const newItem = {
        id: Date.now(),
        role,
        company,
        location,
        duration,
        highlights: cleanHighlights,
        display_order: order,
        created_at: new Date()
      };
      mockExperiences.push(newItem);
      return res.status(201).json(newItem);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create experience', details: err.message });
  }
});

app.put('/api/admin/experience/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { role, company, location, duration, highlights, display_order } = req.body;
  const cleanHighlights = Array.isArray(highlights) ? highlights : [];
  try {
    if (sql) {
      const updated = await sql`
        UPDATE experiences
        SET role = ${role}, company = ${company}, location = ${location}, duration = ${duration}, highlights = ${cleanHighlights}, display_order = ${display_order}
        WHERE id = ${id}
        RETURNING *
      `;
      if (updated.length === 0) return res.status(404).json({ error: 'Experience not found' });
      return res.json(updated[0]);
    } else {
      const idx = mockExperiences.findIndex((e) => e.id === Number(id));
      if (idx === -1) return res.status(404).json({ error: 'Experience not found' });
      mockExperiences[idx] = { ...mockExperiences[idx], role, company, location, duration, highlights: cleanHighlights, display_order };
      return res.json(mockExperiences[idx]);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update experience', details: err.message });
  }
});

app.delete('/api/admin/experience/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (sql) {
      await sql`DELETE FROM experiences WHERE id = ${id}`;
    } else {
      mockExperiences = mockExperiences.filter((e) => e.id !== Number(id));
    }
    return res.json({ success: true, message: 'Experience deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete experience', details: err.message });
  }
});

/* ── EDUCATION & CERTIFICATIONS ENDPOINTS ── */

app.get('/api/education', async (req, res) => {
  try {
    if (sql) {
      const education = await sql`SELECT * FROM education ORDER BY display_order ASC, id ASC`;
      const certifications = await sql`SELECT * FROM certifications ORDER BY display_order ASC, id ASC`;
      return res.json({ education, certifications });
    } else {
      return res.json({
        education: [...mockEducation].sort((a, b) => a.display_order - b.display_order),
        certifications: [...mockCertifications].sort((a, b) => a.display_order - b.display_order)
      });
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch education and certifications', details: err.message });
  }
});

app.get('/api/admin/education', authenticateAdmin, async (req, res) => {
  try {
    if (sql) {
      const education = await sql`SELECT * FROM education ORDER BY display_order ASC, id ASC`;
      const certifications = await sql`SELECT * FROM certifications ORDER BY display_order ASC, id ASC`;
      return res.json({ education, certifications });
    } else {
      return res.json({
        education: [...mockEducation].sort((a, b) => a.display_order - b.display_order),
        certifications: [...mockCertifications].sort((a, b) => a.display_order - b.display_order)
      });
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch education data', details: err.message });
  }
});

app.post('/api/admin/education', authenticateAdmin, async (req, res) => {
  const { degree, institution, year, display_order } = req.body;
  if (!degree || !institution || !year) {
    return res.status(400).json({ error: 'Degree, institution, and year are required.' });
  }
  try {
    if (sql) {
      const inserted = await sql`
        INSERT INTO education (degree, institution, year, display_order)
        VALUES (${degree}, ${institution}, ${year}, ${display_order || 0})
        RETURNING *
      `;
      return res.status(201).json(inserted[0]);
    } else {
      const newItem = { id: Date.now(), degree, institution, year, display_order: display_order || 0, created_at: new Date() };
      mockEducation.push(newItem);
      return res.status(201).json(newItem);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to add education', details: err.message });
  }
});

app.put('/api/admin/education/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { degree, institution, year, display_order } = req.body;
  try {
    if (sql) {
      const updated = await sql`
        UPDATE education
        SET degree = ${degree}, institution = ${institution}, year = ${year}, display_order = ${display_order}
        WHERE id = ${id}
        RETURNING *
      `;
      if (updated.length === 0) return res.status(404).json({ error: 'Education entry not found' });
      return res.json(updated[0]);
    } else {
      const idx = mockEducation.findIndex((e) => e.id === Number(id));
      if (idx === -1) return res.status(404).json({ error: 'Education entry not found' });
      mockEducation[idx] = { ...mockEducation[idx], degree, institution, year, display_order };
      return res.json(mockEducation[idx]);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update education entry', details: err.message });
  }
});

app.delete('/api/admin/education/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (sql) {
      await sql`DELETE FROM education WHERE id = ${id}`;
    } else {
      mockEducation = mockEducation.filter((e) => e.id !== Number(id));
    }
    return res.json({ success: true, message: 'Education entry deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete education entry', details: err.message });
  }
});

app.post('/api/admin/certifications', authenticateAdmin, async (req, res) => {
  const { name, year, display_order } = req.body;
  if (!name || !year) {
    return res.status(400).json({ error: 'Certification name and year are required.' });
  }
  try {
    if (sql) {
      const inserted = await sql`
        INSERT INTO certifications (name, year, display_order)
        VALUES (${name}, ${year}, ${display_order || 0})
        RETURNING *
      `;
      return res.status(201).json(inserted[0]);
    } else {
      const newItem = { id: Date.now(), name, year, display_order: display_order || 0, created_at: new Date() };
      mockCertifications.push(newItem);
      return res.status(201).json(newItem);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to add certification', details: err.message });
  }
});

app.put('/api/admin/certifications/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, year, display_order } = req.body;
  try {
    if (sql) {
      const updated = await sql`
        UPDATE certifications
        SET name = ${name}, year = ${year}, display_order = ${display_order}
        WHERE id = ${id}
        RETURNING *
      `;
      if (updated.length === 0) return res.status(404).json({ error: 'Certification not found' });
      return res.json(updated[0]);
    } else {
      const idx = mockCertifications.findIndex((c) => c.id === Number(id));
      if (idx === -1) return res.status(404).json({ error: 'Certification not found' });
      mockCertifications[idx] = { ...mockCertifications[idx], name, year, display_order };
      return res.json(mockCertifications[idx]);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update certification', details: err.message });
  }
});

app.delete('/api/admin/certifications/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (sql) {
      await sql`DELETE FROM certifications WHERE id = ${id}`;
    } else {
      mockCertifications = mockCertifications.filter((c) => c.id !== Number(id));
    }
    return res.json({ success: true, message: 'Certification deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete certification', details: err.message });
  }
});

/* ── SKILLS / TECHNICAL CAPABILITIES ENDPOINTS ── */

app.get('/api/skills', async (req, res) => {
  try {
    if (sql) {
      const skills = await sql`SELECT * FROM skill_categories ORDER BY display_order ASC, id ASC`;
      return res.json(skills);
    } else {
      return res.json([...mockSkills].sort((a, b) => a.display_order - b.display_order));
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch skill categories', details: err.message });
  }
});

app.get('/api/admin/skills', authenticateAdmin, async (req, res) => {
  try {
    if (sql) {
      const skills = await sql`SELECT * FROM skill_categories ORDER BY display_order ASC, id ASC`;
      return res.json(skills);
    } else {
      return res.json([...mockSkills].sort((a, b) => a.display_order - b.display_order));
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch skill categories', details: err.message });
  }
});

app.post('/api/admin/skills', authenticateAdmin, async (req, res) => {
  const { title, icon, skills, display_order } = req.body;
  if (!title || !icon) {
    return res.status(400).json({ error: 'Title and icon are required.' });
  }
  const cleanSkills = Array.isArray(skills) ? skills : [];
  try {
    if (sql) {
      const inserted = await sql`
        INSERT INTO skill_categories (title, icon, skills, display_order)
        VALUES (${title}, ${icon}, ${cleanSkills}, ${display_order || 0})
        RETURNING *
      `;
      return res.status(201).json(inserted[0]);
    } else {
      const newItem = { id: Date.now(), title, icon, skills: cleanSkills, display_order: display_order || 0, created_at: new Date() };
      mockSkills.push(newItem);
      return res.status(201).json(newItem);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to add skill category', details: err.message });
  }
});

app.put('/api/admin/skills/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, icon, skills, display_order } = req.body;
  const cleanSkills = Array.isArray(skills) ? skills : [];
  try {
    if (sql) {
      const updated = await sql`
        UPDATE skill_categories
        SET title = ${title}, icon = ${icon}, skills = ${cleanSkills}, display_order = ${display_order}
        WHERE id = ${id}
        RETURNING *
      `;
      if (updated.length === 0) return res.status(404).json({ error: 'Skill category not found' });
      return res.json(updated[0]);
    } else {
      const idx = mockSkills.findIndex((s) => s.id === Number(id));
      if (idx === -1) return res.status(404).json({ error: 'Skill category not found' });
      mockSkills[idx] = { ...mockSkills[idx], title, icon, skills: cleanSkills, display_order };
      return res.json(mockSkills[idx]);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update skill category', details: err.message });
  }
});

app.delete('/api/admin/skills/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (sql) {
      await sql`DELETE FROM skill_categories WHERE id = ${id}`;
    } else {
      mockSkills = mockSkills.filter((s) => s.id !== Number(id));
    }
    return res.json({ success: true, message: 'Skill category deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete skill category', details: err.message });
  }
});

// Export App for Vercel Serverless Function hosting
export default app;

// Listen locally for development
if (process.env.NODE_ENV !== 'production') {
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Backend server listening locally on http://localhost:${PORT}`);
  });
}
