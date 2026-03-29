export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export const dummyLinks: Link[] = [
  {
    id: "1",
    title: "인스타그램",
    url: "https://instagram.com/example",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=instagram.com"
  },
  {
    id: "2",
    title: "유튜브",
    url: "https://youtube.com/example",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=youtube.com"
  },
  {
    id: "3",
    title: "블로그",
    url: "https://blog.example.com",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=blog.example.com"
  },
  {
    id: "4",
    title: "GitHub",
    url: "https://github.com/example",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=github.com"
  },
  {
    id: "5",
    title: "포트폴리오",
    url: "/portfolio",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=example.com"
  }
];
