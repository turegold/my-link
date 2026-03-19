import React from 'react';

export default function Contact() {
  return (
    <footer id="contact" className="py-32 relative overflow-hidden bg-[#ffed4a] dark:bg-yellow-600 border-t-[6px] border-black dark:border-white">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div className="neo-box inline-block px-8 py-4 bg-white dark:bg-zinc-800 -rotate-2 mb-12">
            <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tight">Let&apos;s Connect</h2>
        </div>
        
        <p className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-16 max-w-2xl mx-auto bg-white/40 dark:bg-black/40 p-6 md:p-8 border-[6px] border-black">
          새로운 도전을 함께할 멋진 팀을 찾고 있습니다. 프로젝트 문의나 커피챗 제안 모두 환영합니다!
        </p>

        <a 
          href="mailto:hello@example.com" 
          className="neo-btn inline-flex items-center gap-4 px-10 py-5 text-2xl md:text-3xl font-black bg-[#ff5252] dark:bg-red-500 text-black dark:text-white hover:-rotate-1"
        >
          <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          이메일 보내기
        </a>

        <div className="mt-28 flex justify-center gap-6 md:gap-8">
          {[
            { name: 'GitHub', color: 'bg-white', icon: <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path> },
            { name: 'LinkedIn', color: 'bg-[#4deeea]', icon: <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path> },
            { name: 'Blog', color: 'bg-[#ff90e8]', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path> }
          ].map((social, idx) => (
            <a key={idx} href="#" className={`w-16 h-16 md:w-20 md:h-20 neo-btn flex items-center justify-center text-black ${social.color} hover:-translate-y-2 hover:-rotate-6`}>
              <span className="sr-only">{social.name}</span>
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
                {social.icon}
              </svg>
            </a>
          ))}
        </div>
        
        <p className="mt-20 text-lg md:text-xl font-bold text-black dark:text-white bg-white/30 dark:bg-black/30 inline-block px-6 py-2 border-[3px] border-black">
          © {new Date().getFullYear()} 이용민. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
