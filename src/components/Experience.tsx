import React from 'react';

interface Position {
  role: string;
  company: string;
  location: string;
  duration: string;
  highlights: string[];
}

export const Experience: React.FC = () => {
  const [positions, setPositions] = React.useState<Position[]>([
    {
      role: 'Data Analyst',
      company: 'Big Data Consult',
      location: 'Nigeria',
      duration: 'Jan 2024 – Present',
      highlights: [
        'Perform core data analysis and deliver actionable business intelligence reports.',
        'Develop interactive, real-time KPI dashboards using Power BI and Streamlit.',
        'Optimize database queries and data ingestion workflows using Python and SQL.',
        'Conduct workflow analysis to identify bottlenecks and improve overall data quality.',
      ],
    },
    {
      role: 'Senior IT Administrative Staff / Project Manager',
      company: 'Lins Consult',
      location: 'Nigeria',
      duration: 'Oct 2022 – Present',
      highlights: [
        'Manage IT administration and operational project planning.',
        'Coordinate cross-functional teams to align project deliverables with client requirements.',
        'Research technical solutions and provide progress reports to stakeholders.',
        'Maintain operational monitoring pipelines to track project health and milestones.',
      ],
    },
  ]);

  React.useEffect(() => {
    fetch('/api/experience')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPositions(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="space-y-10" id="experience">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/10">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-code-sm uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Career Progression</span>
          </div>
          <h2 className="font-headline-lg text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Professional Experience
          </h2>
          <p className="text-slate-400 leading-relaxed text-base">
            Track record bridging technical execution, business operations, and automated reporting.
          </p>
        </div>
      </div>

      <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-8">
        {positions.map((pos, idx) => (
          <div key={idx} className="relative pl-6 md:pl-10 group">
            {/* Timeline node with cyan glow */}
            <div className="absolute -left-[9px] top-4 w-[18px] h-[18px] bg-[#090A0F] border-2 border-cyan-400 rounded-full group-hover:scale-125 group-hover:bg-cyan-400 transition-all duration-300 shadow-md shadow-cyan-500/50" />

            <div className="p-7 rounded-3xl bg-[#0F172A]/50 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/30">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {pos.role}
                  </h3>
                  <p className="text-cyan-400 font-semibold text-sm mt-0.5">
                    {pos.company} <span className="text-slate-500">&bull;</span> <span className="text-slate-400 font-normal">{pos.location}</span>
                  </p>
                </div>
                <span className="font-code-sm text-xs px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-emerald-400 font-medium self-start sm:self-auto">
                  {pos.duration}
                </span>
              </div>

              <ul className="space-y-2.5 text-sm text-slate-300">
                {pos.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start space-x-2.5 leading-relaxed">
                    <span className="text-cyan-400 text-base leading-tight">&rsaquo;</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

