// src/app/layout.tsx
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
  title: "DigiBK | Platform Konseling Modern",
  description: "Platform Konseling Modern yang dikembangkan oleh Hendi Prasetyo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id" // Sebaiknya menggunakan 'id' karena aplikasimu berbahasa Indonesia
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">

        {/* Konten utama dari setiap halaman akan di-render di sini */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Footer global yang akan muncul di semua halaman */}
        <footer className="w-full py-4 mt-auto border-t border-slate-200 bg-slate-50 text-center z-50">
          <p className="text-xs font-medium text-slate-500">
            &copy; {new Date().getFullYear()} digitech.id - Dikembangkan oleh Hendi Prasetyo
          </p>
        </footer>

      </body>
    </html>
  );
}