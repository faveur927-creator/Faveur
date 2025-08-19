"use client";

import Marketplace from '@/components/marketplace';
import { useSearchParams } from 'next/navigation';

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q');

  return (
    <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Marché</h1>
            <p className="text-muted-foreground">Découvrez et achetez des produits populaires.</p>
        </div>
        <Marketplace searchQuery={searchQuery || ''} />
    </div>
  );
}
