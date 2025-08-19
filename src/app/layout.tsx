

"use client";

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Home, ShoppingCart, Wallet, Settings, Bell, Store, BarChart, Package, PlusCircle, LayoutGrid } from 'lucide-react';
import DashboardHeader from '@/components/dashboard-header';
import Logo from '@/components/logo';
import { usePathname } from 'next/navigation';
import React from 'react';

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
        <SidebarProvider>
          <div className="min-h-screen w-full bg-background">
            <Sidebar>
              <SidebarHeader>
                <Logo />
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarGroup>
                    <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
                      <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={pathname === '/'}>
                            <Link href="/">
                              <Home />
                              Tableau de bord
                            </Link>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/dashboard/transactions'}>
                          <Link href="/dashboard/transactions">
                            <Wallet />
                            Transactions
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/marketplace')}>
                           <Link href="/marketplace">
                            <ShoppingCart />
                            Marché
                           </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                       <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Bell />
                          Notifications
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                  </SidebarGroup>
                  
                  <SidebarSeparator />
                  
                  <SidebarGroup>
                      <SidebarGroupLabel>Espace Vendeur</SidebarGroupLabel>
                      <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={pathname === '/dashboard/vendor/dashboard'}>
                            <Link href="/dashboard/vendor/dashboard">
                              <LayoutGrid />
                              Aperçu
                            </Link>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                       <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/vendor/products') || pathname.startsWith('/dashboard/vendor/add-product')}>
                            <Link href="/dashboard/vendor/products">
                              <Package />
                              Produits
                            </Link>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={pathname === '/dashboard/vendor/analytics'}>
                            <Link href="/dashboard/vendor/analytics">
                              <BarChart />
                              Analyses
                            </Link>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                  </SidebarGroup>

                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/settings')}>
                      <Link href="/dashboard/settings">
                        <Settings />
                        Paramètres
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>
            <main className="flex-1 md:ml-[16rem]">
              <DashboardHeader />
              <div className="p-4 sm:p-6 lg:p-8">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
