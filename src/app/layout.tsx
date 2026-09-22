import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const font = Noto_Sans_KR({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "TCI-Lens | 기질·성격 진단",
  description: "표준 TCI 모델 기반 기질·성격 분석 웹앱",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${font.className} min-h-screen bg-cream text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
