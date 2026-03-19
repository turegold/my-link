import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-white dark:bg-zinc-900 border-b-[6px] border-black dark:border-white">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-16 neo-box inline-block px-8 py-4 bg-[#ffed4a] dark:bg-yellow-600 rotate-2">
          <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tight">About Me</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start relative z-10 mt-8">
          
          <div className="neo-box p-8 md:p-12 space-y-6 text-xl md:text-2xl font-bold bg-[#ff90e8] dark:bg-purple-600 text-black dark:text-white leading-relaxed">
            <p>
              웹 개발의 세계에 깊이 매료되어, 사용자가 편안함을 느끼고 <span className="bg-white text-black px-2 mt-1 inline-block border-4 border-black">직관적으로 사용할 수 있는 인터페이스</span>를 고민합니다.
            </p>
            <p>
              단순히 코드를 작성하는 것을 넘어, 비즈니스 목적에 부합하고 성능적으로 뛰어난 애플리케이션을 구축하기 위해 최신 기술 동향을 꾸준히 공부하고 적용하고 있습니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: '거주지', value: 'Seoul, Korea', color: 'bg-[#4deeea]' },
              { label: '학력', value: '광운대학교 재학중', color: 'bg-[#ffed4a]' },
              { label: '전공', value: '컴퓨터/소프트웨어', color: 'bg-[#ff6b6b]' },
              { label: '관심 분야', value: 'Frontend / Fullstack', color: 'bg-[#c4a1ff]' },
            ].map((item, index) => (
              <div key={index} className={`neo-box p-6 flex flex-col justify-center gap-2 ${item.color} hover:-translate-y-2 hover:translate-x-2 transition-transform duration-300 dark:brightness-75`}>
                <span className="text-sm md:text-base font-black text-black/70 dark:text-white/80 uppercase">{item.label}</span>
                <span className="text-xl md:text-2xl font-black text-black dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
