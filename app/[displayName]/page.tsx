import { dummyLinks } from "@/data/links";
import { Card } from "@/components/ui/card";

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

        {/* 링크 목록 섹션 */}
        <div className="flex flex-col space-y-4 w-full">
          {dummyLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full hover:-translate-y-1 hover:shadow-md transition-all duration-200 active:translate-y-0 active:shadow-sm"
            >
              <Card className="flex items-center p-4 bg-card text-card-foreground border-border rounded-xl">
                {link.icon ? (
                  <div className="w-10 flex justify-center flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={link.icon} alt={link.title} className="w-6 h-6 rounded-sm" />
                  </div>
                ) : (
                  <div className="w-10 flex-shrink-0" />
                )}
                <span className="flex-1 text-center font-bold text-lg pr-10 tracking-tight">
                  {link.title}
                </span>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
