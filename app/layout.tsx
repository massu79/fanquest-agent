import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { AuraBackground } from "@/components/AuraBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "FanQuest Agent",
  description: "World Cup fan quests and Injective reward settlement demo"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AuraBackground />
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 font-black tracking-tight text-white">
              <span className="grid h-9 w-9 place-items-center rounded bg-gradient-to-br from-cyan-300 to-fuchsia-500 text-white shadow-[0_0_28px_rgba(34,211,238,0.35)]">FQ</span>
              <span>FanQuest Agent</span>
            </Link>
            <div className="flex items-center gap-1 text-sm font-bold text-slate-300 sm:gap-2">
              <Link className="rounded px-2 py-2 hover:bg-white/10 sm:px-3" href="/dashboard">
                Dashboard
              </Link>
              <Link className="rounded px-2 py-2 hover:bg-white/10 sm:px-3" href="/demo">
                Demo
              </Link>
              <Link className="rounded px-2 py-2 hover:bg-white/10 sm:px-3" href="/docs">
                Docs
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
