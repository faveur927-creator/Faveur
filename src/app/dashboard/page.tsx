"use client";

import BalanceCard from '@/components/balance-card';
import Marketplace from '@/components/marketplace';
import QuickActions from '@/components/quick-actions';
import RecentTransactions from '@/components/recent-transactions';
import ExpensesChart from '@/components/expenses-chart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import React from 'react';

export default function DashboardPage() {
  const [userName, setUserName] = React.useState<string | null>(null);

  React.useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name);
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
          <AlertTitle className="text-amber-800 dark:text-amber-200">Vérification requise</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            Votre compte n'est pas vérifié (KYC). Veuillez compléter votre profil pour débloquer toutes les fonctionnalités.
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BalanceCard />
          <QuickActions />
          <RecentTransactions />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <ExpensesChart />
        </div>
      </div>
      
      <Marketplace />
    </div>
  );
}
