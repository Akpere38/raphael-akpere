import { Router, Route, Switch } from 'wouter';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { EducationCertifications } from './components/EducationCertifications';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

// Pages
import { ProjectDetail } from './components/ProjectDetail';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProjects } from './pages/AdminProjects';
import { AdminMessages } from './pages/AdminMessages';
import { AdminCV } from './pages/AdminCV';

// Public Portfolio View Component
const PublicPortfolio: React.FC = () => {
  return (
    <>
      <Header />
      <main className="pt-24 pb-section-gap px-margin-mobile md:px-gutter max-w-container-max mx-auto space-y-section-gap">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <EducationCertifications />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <Switch>
        {/* Public Routes */}
        <Route path="/" component={PublicPortfolio} />
        <Route path="/projects/:slug" component={ProjectDetail} />

        {/* Admin Authentication */}
        <Route path="/admin/login" component={AdminLogin} />

        {/* Protected Admin Routes */}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/projects" component={AdminProjects} />
        <Route path="/admin/messages" component={AdminMessages} />
        <Route path="/admin/cv" component={AdminCV} />

        {/* Fallback Catch-All */}
        <Route>
          <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center text-center space-y-6">
            <span className="material-symbols-outlined text-error text-6xl">warning</span>
            <h1 className="text-3xl font-bold text-white">404 - Page Not Found</h1>
            <p className="text-on-surface-variant max-w-md">
              The page you are looking for does not exist or has been relocated.
            </p>
            <a href="/" className="inline-flex justify-center items-center px-6 py-2.5 bg-[#3B82F6] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
              Return Home
            </a>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
