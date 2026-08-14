import React from 'react';

interface Degree {
  degree: string;
  institution: string;
  year: string;
}

interface Certification {
  name: string;
  year: string;
}

export const EducationCertifications: React.FC = () => {
  const [education, setEducation] = React.useState<Degree[]>([
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'National Open University of Nigeria',
      year: 'Expected 2027',
    },
    {
      degree: 'Ordinary National Diploma – Science Laboratory Technology',
      institution: 'Delta State Polytechnic, Otefe',
      year: '2015',
    },
  ]);

  const [certifications, setCertifications] = React.useState<Certification[]>([
    {
      name: 'Google Advanced Data Analytics Professional Certificate',
      year: '2024',
    },
    {
      name: 'Python Developer Certificate',
      year: '2023',
    },
  ]);

  React.useEffect(() => {
    fetch('/api/education')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        if (data) {
          if (Array.isArray(data.education) && data.education.length > 0) {
            setEducation(data.education);
          }
          if (Array.isArray(data.certifications) && data.certifications.length > 0) {
            setCertifications(data.certifications);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="space-y-12" id="education">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Education Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#3B82F6] text-2xl">school</span>
            <h2 className="font-headline-lg text-2xl font-bold text-white">Education</h2>
          </div>
          <div className="space-y-4">
            {education.map((edu, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] hover:border-[#475569] transition-colors duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-headline-lg text-lg font-semibold text-white leading-snug">
                    {edu.degree}
                  </h3>
                  <p className="text-sm text-on-surface-variant mt-1">{edu.institution}</p>
                </div>
                <div className="mt-4 self-start font-code-sm text-xs px-2.5 py-1 bg-[#0F172A] border border-[#334155] rounded text-[#94A3B8]">
                  {edu.year}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#10B981] text-2xl">workspace_premium</span>
            <h2 className="font-headline-lg text-2xl font-bold text-white">Certifications</h2>
          </div>
          <div className="space-y-4">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] hover:border-[#475569] transition-colors duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-headline-lg text-lg font-semibold text-white leading-snug">
                    {cert.name}
                  </h3>
                </div>
                <div className="mt-4 self-start font-code-sm text-xs px-2.5 py-1 bg-[#0F172A] border border-[#334155] rounded text-[#94A3B8]">
                  {cert.year}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
