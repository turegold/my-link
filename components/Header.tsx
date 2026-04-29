"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <span>MyLink</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href={`/${user.displayName}`}>
                    <Button variant="ghost" className="font-medium hidden sm:inline-flex">
                      내 프로필
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={signOut}>
                    로그아웃
                  </Button>
                </div>
              ) : (
                <Button onClick={signInWithGoogle} className="flex items-center gap-2">
                  <IconBrandGoogle className="w-5 h-5" />
                  <span>Google 로그인</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
