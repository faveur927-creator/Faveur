
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";


const salesTransactions = [
  {
    id: "TRN001",
    date: "2024-07-28",
    customer: "John Doe",
    product: "Casque sans fil Premium",
    amount: 90000,
    status: "Payé",
  },
  {
    id: "TRN002",
    date: "2024-07-28",
    customer: "Jane Smith",
    product: "T-shirt en Coton Bio",
    amount: 15000,
    status: "Payé",
  },
    {
    id: "TRN003",
    date: "2024-07-27",
    customer: "Alice Johnson",
    product: "Chaise de Bureau Ergonomique",
    amount: 180000,
    status: "En attente",
  },
   {
    id: "TRN004",
    date: "2024-07-26",
    customer: "Bob Williams",
    product: "Tracker d'Activité Intelligent",
    amount: 54000,
    status: "Remboursé",
  },
   {
    id: "TRN005",
    date: "2024-07-25",
    customer: "Charlie Brown",
    product: "Baskets de Course",
    amount: 75000,
    status: "Payé",
  },
];

export default function VendorTransactionsPage() {

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Payé': return 'default';
            case 'En attente': return 'secondary';
            case 'Remboursé': return 'destructive';
            default: return 'outline';
        }
    }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Transactions de Vente
        </h1>
        <p className="text-muted-foreground">
          Suivez toutes les transactions financières de votre boutique.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Historique des transactions</CardTitle>
          <CardDescription>
            La liste de toutes les ventes et remboursements enregistrés.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.customer}</TableCell>
                  <TableCell>{transaction.product}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(transaction.status) as any}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.amount.toLocaleString("fr-FR")} FCFA
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
