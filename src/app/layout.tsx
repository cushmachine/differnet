import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar, MobileSidebar } from "@/components/layout/sidebar";
import { readInbox, readDaemonStatus, readSettings } from "@/lib/readers";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Differnet",
  description: "Company brain — opinionated AI workflow platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [inbox, daemonStatus, settings] = await Promise.all([
    readInbox(),
    readDaemonStatus(),
    readSettings(),
  ]);
  const unreadCount = inbox.filter((m) => m.status === "unread").length;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen">
          <Sidebar
            unreadCount={unreadCount}
            daemonStatus={{ color: daemonStatus.color, label: daemonStatus.label }}
            hiddenPages={settings.hidden_pages}
          />
          <div className="flex flex-1 flex-col overflow-hidden">
            <header className="flex md:hidden items-center gap-3 border-b bg-zinc-950 px-3 py-2">
              <MobileSidebar
                unreadCount={unreadCount}
                daemonStatus={{ color: daemonStatus.color, label: daemonStatus.label }}
                hiddenPages={settings.hidden_pages}
              />
              <span className="text-sm font-semibold tracking-tight text-white font-mono">
                differnet
              </span>
            </header>
            <main className="flex-1 overflow-auto bg-white dark:bg-zinc-950">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
