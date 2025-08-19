"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PayBillPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [amount, setAmount] = React.useState('');
  const [biller, setBiller] = React.useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const paymentAmount = parseFloat(amount);

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Montant invalide',
        description: 'Veuillez saisir un montant valide.',
      });
      return;
    }
    
    // Simulate updating the balance in localStorage
    try {
        const currentBalance = parseFloat(localStorage.getItem('userBalance') || '0');
        if (currentBalance < paymentAmount) {
            toast({
                variant: 'destructive',
                title: 'Solde insuffisant',
                description: 'Votre solde est insuffisant pour effectuer cette transaction.',
            });
            return;
        }
        const newBalance = currentBalance - paymentAmount;
        localStorage.setItem('userBalance', newBalance.toString());
        // Dispatch a storage event to notify other components like BalanceCard
        window.dispatchEvent(new Event('storage'));
    } catch(e) {
        console.error("Could not update balance", e);
    }


    toast({
      title: "Paiement réussi (Simulation)",
      description: `Votre facture de ${paymentAmount.toLocaleString('fr-FR')} FCFA pour ${biller} a été payée.`,
    });
    
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Payer une Facture</h1>
            <p className="text-muted-foreground">Réglez vos factures en quelques clics.</p>
        </div>
      </div>
      
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Informations de la facture</CardTitle>
          <CardDescription>Veuillez remplir les détails ci-dessous pour procéder au paiement.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="biller">Facturier</Label>
              <Select required onValueChange={setBiller} value={biller}>
                <SelectTrigger id="biller">
                  <SelectValue placeholder="Sélectionnez un facturier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CIE">CIE (Électricité)</SelectItem>
                  <SelectItem value="SODECI">SODECI (Eau)</SelectItem>
                  <SelectItem value="Canal+">Canal+ (TV)</SelectItem>
                  <SelectItem value="Startimes">StarTimes (TV)</SelectItem>
                  <SelectItem value="MTN">MTN (Internet)</SelectItem>
                  <SelectItem value="Orange">Orange (Internet)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice-number">Numéro de facture ou Identifiant</Label>
              <Input id="invoice-number" placeholder="Entrez la référence de la facture" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="amount">Montant (FCFA)</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="Ex: 10000" 
                required 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={!biller || !amount}>
              Payer maintenant
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
