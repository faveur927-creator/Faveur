import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const transactions = [
  {
    type: 'Achat',
    description: 'Sneakers à la mode',
    amount: -15000,
    icon: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    initials: 'SN'
  },
  {
    type: 'Dépôt',
    description: 'Dépôt via MTN Mobile Money',
    amount: 25000,
    icon: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    initials: 'MM'
  },
  {
    type: 'Achat',
    description: 'Abonnement Netflix',
    amount: -5500,
    icon: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    initials: 'NF'
  },
];

export default function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions Récentes</CardTitle>
        <CardDescription>
          Voici les 3 dernières opérations sur votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div key={index} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={transaction.icon} alt="Avatar" />
                <AvatarFallback>{transaction.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{transaction.type}</p>
                <p className="text-sm text-muted-foreground">{transaction.description}</p>
              </div>
              <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.amount > 0 ? '+' : ''}
                {transaction.amount.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
