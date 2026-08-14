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
  const allowedOrigins = ['https://akpereraphael.vercel.app', 'http://localhost:5173'];
  if (origin && allowedOrigins.includes(origin)) {
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

// Environment configs
const dbUrl = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-jwt-secret-key-123';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'akpereraphael@gmail.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('admin123', 10);
const resendApiKey = process.env.RESEND_API_KEY;

// Initialize postgres client
let sql: postgres.Sql | null = null;
if (dbUrl) {
  try {
    sql = postgres(dbUrl, { ssl: 'require' });
    console.log('PostgreSQL database client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize postgres connection:', err);
  }
} else {
  console.log('DATABASE_URL is not set. Falling back to in-memory database storage.');
}

// In-Memory Database Fallbacks
let mockProjects: any[] = [
  {
    id: 1,
    title: 'Automated Workflow & KPI Tracking Dashboard',
    slug: 'automated-workflow-kpi-tracking-dashboard',
    description: 'Built a tracking system for project progress, deadlines, workload distribution, and operational performance.',
    technologies: ['Python', 'Power BI'],
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
    description: 'Analyzed 100K+ transaction records to identify customer behavior, purchasing patterns, and operational trends.',
    technologies: ['Python', 'SQL', 'Excel', 'Data Visualization'],
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
    description: 'Analyzed 1,000+ appointment records and developed predictive analysis focused on appointment no-show patterns and scheduling optimization.',
    technologies: ['Python', 'Statistical Analysis'],
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
    description: 'Designed an interactive dashboard for monitoring operational KPIs and identifying emerging business risks.',
    technologies: ['Power BI'],
    github_url: '',
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
    description: 'Implemented data validation and quality-control processes focused on reporting accuracy and consistency.',
    technologies: ['Data Quality', 'Validation', 'Reporting'],
    github_url: '',
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

// Database tables helper function
async function initDb() {
  if (!sql) return;
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
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

/* ── PUBLIC ENDPOINTS ── */

// Get public projects (published and ordered)
app.get('/api/projects', async (req, res) => {
  try {
    if (sql) {
      const projects = await sql`
        SELECT * FROM projects 
        WHERE published = true 
        ORDER BY display_order ASC, id ASC
      `;
      return res.json(projects);
    } else {
      const projects = mockProjects
        .filter((p) => p.published)
        .sort((a, b) => a.display_order - b.display_order);
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
    if (sql) {
      const project = await sql`
        SELECT * FROM projects 
        WHERE slug = ${slug} AND published = true
      `;
      if (project.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.json(project[0]);
    } else {
      const project = mockProjects.find((p) => p.slug === slug && p.published);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.json(project);
    }
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
        to: ADMIN_EMAIL,
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
      console.log(`Inquiry email sent successfully to ${ADMIN_EMAIL}`);
    } else {
      console.log('Resend key not set. Email dispatch bypassed.');
    }

    return res.json({ success: true, message: 'Your message has been successfully received!' });
  } catch (err: any) {
    console.error('Contact submission error:', err);
    return res.status(500).json({ error: 'Failed to submit inquiry', details: err.message });
  }
});

// Get current CV
app.get('/api/cv', async (req, res) => {
  const download = req.query.download === 'true';
  try {
    let currentCv: { filename: string; mime_type: string; file_data: Buffer } | null = null;

    if (sql) {
      const result = await sql`
        SELECT filename, mime_type, file_data 
        FROM cv 
        ORDER BY uploaded_at DESC 
        LIMIT 1
      `;
      if (result.length > 0) {
        currentCv = {
          filename: result[0].filename,
          mime_type: result[0].mime_type,
          file_data: result[0].file_data
        };
      }
    } else {
      currentCv = mockCv;
    }

    if (!currentCv) {
      return res.status(404).json({ error: 'CV has not been uploaded yet' });
    }

    res.setHeader('Content-Type', currentCv.mime_type);
    if (download) {
      res.setHeader('Content-Disposition', `attachment; filename="${currentCv.filename}"`);
    } else {
      res.setHeader('Content-Disposition', `inline; filename="${currentCv.filename}"`);
    }
    return res.send(currentCv.file_data);
  } catch (err: any) {
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

  if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() || !bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '8h' });
  
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000 // 8 hours
  });

  return res.json({ success: true, message: 'Access authorized' });
});

// Admin logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('admin_token');
  return res.json({ success: true, message: 'Session closed' });
});

// Auth status check
app.get('/api/auth/status', (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) {
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
