

"use client";

import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { products } from '@/lib/products';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQueryParams } from '@/hooks/use-query-params';
import React from 'react';

interface MarketplaceProps {
  limit?: number;
}


export default function Marketplace({ limit }: MarketplaceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { createQueryString } = useQueryParams();

  const searchQuery = searchParams.get('q');
  const categoryQuery = searchParams.get('category');
  
  const categories = [...new Set(products.map(p => p.category))];

  const handleCategoryFilter = (category: string) => {
    // When on the main dashboard, clicking a category should switch to the marketplace tab
    const newPath = pathname === '/' ? '/?tab=marketplace' : pathname;
    const newQuery = createQueryString('category', category === categoryQuery ? '' : category);
    router.replace(`${newPath}&${newQuery}`, { scroll: false });
  };
  
  let filteredProducts = products;

  if (categoryQuery) {
    filteredProducts = filteredProducts.filter((product) =>
      product.category.toLowerCase() === categoryQuery.toLowerCase()
    );
  }

  if (searchQuery) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const productsToDisplay = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  const hasResults = productsToDisplay.length > 0;
  
  const getPageTitle = () => {
    if (limit && !categoryQuery && !searchQuery) {
      return "Produits populaires";
    }
    if (categoryQuery) {
      return `Catégorie : ${categoryQuery}`;
    }
    if(searchQuery){
      return `Résultats pour "${searchQuery}"`
    }
    return 'Tous les produits';
  }


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-headline">{getPageTitle()}</h2>
        {limit && (
            <Link href="/?tab=marketplace" passHref>
                <Button variant="ghost">
                    Voir tout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        )}
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

      {hasResults ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productsToDisplay.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
            <p className="text-muted-foreground">Aucun produit trouvé pour votre recherche.</p>
        </div>
      )}

    </div>
  );
}
