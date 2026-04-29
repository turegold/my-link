import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        나만의 링크를 <br className="md:hidden" />
        <span className="text-primary">하나의 주소로</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-[600px]">
        인스타그램, 유튜브, 블로그 등 당신의 모든 링크를 하나의 프로필에 담아보세요. 구글 로그인만으로 쉽고 빠르게 시작할 수 있습니다.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="bg-muted px-6 py-4 rounded-xl border text-sm text-left shadow-sm">
          <p className="font-semibold mb-2">🚀 시작하는 방법:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>우측 상단의 <strong className="text-foreground">Google 로그인</strong> 버튼 클릭</li>
            <li>자동으로 생성된 나만의 프로필 주소 확인</li>
            <li>내 프로필에서 링크 추가 및 관리</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
