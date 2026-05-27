import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
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
          <main className="flex-1 overflow-auto bg-white dark:bg-zinc-950">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
