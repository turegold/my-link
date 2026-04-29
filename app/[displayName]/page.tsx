import { Card } from "@/components/ui/card";
import LinkManager from "@/components/LinkManager";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ displayName: string }>;
}) {
  const { displayName } = await params;

  // users 컬렉션에서 displayName으로 유저 조회
  const q = query(collection(db, "users"), where("displayName", "==", displayName));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-2">프로필을 찾을 수 없습니다.</h1>
        <p className="text-muted-foreground">
          존재하지 않거나 삭제된 사용자입니다.
        </p>
      </div>
    );
  }

  const userDoc = querySnapshot.docs[0];
  const targetUid = userDoc.id;
  const userData = userDoc.data();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-16 px-4 font-sans text-foreground">
      <div className="w-full max-w-md space-y-8">
        {/* 프로필 정보 */}
        <div className="flex flex-col items-center space-y-4">
          {userData.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={userData.photoURL} 
              alt={userData.username} 
              className="w-24 h-24 rounded-full object-cover shadow-sm"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold shadow-sm">
              {userData.username?.[0]?.toUpperCase() || displayName[0]?.toUpperCase() || "U"}
            </div>
          )}
          
          <h1 className="text-2xl font-bold">{userData.username || `@${displayName}`}</h1>
          <p className="text-muted-foreground text-center">
            {userData.bio || "마이링크를 찾아주셔서 감사합니다."}
          </p>
        </div>

        {/* 링크 목록 및 관리 섹션 */}
        <LinkManager targetUid={targetUid} />
      </div>
    </div>
  );
}
