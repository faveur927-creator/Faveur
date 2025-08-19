
"use client";

import Marketplace from '@/components/marketplace';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { useQueryParams } from '@/hooks/use-query-params';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';


function MarketplaceContent() {
  const searchParams = useSearchParams();
  const { createQueryString } = useQueryParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchQuery = searchParams.get('q');
  const categoryQuery = searchParams.get('category');

  const categories = [...new Set(products.map(p => p.category))];

  const handleCategoryFilter = (category: string) => {
    const newQuery = createQueryString('category', category === categoryQuery ? '' : category);
    router.replace(`${pathname}?${newQuery}`, { scroll: false });
  };

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
        
        <div className="flex flex-wrap gap-2">
            <Button
                variant={!categoryQuery ? 'default' : 'outline'}
                onClick={() => handleCategoryFilter('')}
            >
                Tous
            </Button>
            {categories.map((category) => (
                <Button
                    key={category}
                    variant={categoryQuery === category ? 'default' : 'outline'}
                    onClick={() => handleCategoryFilter(category)}
                >
                    {category}
                </Button>
            ))}
        </div>

        <Marketplace searchQuery={searchQuery} categoryQuery={categoryQuery} />
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
