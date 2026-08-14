import React from 'react';

interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

export const Skills: React.FC = () => {
  const [categories, setCategories] = React.useState<SkillCategory[]>([
    {
      title: 'Data & Analytics',
      icon: 'query_stats',
      skills: [
        'SQL',
        'Python',
        'Pandas',
        'NumPy',
        'Excel',
        'Power BI',
        'Tableau',
        'Streamlit',
        'Statistical Analysis',
      ],
    },
    {
      title: 'Software Development',
      icon: 'code',
      skills: [
        'FastAPI',
        'REST APIs',
        'PostgreSQL',
        'SQLAlchemy / SQLModel',
        'Alembic',
        'React',
        'Vite',
        'Next.js',
        'Tailwind CSS',
      ],
    },
    {
      title: 'Tools & Platforms',
      icon: 'build',
      skills: ['Git', 'GitHub', 'Supabase', 'Redis', 'Postman'],
    },
  ]);

  React.useEffect(() => {
    fetch('/api/skills')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="space-y-12" id="skills">
      <div className="space-y-4 max-w-2xl">
        <h2 className="font-headline-lg text-3xl font-bold text-white">Technical Capabilities</h2>
        <p className="text-on-surface-variant leading-relaxed">
          A structured layout of my primary tools and technical expertise across analysis, software engineering,
          and workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((category, idx) => (
          <div
            key={idx}
            className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] flex flex-col space-y-6"
          >
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-[#3B82F6] text-2xl">{category.icon}</span>
              <h3 className="font-headline-lg text-lg font-semibold text-white">{category.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="font-code-sm text-xs px-3 py-1.5 bg-[#0F172A] border border-[#334155] rounded-md text-[#94A3B8] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
