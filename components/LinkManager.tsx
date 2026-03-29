"use client";

import { useState } from "react";
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

export default function LinkManager({ initialLinks }: { initialLinks: LinkType[] }) {
  const [links, setLinks] = useState<LinkType[]>(initialLinks);
  const [isOpen, setIsOpen] = useState(false);

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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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

    const newLink: LinkType = {
      id: Date.now().toString(),
      title: values.title,
      url: parsedUrl,
      icon: `https://s2.googleusercontent.com/s2/favicons?domain=${domain}`,
    };

    setLinks([newLink, ...links]);
    setIsOpen(false);
    reset();
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      {/* 링크 추가 버튼 (다이얼로그 트리거) */}
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
            <Button type="submit" className="w-full">
              추가하기
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* 링크 목록 */}
      {links.map((link) => (
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
  );
}
