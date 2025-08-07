import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "치과 마케팅 솔루션 추천 - 맞춤형 디지털 치과 마케팅 전략",
  description: "간단한 퀴즈를 통해 귀하의 비즈니스에 최적화된 마케팅 솔루션을 추천받으세요. 디지털 마케팅, 콘텐츠 마케팅, 소셜미디어 마케팅 등 맞춤형 전략을 제공합니다.",
  keywords: "치과마케팅 솔루션, 디지털 마케팅, 콘텐츠 마케팅, 소셜미디어 마케팅, 마케팅 전략, 비즈니스 마케팅",
  authors: [{ name: "티디컴퍼니" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
