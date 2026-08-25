import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HadaMichi | Mỹ phẩm Nhật Bản",
  description:
    "Tuyển chọn mỹ phẩm Nhật Bản giúp chăm sóc làn da của bạn. HadaMichi",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansJp.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#faf6f1] font-sans text-stone-800">
        <header className="border-b border-stone-200 bg-white/90 backdrop-blur-sm">
          <h1 className="py-3 text-center text-lg font-semibold tracking-tight md:py-4 md:text-xl">
            <span className="text-stone-800">HadaMichi</span>
            <span className="ml-2 text-sm font-normal tracking-wide text-stone-400">
              Mỹ phẩm Nhật
            </span>
          </h1>
        </header>
        <main className="mx-auto w-full max-w-5xl px-3 py-4 md:px-4 md:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
