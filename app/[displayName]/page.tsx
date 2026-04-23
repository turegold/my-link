import { Card } from "@/components/ui/card";
import LinkManager from "@/components/LinkManager";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ displayName: string }>;
}) {
  const { displayName } = await params;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-16 px-4 font-sans text-foreground">
      <div className="w-full max-w-md space-y-8">
        {/* 프로필 정보 (임시) */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold">
            {displayName[0]?.toUpperCase() || "U"}
          </div>
          <h1 className="text-2xl font-bold">@{displayName}</h1>
          <p className="text-muted-foreground">
            마이링크를 찾아주셔서 감사합니다.
          </p>
        </div>

        {/* 링크 목록 및 관리 섹션 */}
        <LinkManager />
      </div>
    </div>
  );
}
