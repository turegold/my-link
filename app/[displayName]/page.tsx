import { dummyLinks } from "@/data/links";
import { Card } from "@/components/ui/card";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ displayName: string }>;
}) {
  const { displayName } = await params;

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center py-16 px-4 font-sans text-neutral-900 dark:text-neutral-100">
      <div className="w-full max-w-md space-y-8">
        {/* Profile Info Placeholder */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center text-3xl font-bold">
            {displayName[0]?.toUpperCase() || "U"}
          </div>
          <h1 className="text-2xl font-bold">@{displayName}</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Welcome to my links!
          </p>
        </div>

        {/* Links Section */}
        <div className="flex flex-col space-y-4 w-full">
          {dummyLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full hover:-translate-y-1 hover:shadow-lg transition-all duration-200 active:translate-y-0 active:shadow-md"
            >
              <Card className="flex items-center p-4 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl">
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
