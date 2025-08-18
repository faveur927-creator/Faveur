import BalanceCard from '@/components/balance-card';
import Marketplace from '@/components/marketplace';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, here's your financial overview.</p>
      </div>
      <BalanceCard />
      <Marketplace />
    </div>
  );
}
