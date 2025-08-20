
"use client";

import BalanceCard from '@/components/balance-card';
import Marketplace from '@/components/marketplace';
import QuickActions from '@/components/quick-actions';
import RecentTransactions from '@/components/recent-transactions';
import ExpensesChart from '@/components/expenses-chart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionsPage from './transactions/page';
import VendorSpace from '@/components/vendor-space';
import { useSearchParams, useRouter } from 'next/navigation';
import { getUserData } from '@/ai/flows/user-actions';
import { useToast } from '@/hooks/use-toast';


function DashboardContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // User and account state
  const [userName, setUserName] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>('FCFA');

  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getUserData({ userId: storedUserId });
        if (data.error) {
           console.error("Session validation failed:", data.error);
           toast({ variant: 'destructive', title: 'Session invalide', description: 'Veuillez vous reconnecter.' });
           localStorage.clear();
           router.push('/login');
        } else {
          setUserName(data.name || null);
          setBalance(data.balance || 0);
          setCurrency(data.currency || 'FCFA');
          // Update localStorage with fresh data
          localStorage.setItem('userName', data.name || '');
          localStorage.setItem('userEmail', data.email || '');
          localStorage.setItem('userBalance', (data.balance || 0).toString());
        }
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Erreur critique', description: `Une erreur inattendue est survenue: ${error.message}` });
        localStorage.clear();
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  
   const updateBalanceFromStorage = () => {
    const storedBalance = localStorage.getItem('userBalance');
    if (storedBalance !== null) {
      setBalance(parseFloat(storedBalance));
    }
  };

  useEffect(() => {
    window.addEventListener('storage', updateBalanceFromStorage);
    return () => {
      window.removeEventListener('storage', updateBalanceFromStorage);
    };
  }, []);


  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

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
                <BalanceCard balance={balance} currency={currency} isLoading={isLoading} />
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

// This wrapper component handles the client-side auth check
export default function DashboardPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Render a loader on the server and during initial client render to avoid hydration errors.
    if (!isClient) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    return <DashboardContent />;
}
