
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Lightbulb, Droplet, Wifi, Tv, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

const billers = [
    { id: 'E2C', name: 'Électricité (E²C)', icon: Lightbulb },
    { id: 'LCE', name: 'Eau (LCE)', icon: Droplet },
    { id: 'Internet', name: 'Internet (Liquid Telecom, MTN, Airtel, CanalBox…)', icon: Wifi },
    { id: 'TV', name: 'TV (Canal+, Startimes…)', icon: Tv },
    { id: 'Telephone', name: 'Téléphone / Data (MTN, Airtel…)', icon: Smartphone },
];

type Biller = typeof billers[0];

export default function BillerSelectionForm() {
  const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null);
  const [step, setStep] = useState(1); // 1: Select Biller, 2: Enter Details
  const [amount, setAmount] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const { toast } = useToast();
  const router = useRouter();

  const handleBillerSelect = (biller: Biller) => {
    setSelectedBiller(biller);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedBiller(null);
    setAmount('');
    setInvoiceId('');
  };

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

    try {
      const currentBalance = parseFloat(localStorage.getItem('userBalance') || '0');
      if (paymentMethod === 'wallet' && currentBalance < paymentAmount) {
        toast({
          variant: 'destructive',
          title: 'Solde insuffisant',
          description: 'Votre solde est insuffisant pour effectuer cette transaction.',
        });
        return;
      }
      if (paymentMethod === 'wallet') {
        const newBalance = currentBalance - paymentAmount;
        localStorage.setItem('userBalance', newBalance.toString());
        window.dispatchEvent(new Event('storage'));
      }
    } catch (e) {
      console.error("Could not update balance", e);
    }

    toast({
      title: "Paiement réussi (Simulation)",
      description: `Votre facture de ${paymentAmount.toLocaleString('fr-FR')} FCFA pour ${selectedBiller?.name} a été payée via ${paymentMethod}.`,
    });

    router.push('/dashboard');
  };

  if (step === 1) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sélection de service</CardTitle>
          <CardDescription>Sélectionnez le type de facture que vous souhaitez payer.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {billers.map((biller) => (
            <button
              key={biller.id}
              onClick={() => handleBillerSelect(biller)}
              className="flex flex-col items-center justify-center gap-2 p-4 border rounded-lg h-32 text-center hover:bg-accent hover:shadow-lg transition-all"
            >
              <biller.icon className="h-8 w-8 text-primary" />
              <span className="font-semibold text-sm">{biller.name}</span>
            </button>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto w-full">
      <CardHeader>
        <CardTitle>Payer votre facture {selectedBiller?.name}</CardTitle>
        <CardDescription>Veuillez remplir les détails ci-dessous.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="invoice-number">Numéro de facture ou Identifiant</Label>
            <Input
              id="invoice-number"
              placeholder="Entrez la référence de la facture"
              required
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
            />
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
           <div className="space-y-2">
                <Label>Méthode de paiement</Label>
                <RadioGroup
                  defaultValue="wallet"
                  className="flex flex-col sm:flex-row gap-4"
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <Label className="flex items-center gap-2 border rounded-lg p-3 w-full cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                    <RadioGroupItem value="wallet" id="wallet" />
                    Wallet Interne
                  </Label>
                  <Label className="flex items-center gap-2 border rounded-lg p-3 w-full cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                    <RadioGroupItem value="mobile_money" id="mobile_money" />
                    Mobile Money
                  </Label>
                   <Label className="flex items-center gap-2 border rounded-lg p-3 w-full cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                    <RadioGroupItem value="card" id="card" />
                    Carte Bancaire
                  </Label>
                </RadioGroup>
            </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2">
             <Button type="button" variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                Retour
              </Button>
            <Button type="submit" className="w-full" disabled={!amount || !invoiceId}>
              Confirmer et Payer
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

