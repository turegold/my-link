"use client";

import { useState, useEffect } from "react";
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
import { collection, addDoc, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { IconEdit, IconTrash } from "@tabler/icons-react";

import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

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

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
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

      if (!link.id) throw new Error("Link ID is missing");
      const linkRef = doc(db, "users", targetUid, "links", link.id);
      await updateDoc(linkRef, {
        title: values.title,
        url: parsedUrl,
        icon: `https://s2.googleusercontent.com/s2/favicons?domain=${domain}`,
        updatedAt: serverTimestamp(),
      });
    },
    onMutate: async (values) => {
      setIsEditing(false); // 즉각적인 UI 피드백 (폼 닫기)
      
      await queryClient.cancelQueries({ queryKey: ["links", targetUid] });
      const previousLinks = queryClient.getQueryData(["links", targetUid]);

      let parsedUrl = values.url;
      if (!/^https?:\/\//i.test(values.url)) {
        parsedUrl = `https://${values.url}`;
      }
      let domain = "";
      try { domain = new URL(parsedUrl).hostname; } catch { domain = "example.com"; }

      queryClient.setQueryData(["links", targetUid], (old: LinkType[] | undefined) => {
        return old?.map(l => l.id === link.id ? { ...l, title: values.title, url: parsedUrl, icon: `https://s2.googleusercontent.com/s2/favicons?domain=${domain}` } : l);
      });

      return { previousLinks };
    },
    onSuccess: () => {
      toast.success("링크가 수정되었습니다.");
    },
    onError: (error, newLink, context) => {
      queryClient.setQueryData(["links", targetUid], context?.previousLinks);
      setIsEditing(true); // 에러 발생 시 다시 폼 열기
      console.error("Error updating link:", error);
      toast.error("링크 수정에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links", targetUid] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!link.id) throw new Error("Link ID is missing");
      const linkRef = doc(db, "users", targetUid, "links", link.id);
      await deleteDoc(linkRef);
    },
    onMutate: async () => {
      setIsDeleteDialogOpen(false); // 즉각적인 UI 피드백 (모달 닫기)
      
      await queryClient.cancelQueries({ queryKey: ["links", targetUid] });
      const previousLinks = queryClient.getQueryData(["links", targetUid]);
      queryClient.setQueryData(["links", targetUid], (old: LinkType[] | undefined) => {
        return old?.filter(l => l.id !== link.id);
      });
      return { previousLinks };
    },
    onSuccess: () => {
      toast.success("링크가 삭제되었습니다.");
    },
    onError: (error, newLink, context) => {
      queryClient.setQueryData(["links", targetUid], context?.previousLinks);
      console.error("Error deleting link:", error);
      toast.error("링크 삭제에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links", targetUid] });
    }
  });

  if (isEditing) {
    return (
      <Card className="p-4 bg-card text-card-foreground border-border rounded-xl shadow-sm">
        <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="space-y-4">
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
            <Button type="submit" className="flex-1" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "저장 중..." : "저장하기"}
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
                <Button variant="outline" className="flex-1 h-12 text-base" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteMutation.isPending}>
                  취소
                </Button>
                <Button variant="destructive" className="flex-1 h-12 text-base" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending ? "삭제 중..." : "삭제하기"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default function LinkManager({ targetUid, readonly = false }: { targetUid: string, readonly?: boolean }) {
  const { user } = useAuth();
  const isOwner = !readonly && user?.uid === targetUid;
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: links = [], isLoading } = useQuery({
    queryKey: ["links", targetUid],
    queryFn: async () => {
      const q = query(
        collection(db, "users", targetUid, "links"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LinkType[];
    },
    enabled: !!targetUid,
  });

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

  const addMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
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

      await addDoc(collection(db, "users", targetUid, "links"), {
        title: values.title,
        url: parsedUrl,
        icon: `https://s2.googleusercontent.com/s2/favicons?domain=${domain}`,
        createdAt: serverTimestamp(),
      });
    },
    onMutate: async (values) => {
      setIsOpen(false); // 즉각적인 피드백 (모달 닫기)
      reset(); // 즉각적인 폼 초기화
      
      await queryClient.cancelQueries({ queryKey: ["links", targetUid] });
      const previousLinks = queryClient.getQueryData(["links", targetUid]);

      let parsedUrl = values.url;
      if (!/^https?:\/\//i.test(values.url)) {
        parsedUrl = `https://${values.url}`;
      }
      let domain = "";
      try { domain = new URL(parsedUrl).hostname; } catch { domain = "example.com"; }

      queryClient.setQueryData(["links", targetUid], (old: LinkType[] | undefined) => {
        const optimisticLink: LinkType = {
          id: Math.random().toString(), // 임시 ID
          title: values.title,
          url: parsedUrl,
          icon: `https://s2.googleusercontent.com/s2/favicons?domain=${domain}`,
        };
        return [optimisticLink, ...(old || [])];
      });

      return { previousLinks };
    },
    onSuccess: () => {
      toast.success("새로운 링크가 추가되었습니다.");
    },
    onError: (error, newLink, context) => {
      queryClient.setQueryData(["links", targetUid], context?.previousLinks);
      console.error("Error adding link:", error);
      toast.error("링크 추가에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links", targetUid] });
    }
  });

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
            <form onSubmit={handleSubmit((data) => addMutation.mutate(data))} className="space-y-4 mt-4">
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
              <Button type="submit" className="w-full" disabled={addMutation.isPending}>
                {addMutation.isPending ? "추가 중..." : "추가하기"}
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
