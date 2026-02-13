import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Equigestion - Gestion de pension équine",
  description: "Outil pratique et simple pour le suivi des chevaux et l'organisation quotidienne.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <div className="flex h-screen overflow-hidden flex-col lg:flex-row">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-background px-4 py-8 lg:p-10 mt-16 lg:mt-0">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
