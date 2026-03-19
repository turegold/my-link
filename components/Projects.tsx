import React from 'react';

// You can easily change this mock data to your real projects
const projectsData = [
  {
    title: '포트폴리오 웹사이트',
    description: 'Next.js 14와 Tailwind CSS v4를 활용하여 제작한 개인 포트폴리오 웹사이트입니다. 반응형 디자인과 스무스 애니메이션, 다크모드를 지원합니다.',
    tags: ['Next.js', 'React', 'Tailwind v4', 'Vercel'],
    link: '#',
    github: '#',
    year: '2025',
    color: 'bg-[#ff90e8]'
  },
  {
    title: 'Task Management App',
    description: '효율적인 일정 관리를 위한 칸반보드 기반의 태스크 매니지먼트 애플리케이션입니다. 드래그 앤 드롭 기능을 제공합니다.',
    tags: ['React', 'TypeScript', 'Zustand', 'Prisma'],
    link: '#',
    github: '#',
    year: '2024',
    color: 'bg-[#ffed4a]'
  },
  {
    title: 'E-commerce Platform',
    description: '모의 결제 시스템과 장바구니 기능을 구현한 이커머스 플랫폼 데모입니다. 사용자 인증 및 결제 플로우를 학습했습니다.',
    tags: ['Node.js', 'Express', 'Next.js', 'Stripe'],
    link: '#',
    github: '#',
    year: '2023',
    color: 'bg-[#4deeea]'
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative bg-white dark:bg-[#1a1a1a] border-b-[6px] border-black dark:border-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center md:text-right mb-16">
          <div className="neo-box inline-block px-8 py-4 bg-[#ff6b6b] dark:bg-red-600 rotate-1">
            <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tight">Featured Projects</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projectsData.map((project, idx) => (
            <div 
              key={idx} 
              className={`neo-box p-8 flex flex-col h-full relative group ${project.color} dark:brightness-90 hover:-translate-y-2 hover:translate-x-2 transition-transform duration-300`}
            >
              <div className="flex justify-between items-start mb-6 align-top border-b-[3px] border-black pb-4">
                <div className="w-14 h-14 border-[3px] border-black bg-white flex items-center justify-center text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <span className="text-xl font-black text-black bg-white px-3 py-1 border-[3px] border-black">{project.year}</span>
              </div>
              
              <h3 className="text-3xl font-black text-black mb-4 leading-tight">{project.title}</h3>
              <p className="text-black/80 font-bold mb-8 flex-grow leading-relaxed text-lg bg-white/50 p-4 border-[3px] border-black">
                {project.description}
              </p>
              
              <div className="space-y-6 mt-auto">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-sm font-black text-black bg-white border-[3px] border-black px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4 pt-6">
                  <a href={project.github} className="neo-btn flex-1 py-3 text-center text-lg bg-white text-black flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                    Code
                  </a>
                  <a href={project.link} className="neo-btn flex-1 py-3 text-center text-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
