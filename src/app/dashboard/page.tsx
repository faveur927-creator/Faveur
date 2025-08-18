import BalanceCard from '@/components/balance-card';
import Marketplace from '@/components/marketplace';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Bon retour, voici votre aperçu financier.</p>
      </div>
      <BalanceCard />
      <Marketplace />
    </div>
  );
}
