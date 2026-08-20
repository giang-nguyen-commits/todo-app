import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TODO App",
  description: "シンプルな TODO アプリ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 font-sans text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <h1 className="py-3 text-center text-lg font-semibold tracking-tight md:py-4 md:text-xl">
            TODO App
          </h1>
        </header>
        <main className="mx-auto w-full max-w-[640px] px-3 py-4 md:px-4 md:py-8">{children}</main>
      </body>
    </html>
  );
}
