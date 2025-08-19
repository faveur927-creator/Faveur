
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const operators = [
    { id: 'MTN', name: 'MTN' },
    { id: 'Airtel', name: 'Airtel' },
];

const bundleTypes = {
    MTN: {
        Internet: [
            { id: 'MTN_NET_1', name: '1 Go / 24h', price: 500 },
            { id: 'MTN_NET_2', name: '5 Go / 7 jours', price: 2000 },
            { id: 'MTN_NET_3', name: '20 Go / 30 jours', price: 10000 },
        ],
        Appels: [
            { id: 'MTN_CALL_1', name: '60 min / 24h', price: 500 },
            { id: 'MTN_CALL_2', name: '500 min / 7 jours', price: 2500 },
        ],
    },
    Airtel: {
        Internet: [
            { id: 'AIRTEL_NET_1', name: '1.2 Go / 24h', price: 500 },
            { id: 'AIRTEL_NET_2', name: '7 Go / 7 jours', price: 2500 },
            { id: 'AIRTEL_NET_3', name: '25 Go / 30 jours', price: 10000 },
        ],
        Appels: [
             { id: 'AIRTEL_CALL_1', name: '75 min / 24h', price: 500 },
             { id: 'AIRTEL_CALL_2', name: '600 min / 7 jours', price: 3000 },
        ],
    }
}

export default function BuyBundlePage() {
    const router = useRouter();
    const { toast } = useToast();

    const [operator, setOperator] = useState('MTN');
    const [bundleType, setBundleType] = useState('Internet');
    const [selectedBundleId, setSelectedBundleId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('wallet');

    const availableBundles = bundleTypes[operator as keyof typeof bundleTypes][bundleType as keyof typeof bundleTypes.MTN] || [];
    const selectedBundle = availableBundles.find(b => b.id === selectedBundleId);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!selectedBundle) {
             toast({
                variant: 'destructive',
                title: 'Aucun forfait sélectionné',
                description: 'Veuillez choisir un forfait.',
            });
            return;
        }

        const paymentAmount = selectedBundle.price;

        if (paymentMethod === 'wallet') {
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
                window.dispatchEvent(new Event('storage'));
            } catch (e) {
                console.error("Could not update balance", e);
            }
        }
        
        toast({
            title: "Achat de forfait réussi (Simulation)",
            description: `Achat de ${selectedBundle.name} pour ${paymentAmount.toLocaleString('fr-FR')} FCFA pour le numéro ${phoneNumber}.`,
        });

        router.push('/');
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Acheter un Forfait</h1>
                    <p className="text-muted-foreground">Choisissez un forfait internet, appels ou SMS.</p>
                </div>
            </div>

            <Card className="max-w-2xl mx-auto w-full">
                <CardHeader>
                    <CardTitle>Détails du forfait</CardTitle>
                    <CardDescription>Choisissez votre opérateur et le forfait désiré.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Opérateur</Label>
                            <RadioGroup value={operator} onValueChange={setOperator} className="flex gap-4">
                                {operators.map(op => (
                                     <Label key={op.id} className="flex items-center gap-2 border rounded-lg p-3 w-full sm:w-auto flex-grow cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                                        <RadioGroupItem value={op.id} id={`op-${op.id}`} />
                                        {op.name}
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>

                         <div className="space-y-2">
                            <Label>Type de forfait</Label>
                            <RadioGroup value={bundleType} onValueChange={setBundleType} className="flex gap-4">
                                 <Label className="flex items-center gap-2 border rounded-lg p-3 w-full sm:w-auto flex-grow cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                                    <RadioGroupItem value="Internet" id="type-internet" />
                                    Internet
                                </Label>
                                <Label className="flex items-center gap-2 border rounded-lg p-3 w-full sm:w-auto flex-grow cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                                    <RadioGroupItem value="Appels" id="type-appels" />
                                    Appels
                                </Label>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bundle">Forfait</Label>
                             <Select onValueChange={setSelectedBundleId} value={selectedBundleId}>
                                <SelectTrigger id="bundle">
                                    <SelectValue placeholder="Sélectionnez un forfait" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableBundles.map(bundle => (
                                        <SelectItem key={bundle.id} value={bundle.id}>
                                            {bundle.name} - {bundle.price.toLocaleString('fr-FR')} FCFA
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Méthode de paiement</Label>
                             <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col sm:flex-row gap-4 flex-wrap">
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

                        <Button type="submit" className="w-full" disabled={!selectedBundle}>
                             <Package className="mr-2 h-4 w-4" /> Acheter le forfait
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
