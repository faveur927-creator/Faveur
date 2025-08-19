
"use client";

import Marketplace from '@/components/marketplace';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


function MarketplaceContent() {
  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">Marché</h1>
                <p className="text-muted-foreground">Découvrez et achetez des produits populaires.</p>
            </div>
        </div>
        
        <Marketplace />
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
