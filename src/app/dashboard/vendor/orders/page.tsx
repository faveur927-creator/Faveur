
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Truck } from "lucide-react";
import VendorOrdersClient from "./page-client";

const orders = [
  {
    id: "CMD001",
    date: "2024-07-28",
    customer: "John Doe",
    total: 90000,
    status: "En attente",
    items: 1,
  },
  {
    id: "CMD002",
    date: "2024-07-28",
    customer: "Jane Smith",
    total: 15000,
    status: "Expédiée",
    items: 1,
  },
    {
    id: "CMD003",
    date: "2024-07-27",
    customer: "Alice Johnson",
    total: 129000,
    status: "Livrée",
    items: 2,
  },
   {
    id: "CMD004",
    date: "2024-07-26",
    customer: "Bob Williams",
    total: 54000,
    status: "Annulée",
    items: 1,
  },
   {
    id: "CMD005",
    date: "2024-07-25",
    customer: "Charlie Brown",
    total: 75000,
    status: "En attente",
    items: 1,
  },
];

export default function VendorOrdersPage() {

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'En attente': return 'secondary';
            case 'Expédiée': return 'default';
            case 'Livrée': return 'default';
            case 'Annulée': return 'destructive';
            default: return 'outline';
        }
    }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Gestion des Commandes
        </h1>
        <p className="text-muted-foreground">
          Suivez et gérez les commandes de vos clients.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Toutes les commandes</CardTitle>
          <CardDescription>
            La liste de toutes les commandes reçues dans votre boutique.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commande</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status) as any}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {order.total.toLocaleString("fr-FR")} FCFA
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem><Truck className="mr-2 h-4 w-4" /> Marquer comme expédiée</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
