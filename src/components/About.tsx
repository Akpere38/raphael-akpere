import React from 'react';

interface FocusCard {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
}

export const About: React.FC = () => {
  const focusAreas: FocusCard[] = [
    {
      title: 'Data Analysis',
      description: 'Extracting actionable insights from complex datasets to drive strategic business decisions.',
      icon: 'query_stats',
      iconColor: 'text-[#3B82F6]',
    },
    {
      title: 'Business Intelligence',
      description: 'Designing interactive dashboards and reporting structures for real-time performance monitoring.',
      icon: 'insights',
      iconColor: 'text-[#10B981]',
    },
    {
      title: 'Software Development',
      description: 'Building robust, scalable applications and tools to solve specific operational challenges.',
      icon: 'integration_instructions',
      iconColor: 'text-[#6366F1]',
    },
    {
      title: 'API & Backend',
      description: 'Architecting reliable backend services and APIs for seamless data flow and integration.',
      icon: 'api',
      iconColor: 'text-[#3B82F6]',
    },
    {
      title: 'Automation',
      description: 'Streamlining repetitive workflows through intelligent scripting and automated pipelines.',
      icon: 'smart_toy',
      iconColor: 'text-[#10B981]',
    },
    {
      title: 'Business Solutions',
      description: 'Translating complex business requirements into elegant, technology-driven outcomes.',
      icon: 'lightbulb',
      iconColor: 'text-[#6366F1]',
    },
  ];

  return (
    <section className="space-y-12" id="about">
      <div className="space-y-4 max-w-2xl">
        <h2 className="font-headline-lg text-3xl font-bold text-white">
          Engineering Clarity from Complexity
        </h2>
        <p className="text-on-surface-variant leading-relaxed">
          I bridge the gap between raw information and strategic action. By combining analytical rigor with
          software engineering principles, I build systems that not only interpret the past but empower future
          decisions. My approach is rooted in clean architecture, accurate metrics, and scalable solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {focusAreas.map((area, index) => (
          <div
            key={index}
            className="glass-panel p-6 rounded-xl hover:border-[#475569] transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-[#0F172A] border border-[#334155] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className={`material-symbols-outlined ${area.iconColor} text-2xl`}>{area.icon}</span>
            </div>
            <h3 className="font-headline-lg text-[20px] font-semibold text-white mb-2">{area.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{area.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
