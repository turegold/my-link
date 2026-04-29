"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  username: string | null;
  photoURL: string | null;
  bio: string | null;
  createdAt: any;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firestore에서 유저 정보 가져오기
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let profileData: UserProfile;

        if (userSnap.exists()) {
          profileData = userSnap.data() as UserProfile;
        } else {
          // 최초 로그인 시 유저 데이터 생성
          const emailPrefix = firebaseUser.email ? firebaseUser.email.split("@")[0] : `user_${Math.floor(Math.random() * 10000)}`;
          
          profileData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: emailPrefix, // URL slug
            username: firebaseUser.displayName || emailPrefix, // 실제 노출 이름
            photoURL: firebaseUser.photoURL,
            bio: "",
            createdAt: serverTimestamp(),
          };

          try {
            await setDoc(userRef, profileData);
          } catch (error) {
            console.error("Error creating user profile:", error);
            toast.error("프로필 생성 중 오류가 발생했습니다.");
          }
        }
        setUser(profileData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("로그인되었습니다.");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("로그인에 실패했습니다.");
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("로그아웃되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("로그아웃에 실패했습니다.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
