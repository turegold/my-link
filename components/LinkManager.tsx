"use client";

import { useEffect, useState } from "react";
import { Link as LinkType } from "@/data/links";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { IconEdit, IconTrash } from "@tabler/icons-react";

import { useAuth } from "@/components/AuthProvider";

const formSchema = z.object({
  title: z.string().trim().min(1, { message: "제목을 최소 1자 이상 입력해주세요." }),
  url: z.string().trim().min(1, { message: "URL을 입력해주세요." }).refine(val => {
    try {
      new URL(val.startsWith('http') ? val : `https://${val}`);
      return true;
    } catch {
      return false;
    }
  }, { message: "유효한 도메인 또는 URL을 입력해주세요." }),
});

interface LinkItemProps {
  link: LinkType;
  targetUid: string;
  isOwner: boolean;
}

function LinkItem({ link, targetUid, isOwner }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
    },
  });

  useEffect(() => {
    if (!isEditing) {
      reset({ title: link.title, url: link.url });
    }
  }, [isEditing, link, reset]);

  const onEditSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    let parsedUrl = values.url;
    if (!/^https?:\/\//i.test(values.url)) {
      parsedUrl = `https://${values.url}`;
    }

    let domain = "";
    try {
      domain = new URL(parsedUrl).hostname;
    } catch {
      domain = "example.com";
    }

    try {
      if (!link.id) return;
      const linkRef = doc(db, "users", targetUid, "links", link.id);
      await updateDoc(linkRef, {
        title: values.title,
        url: parsedUrl,
        icon: `https://s2.googleusercontent.com/s2/favicons?domain=${domain}`,
        updatedAt: serverTimestamp(),
      });
      toast.success("링크가 수정되었습니다.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating link:", error);
      toast.error("링크 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (!link.id) return;
      const linkRef = doc(db, "users", targetUid, "links", link.id);
      await deleteDoc(linkRef);
      toast.success("링크가 삭제되었습니다.");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("링크 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <Card className="p-4 bg-card text-card-foreground border-border rounded-xl shadow-sm">
        <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`edit-title-${link.id}`} className={errors.title ? "text-destructive" : ""}>제목</Label>
            <Input
              id={`edit-title-${link.id}`}
              placeholder="예: 내 블로그"
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-sm text-destructive font-medium">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`edit-url-${link.id}`} className={errors.url ? "text-destructive" : ""}>URL</Label>
            <Input
              id={`edit-url-${link.id}`}
              placeholder="예: https://example.com"
              {...register("url")}
              aria-invalid={!!errors.url}
            />
            {errors.url && (
              <p className="text-sm text-destructive font-medium">{errors.url.message}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
              취소
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <div className="relative group block w-full">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full hover:-translate-y-1 hover:shadow-md transition-all duration-200 active:translate-y-0 active:shadow-sm"
      >
        <Card className="flex flex-row items-center p-4 bg-card text-card-foreground border-border rounded-xl">
          {link.icon ? (
            <div className="flex-shrink-0 mr-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={link.icon} alt={link.title} className="w-8 h-8 rounded-sm object-contain" />
            </div>
          ) : (
            <div className="w-8 h-8 mr-4 flex-shrink-0" />
          )}
          <span className="flex-1 text-left font-bold text-lg pr-16 tracking-tight truncate">
            {link.title}
          </span>
        </Card>
      </a>

      {/* 액션 버튼 */}
      {isOwner && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <IconEdit className="w-5 h-5" />
          </Button>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              }
            >
              <IconTrash className="w-5 h-5" />
            </DialogTrigger>
            <DialogContent onClick={(e) => e.stopPropagation()} className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">정말 삭제하시겠습니까?</DialogTitle>
              </DialogHeader>
              <div className="py-6 space-y-3">
                <p className="font-bold text-xl text-center text-foreground break-all px-4">{link.title}</p>
                <p className="text-destructive text-center font-semibold text-base">이 작업은 되돌릴 수 없습니다.</p>
              </div>
              <div className="flex gap-3 w-full">
                <Button variant="outline" className="flex-1 h-12 text-base" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                  취소
                </Button>
                <Button variant="destructive" className="flex-1 h-12 text-base" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "삭제 중..." : "삭제하기"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default function LinkManager({ targetUid }: { targetUid: string }) {
  const { user } = useAuth();
  const isOwner = user?.uid === targetUid;
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const q = query(
      collection(db, "users", targetUid, "links"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LinkType[];
      setLinks(fetchedLinks);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching links:", error);
      toast.error("링크 목록을 불러오는데 실패했습니다.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    let parsedUrl = values.url;
    if (!/^https?:\/\//i.test(values.url)) {
      parsedUrl = `https://${values.url}`;
    }

    let domain = "";
    try {
      domain = new URL(parsedUrl).hostname;
    } catch {
      domain = "example.com";
    }

    try {
      await addDoc(collection(db, "users", targetUid, "links"), {
        title: values.title,
        url: parsedUrl,
        icon: `https://s2.googleusercontent.com/s2/favicons?domain=${domain}`,
        createdAt: serverTimestamp(),
      });

      toast.success("새로운 링크가 추가되었습니다.");
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Error adding link:", error);
      toast.error("링크 추가에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex justify-center py-8 w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 w-full">
      {/* 링크 추가 버튼 (다이얼로그 트리거) */}
      {isOwner && (
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) reset();
        }}>
          <DialogTrigger
            render={
              <Button
                variant="outline"
                className="w-full h-14 border-dashed rounded-xl flex items-center gap-2 text-muted-foreground hover:text-foreground"
              />
            }
          >
            <span className="text-xl">+</span>
            <span className="font-semibold text-base">새 링크 추가</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>새 링크 추가</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>제목</Label>
                <Input
                  id="title"
                  placeholder="예: 내 블로그"
                  {...register("title")}
                  aria-invalid={!!errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-destructive font-medium">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="url" className={errors.url ? "text-destructive" : ""}>URL</Label>
                <Input
                  id="url"
                  placeholder="예: https://example.com"
                  {...register("url")}
                  aria-invalid={!!errors.url}
                />
                {errors.url && (
                  <p className="text-sm text-destructive font-medium">{errors.url.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "추가 중..." : "추가하기"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* 링크 목록 */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : links.map((link) => (
        <LinkItem key={link.id} link={link} targetUid={targetUid} isOwner={isOwner} />
      ))}
    </div>
  );
}
