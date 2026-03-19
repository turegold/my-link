import React from 'react';

const skills = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS', 'Zustand'], color: 'bg-[#ff90e8]', icon: '✨' },
  { category: 'Backend', items: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'REST APIs'], color: 'bg-[#4deeea]', icon: '⚙️' },
  { category: 'Tools & DevOps', items: ['Git', 'GitHub', 'Vercel', 'Figma', 'VS Code', 'npm/yarn'], color: 'bg-[#ffed4a]', icon: '🛠️' },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative bg-[#c4a1ff] dark:bg-indigo-900 border-b-[6px] border-black dark:border-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16 text-center md:text-left">
          <div className="neo-box inline-block px-8 py-4 bg-white dark:bg-zinc-800 -rotate-2">
            <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tight">Tech Skills</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {skills.map((skillGroup, idx) => (
            <div 
              key={idx} 
              className={`neo-box p-8 ${skillGroup.color} dark:brightness-90 flex flex-col hover:-translate-y-2 hover:translate-x-2 transition-transform duration-300`}
            >
              <h3 className="text-3xl font-black text-black mb-8 border-b-4 border-black pb-4 flex items-center gap-3">
                <span className="text-4xl bg-white border-[3px] border-black p-2 rounded-full aspect-square flex items-center justify-center">{skillGroup.icon}</span>
                {skillGroup.category}
              </h3>
              <div className="flex flex-wrap gap-3 mt-auto">
                {skillGroup.items.map((skill, sIdx) => (
                  <span 
                    key={sIdx} 
                    className="px-4 py-2 text-lg font-bold bg-white text-black border-[3px] border-black hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
