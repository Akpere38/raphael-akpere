import React from 'react';

interface SkillCategory {
  title: string;
  icon: string;
  badge: string;
  skills: string[];
}

export const Skills: React.FC = () => {
  const [categories, setCategories] = React.useState<SkillCategory[]>([
    {
      title: 'Data & Analytics',
      icon: 'query_stats',
      badge: 'Core Analytics',
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
      badge: 'Engineering',
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
      badge: 'Infrastructure',
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
          const badges = ['Core Analytics', 'Engineering', 'Infrastructure'];
          setCategories(
            data.map((cat, idx) => ({
              ...cat,
              badge: badges[idx % badges.length],
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="space-y-10" id="skills">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/10">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-code-sm uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Skill Architecture</span>
          </div>
          <h2 className="font-headline-lg text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Technical Capabilities Matrix
          </h2>
          <p className="text-slate-400 leading-relaxed text-base">
            Structured domains spanning data engineering, statistical modeling, API development, and modern cloud platforms.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {categories.map((category, idx) => (
          <div
            key={idx}
            className="group relative p-7 rounded-3xl bg-[#0F172A]/50 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-cyan-950/30"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-400/40 transition-all">
                    <span className="material-symbols-outlined text-cyan-400 text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="font-headline-lg text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {category.title}
                  </h3>
                </div>
                <span className="font-code-sm text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                  {category.badge}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-code-sm text-xs px-3 py-1.5 bg-[#090A0F]/80 hover:bg-[#1E293B] border border-white/10 hover:border-cyan-400/40 rounded-lg text-slate-300 font-medium transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-code-sm">
              <span>{category.skills.length} core technologies</span>
              <span className="text-cyan-400/80">Proficient</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

