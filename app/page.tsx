import { redirect } from "next/navigation";

export default function Home() {
  // 첫 접속 시 turegold의 링크트리 페이지로 리디렉션
  redirect("/turegold");
}
