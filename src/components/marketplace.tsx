
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { products } from '@/lib/products';
import Link from 'next/link';


interface MarketplaceProps {
  searchQuery?: string | null;
  categoryQuery?: string | null;
  limit?: number;
}


export default function Marketplace({ searchQuery, categoryQuery, limit }: MarketplaceProps) {

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
  const isFiltering = !!searchQuery || !!categoryQuery;
  const pageTitle = limit ? "Produits populaires" : (isFiltering ? `Résultats de la recherche` : 'Tous les produits');


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-headline">{pageTitle}</h2>
        {limit && !isFiltering && (
            <Link href="/marketplace" passHref>
                <Button variant="ghost">
                    Voir tout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        )}
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
