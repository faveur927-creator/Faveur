
"use client";

import BalanceCard from '@/components/balance-card';
import Marketplace from '@/components/marketplace';
import QuickActions from '@/components/quick-actions';
import RecentTransactions from '@/components/recent-transactions';
import ExpensesChart from '@/components/expenses-chart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionsPage from './transactions/page';
import VendorSpace from '@/components/vendor-space';
import { useSearchParams, useRouter } from 'next/navigation';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isClient) {
      const authStatus = localStorage.getItem('userId');
      if (!authStatus) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [isClient, router]);

  // Ne rend les enfants que si l'utilisateur est authentifié et que nous sommes côté client
  if (!isAuthenticated || !isClient) {
    return null; // Affiche une page blanche ou un spinner pendant la vérification
  }

  return <>{children}</>;
}


function DashboardContent() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    setUserId(storedUserId);
    setUserName(storedUserName);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Bienvenue, {userName || 'Utilisateur'}</h1>
          <p className="text-muted-foreground">Voici votre aperçu financier et commercial.</p>
        </div>
        <Alert className="max-w-md bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400">
          <Terminal className="h-4 w-4" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">Mode Démonstration</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            L'application est en mode démonstration avec des données simulées.
          </AlertDescription>
        </Alert>
      </div>

       <Tabs defaultValue={defaultTab} key={defaultTab}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="marketplace">Marché</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="vendor">Espace Vendeur</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                <BalanceCard userId={userId} />
                <QuickActions />
                <RecentTransactions />
                </div>
                <div className="lg:col-span-1 space-y-6">
                <ExpensesChart />
                </div>
            </div>
        </TabsContent>
        <TabsContent value="marketplace" className="mt-6">
            <Marketplace />
        </TabsContent>
        <TabsContent value="transactions" className="mt-6">
            <TransactionsPage />
        </TabsContent>
        <TabsContent value="vendor" className="mt-6">
            <VendorSpace />
        </TabsContent>
      </Tabs>
    </div>
  );
}


export default function DashboardPage() {
  return (
      <AuthGuard>
        <DashboardContent />
      </AuthGuard>
  )
}
