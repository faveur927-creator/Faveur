"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import React from 'react';

export default function BalanceCard() {
  const { toast } = useToast();
  const [balance, setBalance] = React.useState(1234.56);
  const [depositAmount, setDepositAmount] = React.useState<number | string>('');

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if(amount > 0) {
      setBalance(prev => prev + amount);
      toast({
        title: "Succès",
        description: `${amount.toFixed(2)} $ ont été ajoutés à votre compte.`,
      });
    }
    setDepositAmount('');
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardDescription className="flex items-center gap-2"><DollarSign className="w-4 h-4"/> Solde actuel</CardDescription>
        <CardTitle className="text-4xl lg:text-5xl font-headline transition-all duration-300">
          ${balance.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </CardTitle>
      </CardHeader>
      <CardFooter className="gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
              <ArrowDownCircle className="mr-2 h-4 w-4" /> Dépôt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleDeposit}>
              <DialogHeader>
                <DialogTitle>Déposer des fonds</DialogTitle>
                <DialogDescription>
                  Saisissez le montant que vous souhaitez déposer dans votre portefeuille. Ceci est une transaction fictive.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Montant
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="col-span-3"
                    placeholder="0.00"
                    required
                    step="0.01"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Confirmer le dépôt</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Button variant="outline">
          <ArrowUpCircle className="mr-2 h-4 w-4" /> Retrait
        </Button>
      </CardFooter>
    </Card>
  );
}
