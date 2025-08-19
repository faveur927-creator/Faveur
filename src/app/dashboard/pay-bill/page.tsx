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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Simulate API call
    toast({
      title: "Paiement réussi (Simulation)",
      description: "Votre facture a été payée avec succès.",
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
              <Select required>
                <SelectTrigger id="biller">
                  <SelectValue placeholder="Sélectionnez un facturier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cie">CIE (Électricité)</SelectItem>
                  <SelectItem value="sodeci">SODECI (Eau)</SelectItem>
                  <SelectItem value="canal">Canal+ (TV)</SelectItem>
                  <SelectItem value="startimes">StarTimes (TV)</SelectItem>
                  <SelectItem value="mtn">MTN (Internet)</SelectItem>
                  <SelectItem value="orange">Orange (Internet)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice-number">Numéro de facture ou Identifiant</Label>
              <Input id="invoice-number" placeholder="Entrez la référence de la facture" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="amount">Montant (FCFA)</Label>
              <Input id="amount" type="number" placeholder="Ex: 10000" required />
            </div>
            <Button type="submit" className="w-full">
              Payer maintenant
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}