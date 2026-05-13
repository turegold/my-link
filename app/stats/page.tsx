"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link as LinkType } from "@/data/links";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { IconPointer, IconStar, IconLink, IconExternalLink } from "@tabler/icons-react";

const chartConfig = {
  clickCount: {
    label: "클릭 수",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function StatsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const { data: links = [], isLoading: isLinksLoading } = useQuery({
    queryKey: ["stats", "links", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const q = query(
        collection(db, "users", user.uid, "links"),
        orderBy("clickCount", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LinkType[];
    },
    enabled: !!user?.uid,
  });

  if (loading || isLinksLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const totalClicks = links.reduce((sum, link) => sum + (link.clickCount || 0), 0);
  const activeLinksCount = links.length;
  const mostPopularLink = links.length > 0 && (links[0].clickCount || 0) > 0 ? links[0].title : "없음";
  
  const chartData = links.map(link => ({
    title: link.title,
    clickCount: link.clickCount || 0,
  }));

  return (
    <div className="container max-w-4xl py-10 space-y-8 mx-auto px-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">통계</h1>
        <p className="text-muted-foreground mt-2">링크 클릭 통계를 한눈에 확인하세요.</p>
      </div>

      {/* 상단: 요약 카드 3개 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 클릭 수</CardTitle>
            <IconPointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">모든 링크의 합산 클릭 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">가장 인기 있는 링크</CardTitle>
            <IconStar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{mostPopularLink}</div>
            <p className="text-xs text-muted-foreground">최다 클릭 링크</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성화 링크 수</CardTitle>
            <IconLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLinksCount}</div>
            <p className="text-xs text-muted-foreground">등록된 전체 링크 개수</p>
          </CardContent>
        </Card>
      </div>

      {/* 중간: 그래프 */}
      <Card>
        <CardHeader>
          <CardTitle>링크별 클릭 분석 그래프</CardTitle>
          <CardDescription>가장 많이 클릭된 링크 순서대로 표시됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              아직 추가된 링크가 없습니다.
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="title"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 10) + (value.length > 10 ? '...' : '')}
                />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="clickCount" fill="var(--color-clickCount)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* 하단: 상세 리스트 */}
      <Card>
        <CardHeader>
          <CardTitle>상세 리스트</CardTitle>
          <CardDescription>모든 링크의 클릭 수를 순위별로 확인하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              아직 추가된 링크가 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {links.map((link, index) => (
                <div key={link.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-card hover:bg-accent/50 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-bold shrink-0">
                      {index + 1}
                    </div>
                    {link.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={link.icon} alt={link.title} className="w-8 h-8 rounded-sm object-contain shrink-0" />
                    ) : (
                      <div className="w-8 h-8 bg-muted rounded-sm shrink-0" />
                    )}
                    <div className="overflow-hidden">
                      <p className="font-semibold truncate">{link.title}</p>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs text-muted-foreground hover:underline flex items-center gap-1 truncate"
                      >
                        <span className="truncate max-w-[200px] sm:max-w-[300px]">{link.url}</span>
                        <IconExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 shrink-0">
                    <span className="text-xs text-muted-foreground sm:hidden">클릭 수</span>
                    <div>
                      <span className="font-bold text-lg">{link.clickCount || 0}</span>
                      <span className="text-xs text-muted-foreground ml-1">클릭</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
