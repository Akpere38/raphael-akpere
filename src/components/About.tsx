import React from 'react';

interface FocusCard {
  title: string;
  description: string;
  icon: string;
  badge: string;
  iconColor: string;
}

export const About: React.FC = () => {
  const focusAreas: FocusCard[] = [
    {
      title: 'Data Analysis',
      description: 'Extracting actionable insights from complex datasets to drive strategic business decisions.',
      icon: 'query_stats',
      badge: 'Insights',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'Business Intelligence',
      description: 'Designing interactive dashboards and reporting structures for real-time performance monitoring.',
      icon: 'insights',
      badge: 'Power BI',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Software Development',
      description: 'Building robust, scalable applications and tools to solve specific operational challenges.',
      icon: 'integration_instructions',
      badge: 'Full-Stack',
      iconColor: 'text-blue-400',
    },
    {
      title: 'API & Backend',
      description: 'Architecting reliable backend services and APIs for seamless data flow and integration.',
      icon: 'api',
      badge: 'FastAPI / SQL',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'Automation',
      description: 'Streamlining repetitive workflows through intelligent scripting and automated pipelines.',
      icon: 'smart_toy',
      badge: 'Pipelines',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Business Solutions',
      description: 'Translating complex business requirements into elegant, technology-driven outcomes.',
      icon: 'lightbulb',
      badge: 'Strategy',
      iconColor: 'text-indigo-400',
    },
  ];

  return (
    <section className="space-y-10" id="about">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/10">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-code-sm uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Core Philosophy</span>
          </div>
          <h2 className="font-headline-lg text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Engineering Clarity from Complexity
          </h2>
          <p className="text-slate-400 leading-relaxed text-base">
            I bridge the gap between raw information and strategic action. By combining analytical rigor with
            software engineering principles, I build systems that not only interpret the past but empower future
            decisions.
          </p>
        </div>
        <div className="hidden lg:flex items-center space-x-4 px-4 py-3 rounded-2xl bg-[#0F172A]/70 border border-white/10 text-xs text-slate-300 font-code-sm">
          <span className="text-emerald-400 font-bold">100%</span>
          <span>Practical &amp; Production-Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {focusAreas.map((area, index) => (
          <div
            key={index}
            className="group relative p-6 rounded-2xl bg-[#0F172A]/50 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-900/90 border border-white/10 rounded-xl flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-400/40 transition-all">
                  <span className={`material-symbols-outlined ${area.iconColor} text-2xl`}>{area.icon}</span>
                </div>
                <span className="font-code-sm text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                  {area.badge}
                </span>
              </div>
              <h3 className="font-headline-lg text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {area.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{area.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-xs text-slate-500 font-code-sm group-hover:text-slate-300 transition-colors">
              <span>Explore Capability</span>
              <span className="material-symbols-outlined text-[14px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

