
import { products } from '@/lib/products';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/product-detail-client';

// This is now a Server Component
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  
  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  // We pass the product data to the client component
  return <ProductDetailClient product={product} />;
}
