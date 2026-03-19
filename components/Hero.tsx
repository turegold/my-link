import React from 'react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-10 border-b-[6px] border-black dark:border-white bg-[#f4f0ae] dark:bg-[#1a1a1a] overflow-hidden">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-block neo-box px-6 py-3 bg-[#ff90e8] dark:bg-purple-600 -rotate-2">
            <span className="text-xl md:text-2xl font-black text-black dark:text-white uppercase tracking-wider">
              🚀 Hello World
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter text-black dark:text-white leading-[1.1]">
            안녕하세요, <br />
            <span className="text-[#ff5252] dark:text-[#ff6b6b] drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] dark:drop-shadow-[5px_5px_0px_rgba(255,255,255,1)]">
              이용민
            </span>
            입니다.
          </h1>
          
          <p className="text-2xl md:text-3xl font-bold text-black dark:text-zinc-200 max-w-lg leading-snug">
            아름답고 직관적인 사용자 경험을 만드는 <br className="hidden md:block"/>
            <span className="inline-block mt-2 bg-[#4deeea] dark:bg-cyan-600 px-3 py-1 border-4 border-black dark:border-white">소프트웨어 엔지니어</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-6">
            <a href="#projects" className="neo-btn px-8 py-4 text-center text-xl bg-[#c4a1ff] dark:bg-indigo-600 text-black dark:text-white">
              프로젝트 보기
            </a>
            <a href="#contact" className="neo-btn px-8 py-4 text-center text-xl bg-white dark:bg-zinc-800 text-black dark:text-white">
              연락하기
            </a>
          </div>
        </div>

        {/* Decorational Graphic for Neobrutalism */}
        <div className="hidden lg:flex justify-center items-center relative h-[500px] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="absolute w-[320px] h-[320px] bg-[#ff90e8] dark:bg-purple-600 border-[6px] border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] rotate-6 transition-transform hover:rotate-12 duration-300 z-10 flex items-center justify-center group cursor-pointer">
             <span className="text-9xl group-hover:scale-110 transition-transform">💻</span>
          </div>
          <div className="absolute w-[320px] h-[320px] bg-[#4deeea] dark:bg-cyan-600 border-[6px] border-black dark:border-white rotate-[-12deg] z-0"></div>
          {/* Floating elements */}
          <div className="absolute top-10 right-10 w-16 h-16 bg-[#ffed4a] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-20 left-10 w-20 h-20 bg-[#ff5252] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-45"></div>
        </div>

      </div>
    </section>
  );
}
