
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { products } from '@/lib/products';
import Link from 'next/link';


export default function Marketplace({ searchQuery }: { searchQuery?: string | null }) {

  const filteredProducts = searchQuery
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const hasResults = filteredProducts.length > 0;
  const isFiltering = !!searchQuery;


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-headline">{isFiltering ? `Résultats pour "${searchQuery}"` : 'Produits populaires'}</h2>
        {!isFiltering && (
            <Link href="/dashboard/marketplace" passHref>
                <Button variant="ghost">
                    Voir tout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        )}
      </div>

      {hasResults ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map(product => (
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
