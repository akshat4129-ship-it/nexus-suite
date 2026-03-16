'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isOnboarding = pathname?.startsWith('/onboarding');
  const isDashboard = pathname?.startsWith('/dashboard');
  const isSettings = pathname?.startsWith('/settings');
  const isEditor = pathname?.includes('/edit');
  const isEmail = pathname?.includes('/email');
  
  const showNav = !isOnboarding && !isDashboard && !isSettings && !isEditor && !isEmail;


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {showNav && <Navigation />}
          <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}


