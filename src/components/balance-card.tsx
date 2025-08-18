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
        title: "Success",
        description: `$${amount.toFixed(2)} has been added to your account.`,
      });
    }
    setDepositAmount('');
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardDescription className="flex items-center gap-2"><DollarSign className="w-4 h-4"/> Current Balance</CardDescription>
        <CardTitle className="text-4xl lg:text-5xl font-headline transition-all duration-300">
          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </CardTitle>
      </CardHeader>
      <CardFooter className="gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
              <ArrowDownCircle className="mr-2 h-4 w-4" /> Deposit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleDeposit}>
              <DialogHeader>
                <DialogTitle>Deposit Funds</DialogTitle>
                <DialogDescription>
                  Enter the amount you'd like to deposit into your wallet. This is a mock transaction.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
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
                  <Button type="submit">Confirm Deposit</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Button variant="outline">
          <ArrowUpCircle className="mr-2 h-4 w-4" /> Withdraw
        </Button>
      </CardFooter>
    </Card>
  );
}
