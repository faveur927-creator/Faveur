"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, ArrowDownCircle, ArrowUpCircle, Send, Loader2 } from 'lucide-react';
import React from 'react';
import { getUserData } from "@/ai/flows/user-actions";

export default function BalanceCard({ userId }: { userId: string | null }) {
  const { toast } = useToast();
  const [balance, setBalance] = React.useState<number | null>(null);
  const [currency, setCurrency] = React.useState<string>('FCFA');
  const [isLoading, setIsLoading] = React.useState(true);
  const [depositAmount, setDepositAmount] = React.useState<number | string>('');

  React.useEffect(() => {
    if (userId) {
      const fetchBalance = async () => {
        setIsLoading(true);
        try {
          const data = await getUserData({ userId });
          if (data.balance !== undefined && data.balance !== null) {
            setBalance(data.balance);
            setCurrency(data.currency || 'FCFA');
          } else if (data.error) {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: data.error,
            });
            setBalance(0);
          }
        } catch (error) {
          console.error(error);
          toast({
            variant: "destructive",
            title: "Erreur inattendue",
            description: "Impossible de récupérer le solde.",
          });
          setBalance(0);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBalance();
    } else {
        setIsLoading(false);
        setBalance(0);
    }
  }, [userId, toast]);


  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if(amount > 0 && balance !== null) {
      setBalance(prev => (prev || 0) + amount);
      toast({
        title: "Succès",
        description: `${amount.toLocaleString('fr-FR')} ${currency} ont été ajoutés à votre compte.`,
      });
      // Here you would typically call a flow to update the balance in the DB
    }
    setDepositAmount('');
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardDescription className="flex items-center gap-2"><DollarSign className="w-4 h-4"/> Solde actuel</CardDescription>
        <CardTitle className="text-4xl lg:text-5xl font-headline transition-all duration-300">
           {isLoading ? (
            <Loader2 className="w-12 h-12 animate-spin" />
          ) : (
            `${(balance ?? 0).toLocaleString('fr-FR')} ${currency}`
          )}
        </CardTitle>
      </CardHeader>
      <CardFooter className="gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-bold">
              <ArrowDownCircle className="mr-2 h-4 w-4" /> Dépôt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Déposer des fonds</DialogTitle>
              <DialogDescription>
                Saisissez le montant que vous souhaitez déposer dans votre portefeuille. Ceci est une transaction fictive.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleDeposit}>
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
                    placeholder="10000"
                    required
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

        <Button variant="outline">
          <Send className="mr-2 h-4 w-4" /> Transfert
        </Button>
      </CardFooter>
    </Card>
  );
}
