
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, ArrowDownCircle, ArrowUpCircle, Send, Loader2, Landmark, Smartphone, CreditCard } from 'lucide-react';
import React from 'react';
import { getUserData } from "@/ai/flows/user-actions";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export default function BalanceCard({ userId }: { userId: string | null }) {
  const { toast } = useToast();
  const [balance, setBalance] = React.useState<number | null>(null);
  const [currency, setCurrency] = React.useState<string>('FCFA');
  const [isLoading, setIsLoading] = React.useState(true);
  
  // State for modals
  const [depositAmount, setDepositAmount] = React.useState<number | string>('');
  const [depositMethod, setDepositMethod] = React.useState('mtn');

  const [withdrawalAmount, setWithdrawalAmount] = React.useState<number | string>('');
  const [withdrawalMethod, setWithdrawalMethod] = React.useState('bank');

  const [transferAmount, setTransferAmount] = React.useState<number | string>('');
  const [transferRecipient, setTransferRecipient] = React.useState('');

  const updateBalanceFromStorage = () => {
    const storedBalance = localStorage.getItem('userBalance');
    if (storedBalance !== null) {
      setBalance(parseFloat(storedBalance));
    }
  };

  React.useEffect(() => {
    // Listen for storage changes to update balance across components
    window.addEventListener('storage', updateBalanceFromStorage);
    return () => {
      window.removeEventListener('storage', updateBalanceFromStorage);
    };
  }, []);
  
  React.useEffect(() => {
    if (userId) {
      const fetchBalance = async () => {
        setIsLoading(true);
        try {
            const data = await getUserData({ userId });
            if (data.balance !== undefined && data.balance !== null) {
              setBalance(data.balance);
              setCurrency(data.currency || 'FCFA');
              localStorage.setItem('userBalance', data.balance.toString());
            } else if (data.error) {
              toast({ variant: "destructive", title: "Erreur", description: data.error });
              setBalance(0);
              localStorage.setItem('userBalance', '0');
            }
        } catch (error) {
          console.error(error);
          toast({ variant: "destructive", title: "Erreur inattendue", description: "Impossible de récupérer le solde." });
          setBalance(0);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBalance();
    } else {
        setIsLoading(false);
        setBalance(0);
        localStorage.setItem('userBalance', '0');
    }
  }, [userId, toast]);


  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if(amount > 0 && balance !== null) {
      const newBalance = (balance || 0) + amount;
      setBalance(newBalance);
      localStorage.setItem('userBalance', newBalance.toString());
      window.dispatchEvent(new Event('storage'));

      toast({
        title: "Dépôt réussi",
        description: `${amount.toLocaleString('fr-FR')} ${currency} ont été ajoutés à votre compte.`,
      });
    }
    setDepositAmount('');
  }

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawalAmount);
    if (amount <= 0) {
      toast({ variant: "destructive", title: "Montant invalide" });
      return;
    }
    if (balance !== null && balance >= amount) {
       const newBalance = balance - amount;
       setBalance(newBalance);
       localStorage.setItem('userBalance', newBalance.toString());
       window.dispatchEvent(new Event('storage'));

       toast({
         title: "Retrait réussi",
         description: `${amount.toLocaleString('fr-FR')} ${currency} ont été retirés de votre compte.`,
       });
    } else {
      toast({ variant: "destructive", title: "Solde insuffisant" });
    }
    setWithdrawalAmount('');
  }

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(transferAmount);
     if (amount <= 0 || !transferRecipient) {
      toast({ variant: "destructive", title: "Données invalides", description: "Veuillez entrer un destinataire et un montant valide." });
      return;
    }
    if (balance !== null && balance >= amount) {
       const newBalance = balance - amount;
       setBalance(newBalance);
       localStorage.setItem('userBalance', newBalance.toString());
       window.dispatchEvent(new Event('storage'));

       toast({
         title: "Transfert réussi",
         description: `${amount.toLocaleString('fr-FR')} ${currency} ont été envoyés à ${transferRecipient}.`,
       });
    } else {
      toast({ variant: "destructive", title: "Solde insuffisant" });
    }
    setTransferAmount('');
    setTransferRecipient('');
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
      <CardFooter className="flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-bold flex-grow sm:flex-grow-0">
              <ArrowDownCircle className="mr-2 h-4 w-4" /> Dépôt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Déposer des fonds</DialogTitle>
              <DialogDescription>
                Choisissez une méthode et saisissez le montant à déposer.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleDeposit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label>Source des fonds</Label>
                    <RadioGroup defaultValue="mtn" value={depositMethod} onValueChange={setDepositMethod}>
                        <Label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                            <RadioGroupItem value="mtn" id="mtn" />
                            <Smartphone /> MTN Mobile Money
                        </Label>
                         <Label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                            <RadioGroupItem value="airtel" id="airtel" />
                            <Smartphone /> Airtel Money
                        </Label>
                         <Label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                            <RadioGroupItem value="bank" id="bank" />
                            <Landmark /> Virement Bancaire
                        </Label>
                        <Label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                            <RadioGroupItem value="card" id="card" />
                           <CreditCard /> Carte Bancaire
                        </Label>
                    </RadioGroup>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="amount-deposit">Montant (FCFA)</Label>
                  <Input
                    id="amount-deposit"
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="10000"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit" disabled={!depositAmount}>Confirmer le dépôt</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex-grow sm:flex-grow-0">
                  <ArrowUpCircle className="mr-2 h-4 w-4" /> Retrait
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Retirer des fonds</DialogTitle>
                    <DialogDescription>Choisissez où retirer les fonds et le montant.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleWithdrawal}>
                     <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Destination des fonds</Label>
                            <RadioGroup defaultValue="bank" value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                                <Label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                                    <RadioGroupItem value="bank" id="withdraw-bank"/>
                                    <Landmark /> Compte Bancaire
                                </Label>
                                 <Label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                                    <RadioGroupItem value="mobile_money" id="withdraw-momo"/>
                                    <Smartphone /> Mobile Money
                                </Label>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="amount-withdrawal">Montant (FCFA)</Label>
                             <Input
                                id="amount-withdrawal"
                                type="number"
                                value={withdrawalAmount}
                                onChange={(e) => setWithdrawalAmount(e.target.value)}
                                placeholder="5000"
                                required
                             />
                        </div>
                     </div>
                     <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit" disabled={!withdrawalAmount}>Confirmer le retrait</Button>
                        </DialogClose>
                     </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog>
             <DialogTrigger asChild>
                <Button variant="outline" className="flex-grow sm:flex-grow-0">
                  <Send className="mr-2 h-4 w-4" /> Transfert
                </Button>
            </DialogTrigger>
             <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transférer des fonds</DialogTitle>
                    <DialogDescription>Envoyez de l'argent à un autre utilisateur de la SuperApp.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleTransfer}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="recipient">Destinataire</Label>
                            <Input
                                id="recipient"
                                value={transferRecipient}
                                onChange={(e) => setTransferRecipient(e.target.value)}
                                placeholder="email, @username, ou numéro"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount-transfer">Montant (FCFA)</Label>
                            <Input
                                id="amount-transfer"
                                type="number"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                                placeholder="2500"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit" disabled={!transferAmount || !transferRecipient}>Envoyer</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

