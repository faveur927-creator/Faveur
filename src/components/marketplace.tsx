
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { products } from '@/lib/products';


export default function Marketplace({ searchQuery }: { searchQuery?: string | null }) {

  const filteredProducts = searchQuery
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-headline">Produits populaires</h2>
        <Button variant="ghost">
          Voir tout <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
