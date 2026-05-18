"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProfileEditor from "@/components/ProfileEditor";
import LinkManager from "@/components/LinkManager";
import { IconBrandGoogle, IconLink, IconChartBar, IconShare, IconPointer } from "@tabler/icons-react";

function LandingPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl mx-auto px-4 py-16 lg:py-32 gap-12 lg:gap-20">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"></div>

        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left z-10 space-y-8 flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2 border border-primary/20 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            지금 바로 무료로 시작하세요
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15]">
            나만의 링크를 <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              하나의 주소로
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-[500px] leading-relaxed">
            인스타그램, 유튜브, 블로그 등 흩어져 있는 당신의 모든 링크를 하나의 멋진 프로필에 담아보세요. 구글 로그인만으로 쉽고 빠르게 완성됩니다.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button size="lg" onClick={signInWithGoogle} className="w-full sm:w-auto flex items-center justify-center gap-2 text-lg h-14 px-8 rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1">
              <IconBrandGoogle className="w-6 h-6" />
              <span>Google 계정으로 시작하기</span>
            </Button>
            <p className="text-sm text-muted-foreground mt-2 sm:mt-0 px-2">완전 무료, 광고 없음</p>
          </div>
        </div>

        {/* Visual Mockup */}
        <div className="flex-1 w-full max-w-sm lg:max-w-md flex justify-center z-10 relative mt-10 lg:mt-0 perspective-1000">
          <div className="w-full max-w-[320px] aspect-[9/18] bg-card border-8 border-muted rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col items-center py-10 px-5 transform transition-transform hover:-translate-y-2 hover:rotate-1 duration-500 relative">
            {/* Mockup Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-muted rounded-b-2xl"></div>
            
            {/* Mockup Content */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 mb-4 p-[3px] shadow-md">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                <span className="text-3xl">👋</span>
              </div>
            </div>
            
            <h3 className="text-lg font-bold mb-1">김마이링크</h3>
            <p className="text-xs text-muted-foreground mb-6">크리에이터 • 디자이너</p>
            
            <div className="w-full space-y-3 flex-1">
              {[
                { title: "📸 인스타그램", color: "bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800" },
                { title: "🎥 유튜브 채널", color: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" },
                { title: "✍️ 네이버 블로그", color: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800" }
              ].map((link, i) => (
                <div key={i} className={`w-full py-3 px-4 rounded-xl border ${link.color} flex items-center justify-between font-medium shadow-sm transition-transform`}>
                  <span className="text-sm">{link.title}</span>
                  <IconPointer className="w-4 h-4 opacity-50" />
                </div>
              ))}
            </div>

            {/* Floating click stat */}
            <div className="absolute bottom-6 right-[-20px] bg-card rounded-2xl shadow-xl border p-3 flex items-center gap-3 animate-bounce">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <IconChartBar className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground font-medium">오늘의 방문자</p>
                <p className="text-sm font-bold">1,248명</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative bg-background py-24 px-4 overflow-hidden border-t border-primary/10">
        {/* Background blobs for features */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-50"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              왜 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">마이링크</span>를 선택해야 할까요?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">복잡한 설정 없이, 가장 직관적이고 아름다운 링크 프로필을 제공합니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <IconLink className="w-8 h-8" />,
                title: "단 하나의 링크",
                desc: "여러 개의 링크를 하나로 묶어 SNS 프로필에 등록하세요. 더 이상 프로필 링크를 교체할 필요가 없습니다.",
                gradient: "from-blue-500 to-cyan-400",
                shadow: "hover:shadow-blue-500/20"
              },
              {
                icon: <IconChartBar className="w-8 h-8" />,
                title: "실시간 통계 제공",
                desc: "어떤 링크가 가장 인기가 많은지, 몇 명이나 클릭했는지 대시보드에서 실시간으로 확인하세요.",
                gradient: "from-purple-500 to-pink-500",
                shadow: "hover:shadow-purple-500/20"
              },
              {
                icon: <IconShare className="w-8 h-8" />,
                title: "어디서나 간편한 공유",
                desc: "생성된 프로필 주소를 카카오톡, 인스타그램, 이메일 서명 등 어디에나 쉽게 공유하세요.",
                gradient: "from-pink-500 to-orange-400",
                shadow: "hover:shadow-pink-500/20"
              }
            ].map((feature, i) => (
              <div key={i} className={`relative bg-card/40 backdrop-blur-xl rounded-3xl p-8 border border-muted/50 dark:border-white/5 transition-all duration-300 group ${feature.shadow} hover:-translate-y-2 overflow-hidden shadow-xl`}>
                {/* Hover Gradient Background Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`}></div>
                
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white bg-gradient-to-br ${feature.gradient} shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
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
