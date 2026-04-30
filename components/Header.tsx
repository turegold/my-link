"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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
                  <Link href="/">
                    <Button variant="outline" size="sm" className="hidden sm:flex font-semibold text-xs">
                      내 페이지
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="relative h-10 w-10 rounded-full overflow-hidden p-0 border border-border bg-transparent hover:bg-accent transition-colors flex items-center justify-center">
                    {user.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.photoURL} alt={user.username || ""} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted text-lg font-semibold">
                        {user.username?.[0]?.toUpperCase() || user.displayName?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        @{user.displayName}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer w-full"
                      onClick={() => window.location.href = `/${user.displayName}`}
                    >
                      내 페이지 미리보기
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer" 
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/${user.displayName}`);
                        toast.success("링크가 복사되었습니다.");
                      }}
                    >
                      링크 복사
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={signOut}>
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
