import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProjectProvider } from "@/components/layout/project-provider";
import { TopNav } from "@/components/layout/top-nav";

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
  description: "IDE for running an agentic company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProjectProvider>
          <div className="flex h-screen flex-col">
            <TopNav />
            <main className="flex-1 overflow-hidden">{children}</main>
          </div>
        </ProjectProvider>
      </body>
    </html>
  );
}
