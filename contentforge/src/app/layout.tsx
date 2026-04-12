import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "ContentForge",
  description: "Content creator webapp for managing ideas, content, and analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex">
        <Sidebar />
        <main className="ml-60 flex-1 min-h-screen p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
