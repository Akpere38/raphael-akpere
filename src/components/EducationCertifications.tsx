import React from 'react';

interface Degree {
  degree: string;
  institution: string;
  year: string;
}

interface Certification {
  name: string;
  year: string;
  issuer?: string;
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
      issuer: 'Google Career Certificates',
      year: '2024',
    },
    {
      name: 'Python Developer Certificate',
      issuer: 'Professional Certification',
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
    <section className="space-y-10" id="education">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Education Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 pb-2 border-b border-white/10">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-cyan-400 text-xl">school</span>
            </div>
            <h2 className="font-headline-lg text-2xl font-bold text-white">Academic Degrees</h2>
          </div>

          <div className="space-y-4">
            {education.map((edu, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-3xl bg-[#0F172A]/50 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div>
                  <h3 className="font-headline-lg text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {edu.degree}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{edu.institution}</p>
                </div>
                <div className="self-start font-code-sm text-xs px-3 py-1 rounded-full bg-[#090A0F]/80 border border-white/10 text-cyan-300">
                  {edu.year}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 pb-2 border-b border-white/10">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-400 text-xl">workspace_premium</span>
            </div>
            <h2 className="font-headline-lg text-2xl font-bold text-white">Professional Certifications</h2>
          </div>

          <div className="space-y-4">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-3xl bg-[#0F172A]/50 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div>
                  <h3 className="font-headline-lg text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {cert.name}
                  </h3>
                  {cert.issuer && <p className="text-sm text-slate-400 mt-1">{cert.issuer}</p>}
                </div>
                <div className="self-start font-code-sm text-xs px-3 py-1 rounded-full bg-[#090A0F]/80 border border-white/10 text-emerald-300">
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

