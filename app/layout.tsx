import type { Metadata } from "next";

export const metadata: Metadata = {
  title: " 다현 전용 배달의민족",
  description: "컴퓨터과학개론 202211747",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Tailwind CSS 디자인 도구를 실시간으로 직접 주입하는 치트키 코드 */}
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}