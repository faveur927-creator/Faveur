
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const operators = [
    { id: 'MTN', name: 'MTN' },
    { id: 'Airtel', name: 'Airtel' },
];

export default function BuyCreditPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [operator, setOperator] = useState('MTN');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('wallet');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
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

        setIsSubmitting(true);

        try {
            if (paymentMethod === 'wallet') {
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
                window.dispatchEvent(new Event('storage'));
                
                toast({
                    title: "Achat de crédit réussi",
                    description: `Recharge de ${paymentAmount.toLocaleString('fr-FR')} FCFA pour le numéro ${phoneNumber} (${operator}) effectuée.`,
                });
                router.push('/');

            } else if (paymentMethod === 'mtn_mobile_money') {
                const response = await fetch('/api/pay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount, phone: phoneNumber, externalId: `CREDIT_${Date.now()}` }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur API MTN');
                
                toast({
                    title: "Demande de paiement MTN initiée",
                    description: `Veuillez confirmer le paiement sur votre téléphone. Réf: ${data.referenceId}`,
                });
                router.push('/');

            } else if (paymentMethod === 'airtel_mobile_money') {
                 const response = await fetch('/api/airtel', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount, phone: phoneNumber }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erreur API Airtel');

                toast({
                    title: "Demande de paiement Airtel initiée",
                    description: `Veuillez confirmer le paiement sur votre téléphone. Réf: ${data.transactionId}`,
                });
                router.push('/');
            }
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Erreur de paiement',
                description: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Acheter du Crédit</h1>
                    <p className="text-muted-foreground">Rechargez votre téléphone ou celui d'un proche.</p>
                </div>
            </div>

            <Card className="max-w-2xl mx-auto w-full">
                <CardHeader>
                    <CardTitle>Détails de la recharge</CardTitle>
                    <CardDescription>Veuillez remplir les informations pour la recharge.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Opérateur</Label>
                            <RadioGroup
                                value={operator}
                                onValueChange={setOperator}
                                className="flex gap-4"
                            >
                                {operators.map(op => (
                                     <Label key={op.id} className="flex items-center gap-2 border rounded-lg p-3 w-full sm:w-auto flex-grow cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                                        <RadioGroupItem value={op.id} id={op.id} />
                                        {op.name}
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone-number">Numéro de téléphone</Label>
                            <Input
                                id="phone-number"
                                type="tel"
                                placeholder="Ex: 242061234567"
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Montant (FCFA)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Ex: 1000"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Méthode de paiement</Label>
                             <RadioGroup
                                value={paymentMethod}
                                onValueChange={setPaymentMethod}
                                className="flex flex-col sm:flex-row gap-4 flex-wrap"
                            >
                                <Label className="flex items-center gap-2 border rounded-lg p-3 w-full sm:w-auto flex-grow cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                                    <RadioGroupItem value="wallet" id="wallet" />
                                    Wallet Interne
                                </Label>
                                <Label className="flex items-center gap-2 border rounded-lg p-3 w-full sm:w-auto flex-grow cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                                    <RadioGroupItem value="mtn_mobile_money" id="mtn_mobile_money" />
                                    MTN Mobile Money
                                </Label>
                                <Label className="flex items-center gap-2 border rounded-lg p-3 w-full sm:w-auto flex-grow cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                                    <RadioGroupItem value="airtel_mobile_money" id="airtel_mobile_money" />
                                    Airtel Mobile Money
                                </Label>
                            </RadioGroup>
                        </div>
                        <Button type="submit" className="w-full" disabled={!amount || !phoneNumber || isSubmitting}>
                             {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                             {isSubmitting ? 'Traitement...' : 'Acheter maintenant'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
