import ProductCard from '@/components/product-card';

const products = [
  {
    id: '1',
    name: 'Casque sans fil Premium',
    price: 90000,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'headphones music',
    stock: 24,
  },
  {
    id: '2',
    name: 'Tracker d\'Activité Intelligent',
    price: 54000,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'smart watch',
    stock: 50,
  },
  {
    id: '3',
    name: 'Machine à Café Portable',
    price: 39000,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'coffee maker',
    stock: 15,
  },
  {
    id: '4',
    name: 'Chaise de Bureau Ergonomique',
    price: 180000,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'office chair',
    stock: 8,
  }
];

export default function Marketplace() {
  return (
    <div>
      <h2 className="text-2xl font-bold font-headline mb-4">Marché</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}