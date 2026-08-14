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
    <section className="space-y-12" id="experience">
      <div className="space-y-4 max-w-2xl">
        <h2 className="font-headline-lg text-3xl font-bold text-white">Professional Experience</h2>
        <p className="text-on-surface-variant leading-relaxed">
          My professional history bridging the gap between business management, technical coordination, and data analytics.
        </p>
      </div>

      <div className="relative border-l border-[#334155] ml-4 md:ml-6 space-y-10">
        {positions.map((pos, idx) => (
          <div key={idx} className="relative pl-6 md:pl-8 group">
            {/* Timeline node */}
            <div className="absolute -left-[9px] top-1.5 w-[17px] h-[17px] bg-[#0F172A] border-2 border-[#3B82F6] rounded-full group-hover:scale-125 transition-transform duration-200" />

            <div className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] hover:border-[#475569] transition-colors duration-300">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{pos.role}</h3>
                  <p className="text-[#3B82F6] font-semibold text-sm">
                    {pos.company} &bull; <span className="text-on-surface-variant font-normal">{pos.location}</span>
                  </p>
                </div>
                <span className="font-code-sm text-xs px-3 py-1 bg-[#0F172A] border border-[#334155] rounded-md text-[#94A3B8] self-start md:self-auto">
                  {pos.duration}
                </span>
              </div>

              <ul className="list-disc pl-4 space-y-2 text-sm text-on-surface-variant">
                {pos.highlights.map((highlight, index) => (
                  <li key={index} className="leading-relaxed">
                    {highlight}
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
