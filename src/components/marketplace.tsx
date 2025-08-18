import ProductCard from '@/components/product-card';

const products = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 149.99,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'headphones music',
    stock: 24,
  },
  {
    id: '2',
    name: 'Smart Fitness Tracker',
    price: 89.50,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'smart watch',
    stock: 50,
  },
  {
    id: '3',
    name: 'Portable Coffee Maker',
    price: 65.00,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'coffee maker',
    stock: 15,
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    price: 299.00,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'office chair',
    stock: 8,
  }
];

export default function Marketplace() {
  return (
    <div>
      <h2 className="text-2xl font-bold font-headline mb-4">Marketplace</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
