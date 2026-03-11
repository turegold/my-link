export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-black font-sans">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          이용민
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          안녕하세요! 새로운 시작을 준비하는 개발자입니다.
        </p>
        <div className="pt-8 flex justify-center gap-4">
          <div className="h-1 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        </div>
      </div>
    </main>
  );
}
