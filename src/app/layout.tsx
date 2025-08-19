
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Home, ShoppingCart, Wallet, Settings, Bell, Store, ChevronDown, PlusCircle } from 'lucide-react';
import DashboardHeader from '@/components/dashboard-header';
import Logo from '@/components/logo';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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
  const isVendorRoute = pathname.startsWith('/dashboard/vendor');

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
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
                        <Link href="/dashboard">
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
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/marketplace')}>
                       <Link href="/dashboard/marketplace">
                        <ShoppingCart />
                        Marché
                       </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <Collapsible defaultOpen={isVendorRoute}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                         <SidebarMenuButton isActive={isVendorRoute}>
                            <Store />
                            <span>Espace Vendeur</span>
                            <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </SidebarMenuItem>
                    <CollapsibleContent asChild>
                       <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/vendor'}>
                            <Link href="/dashboard/vendor">
                              Mes Produits
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/vendor/add-product'}>
                             <Link href="/dashboard/vendor/add-product">
                              Ajouter un produit
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>


                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Bell />
                      Notifications
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
            <SidebarInset>
              <DashboardHeader />
              <main className="p-4 sm:p-6 lg:p-8">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
