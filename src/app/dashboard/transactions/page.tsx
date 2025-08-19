
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const transactions = [
    { id: '1', date: '2024-07-22', type: 'Achat', description: 'Sneakers à la mode', amount: -15000, currency: 'FCFA', status: 'Terminé' },
    { id: '2', date: '2024-07-21', type: 'Dépôt', description: 'Dépôt via MTN Mobile Money', amount: 25000, currency: 'FCFA', status: 'Terminé' },
    { id: '3', date: '2024-07-20', type: 'Achat', description: 'Abonnement Netflix', amount: -5500, currency: 'FCFA', status: 'Terminé' },
    { id: '4', date: '2024-07-19', type: 'Transfert', description: 'Envoyé à John Doe', amount: -10000, currency: 'FCFA', status: 'En attente' },
    { id: '5', date: '2024-07-18', type: 'Revenu', description: 'Reçu de Jane Smith', amount: 50000, currency: 'FCFA', status: 'Terminé' },
    { id: '6', date: '2024-07-17', type: 'Achat', description: 'Courses au supermarché', amount: -22500, currency: 'FCFA', status: 'Échoué' },
    { id: '7', date: '2024-07-16', type: 'Dépôt', description: 'Virement bancaire', amount: 150000, currency: 'FCFA', status: 'Terminé' },
    { id: '8', date: '2024-07-15', type: 'Achat', description: 'Billet de concert', amount: -35000, currency: 'FCFA', status: 'Terminé' },
  ];

export default function TransactionsPage() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Terminé':
        return 'default';
      case 'En attente':
        return 'secondary';
      case 'Échoué':
        return 'destructive';
      default:
        return 'outline';
    }
  };
    
  return (
        <Card>
            <CardHeader>
                <CardTitle>Historique complet</CardTitle>
                <CardDescription>La liste de toutes vos transactions enregistrées.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Montant</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell className="font-medium">{tx.date}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {tx.amount > 0 ? <ArrowDownLeft className="h-4 w-4 text-green-500"/> : <ArrowUpRight className="h-4 w-4 text-red-500"/>}
                                        {tx.type}
                                    </div>
                                </TableCell>
                                <TableCell>{tx.description}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(tx.status) as any}>{tx.status}</Badge>
                                </TableCell>
                                <TableCell className={`text-right font-semibold ${tx.amount > 0 ? 'text-green-600' : ''}`}>
                                    {tx.amount.toLocaleString('fr-FR')} {tx.currency}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
  );
}
