import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { ToastProvider } from "@/components/toast/toast-provider";

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
  title: {
    default: "Taskboard",
    template: "%s · Taskboard",
  },
  description: "A small task tracker built with React, Next.js and TypeScript.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <ToastProvider>
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
