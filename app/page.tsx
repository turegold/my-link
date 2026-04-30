"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProfileEditor from "@/components/ProfileEditor";
import LinkManager from "@/components/LinkManager";

function LandingPage() {
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

function Dashboard({ uid }: { uid: string }) {
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userProfile", uid],
    queryFn: async () => {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const rawData = userSnap.data();
        return {
          photoURL: rawData.photoURL || null,
          username: rawData.username || null,
          bio: rawData.bio || null,
          displayName: rawData.displayName || null,
        };
      }
      return null;
    },
    enabled: !!uid,
  });

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-2">프로필 정보를 불러올 수 없습니다.</h1>
        <p className="text-muted-foreground">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background flex flex-col items-center py-16 px-4 font-sans text-foreground">
      <div className="w-full max-w-md space-y-8">
        {/* 프로필 편집 (내 마이페이지이므로 readonly=false) */}
        <ProfileEditor 
          userData={userData as any} 
          targetUid={uid} 
          currentDisplayName={userData.displayName || ""} 
          readonly={false}
        />

        {/* 링크 목록 및 관리 섹션 (내 마이페이지이므로 readonly=false) */}
        <LinkManager targetUid={uid} readonly={false} />
      </div>
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard uid={user.uid} />;
  }

  return <LandingPage />;
}
