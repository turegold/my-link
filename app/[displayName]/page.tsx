import { Card } from "@/components/ui/card";
import LinkManager from "@/components/LinkManager";
import ProfileEditor from "@/components/ProfileEditor";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";

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
    notFound();
  }

  const userDoc = querySnapshot.docs[0];
  const rawData = userDoc.data();

  // username이 없으면 404 페이지로 이동
  if (!rawData.username) {
    notFound();
  }
  const targetUid = userDoc.id;
  const userData = {
    photoURL: rawData.photoURL || null,
    username: rawData.username || null,
    bio: rawData.bio || null,
    displayName: rawData.displayName || null,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-16 px-4 font-sans text-foreground">
      <div className="w-full max-w-md space-y-8">
        {/* 프로필 정보 */}
        <ProfileEditor 
          userData={userData as any} 
          targetUid={targetUid} 
          currentDisplayName={displayName} 
          readonly={true}
        />

        {/* 링크 목록 및 관리 섹션 */}
        <LinkManager targetUid={targetUid} readonly={true} />
      </div>
    </div>
  );
}
