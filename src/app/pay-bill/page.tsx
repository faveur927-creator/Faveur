
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BillerSelectionForm from '@/components/biller-selection-form';

export default function PayBillPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Payer une Facture</h1>
            <p className="text-muted-foreground">Réglez vos factures en quelques clics.</p>
        </div>
      </div>
      
      <BillerSelectionForm />
      
    </div>
  );
}
