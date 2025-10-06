
"use client";

import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Logo from '@/components/logo';
import { usePathname } from 'next/navigation';
import React, { Suspense } from 'react';
import MainContent from '@/components/main-content';
import { Loader2 } from 'lucide-react';

// export const metadata: Metadata = {
//   title: 'SuperApp',
//   description: 'Votre application tout-en-un',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <title>SuperApp</title>
        <meta name="description" content="Votre application tout-en-un" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {isAuthPage ? (
          <>
            {children}
            <Toaster />
          </>
        ) : (
          <Suspense fallback={<div className="flex justify-center items-center h-screen">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>}>
            <MainContent>
              {children}
            </MainContent>
          </Suspense>
        )}
        <Toaster />
      </body>
    </html>
  );
}
