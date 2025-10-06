
"use client";

import React from 'react';
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
import { Home, ShoppingCart, Wallet, Settings, Bell, Store, BarChart, Package, ArrowRightLeft, LayoutGrid, Truck } from 'lucide-react';
import DashboardHeader from '@/components/dashboard-header';
import Logo from '@/components/logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function MainContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    return (
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
                          <SidebarMenuButton asChild isActive={pathname.includes('/transactions')}>
                            <Link href="/transactions">
                              <Wallet />
                              Transactions
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={pathname.includes('/marketplace')}>
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
                            <SidebarMenuButton asChild isActive={pathname === '/dashboard/vendor/orders'}>
                              <Link href="/dashboard/vendor/orders">
                                <Truck />
                                Commandes
                              </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/vendor/transactions')}>
                            <Link href="/dashboard/vendor/transactions">
                              <ArrowRightLeft />
                              Transactions
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
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/vendor/settings')}>
                              <Link href="/dashboard/vendor/settings">
                                <Store />
                                Paramètres Boutique
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
                          Paramètres Compte
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
    );
}
