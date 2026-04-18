import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Bloomboard",
  description: "Your creative content planning companion",
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
        <main className="flex-1 min-h-screen p-4 pt-18 md:ml-60 md:p-8 md:pt-8">
          {children}
        </main>
      </body>
    </html>
  );
}
