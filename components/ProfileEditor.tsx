"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IconEdit } from "@tabler/icons-react";

interface InlineEditFieldProps {
  value: string;
  onSave: (val: string) => Promise<boolean>;
  isOwner: boolean;
  textClassName?: string;
  inputClassName?: string;
  multiline?: boolean;
  placeholder?: string;
}

function InlineEditField({ value, onSave, isOwner, textClassName = "", inputClassName = "", multiline = false, placeholder }: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // 커서를 맨 끝으로 이동
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (currentValue.trim() === value) {
      setIsEditing(false);
      setCurrentValue(value);
      return;
    }

    if (currentValue.trim() === "") {
       // 비어있으면 기존 값으로 복구 (선택적)
       setCurrentValue(value);
       setIsEditing(false);
       return;
    }

    setIsSaving(true);
    const success = await onSave(currentValue.trim());
    setIsSaving(false);
    
    if (success) {
      setIsEditing(false);
    } else {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (!isOwner) {
    return <span className={textClassName}>{value || placeholder}</span>;
  }

  if (isEditing) {
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`w-full bg-transparent border-b-2 border-primary outline-none resize-none overflow-hidden ${inputClassName}`}
        placeholder={placeholder}
        disabled={isSaving}
        rows={3}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`bg-transparent border-b-2 border-primary outline-none ${inputClassName}`}
        placeholder={placeholder}
        disabled={isSaving}
      />
    );
  }

  return (
    <div 
      className="relative group cursor-pointer inline-flex items-center justify-center max-w-full"
      onClick={() => setIsEditing(true)}
    >
      <span className={`hover:bg-accent/50 rounded-md px-1 transition-colors ${textClassName}`}>
        {value || placeholder}
      </span>
      <IconEdit className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 absolute -right-6 transition-opacity" />
    </div>
  );
}

interface UserData {
  photoURL?: string;
  username?: string;
  bio?: string;
  displayName?: string;
}

interface ProfileEditorProps {
  userData: UserData;
  targetUid: string;
  currentDisplayName: string;
  readonly?: boolean;
}

export default function ProfileEditor({ userData, targetUid, currentDisplayName, readonly = false }: ProfileEditorProps) {
  const { user } = useAuth();
  const router = useRouter();
  
  const isOwner = !readonly && user?.uid === targetUid;

  const [localUserData, setLocalUserData] = useState<UserData>(userData);

  const handleUpdateField = async (field: keyof UserData, newValue: string) => {
    try {
      const userRef = doc(db, "users", targetUid);
      await updateDoc(userRef, {
        [field]: newValue
      });
      setLocalUserData(prev => ({ ...prev, [field]: newValue }));
      toast.success("프로필이 업데이트 되었습니다.");
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("프로필 업데이트에 실패했습니다.");
      return false;
    }
  };

  const handleUpdateDisplayName = async (newDisplayName: string) => {
    if (newDisplayName === currentDisplayName) return true;

    try {
      // 중복 확인
      const q = query(collection(db, "users"), where("displayName", "==", newDisplayName));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        toast.error("이미 사용 중인 URL 슬러그입니다.");
        return false;
      }

      // 업데이트
      const userRef = doc(db, "users", targetUid);
      await updateDoc(userRef, {
        displayName: newDisplayName
      });
      
      toast.success("URL 슬러그가 성공적으로 변경되었습니다.");
      
      // 새 URL로 리다이렉트
      router.push(`/${newDisplayName}`);
      return true;
    } catch (error) {
      console.error("Error updating displayName:", error);
      toast.error("URL 슬러그 변경에 실패했습니다.");
      return false;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {localUserData.photoURL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={localUserData.photoURL} 
          alt={localUserData.username || "Profile Picture"} 
          className="w-24 h-24 rounded-full object-cover shadow-sm"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold shadow-sm">
          {localUserData.username?.[0]?.toUpperCase() || currentDisplayName[0]?.toUpperCase() || "U"}
        </div>
      )}
      
      <div className="text-center space-y-1 w-full flex flex-col items-center">
        <InlineEditField
          value={localUserData.username || `@${currentDisplayName}`}
          onSave={(val) => handleUpdateField("username", val)}
          isOwner={isOwner}
          textClassName="text-2xl font-bold block max-w-full truncate"
          inputClassName="text-2xl font-bold text-center w-full min-w-[200px]"
          placeholder="이름을 입력하세요"
        />
        
        {localUserData.username && (
          <div className="flex items-center justify-center text-muted-foreground">
            <span className="text-sm font-medium mr-0.5">@</span>
            <InlineEditField
              value={currentDisplayName}
              onSave={handleUpdateDisplayName}
              isOwner={isOwner}
              textClassName="text-sm font-medium"
              inputClassName="text-sm font-medium text-center w-auto min-w-[100px]"
            />
          </div>
        )}
      </div>
      
      <div className="w-full text-center px-4">
        <InlineEditField
          value={localUserData.bio || ""}
          onSave={(val) => handleUpdateField("bio", val)}
          isOwner={isOwner}
          multiline={true}
          textClassName="text-muted-foreground whitespace-pre-wrap break-words block max-w-sm mx-auto"
          inputClassName="text-muted-foreground text-center w-full max-w-sm"
          placeholder="자기소개를 입력해주세요."
        />
      </div>
    </div>
  );
}
