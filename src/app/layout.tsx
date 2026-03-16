import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus Suite | Next-Gen Enterprise Infrastructure",
  description: "A state-of-the-art enterprise management suite designed for the future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navigation />
        <main className="pt-20 px-4 max-w-7xl mx-auto min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
