import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  dataAiHint: string;
  stock: number;
  category: string;
  description: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden flex flex-col group hover:shadow-xl transition-shadow duration-300">
        <Link href={`/dashboard/marketplace/${product.id}`} className="flex flex-col flex-grow">
            <CardHeader className="p-0">
                <div className="aspect-video relative overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={product.dataAiHint}
                />
                </div>
            </CardHeader>
            <div className="p-4 flex-grow flex flex-col">
                <CardContent className="p-0 flex-grow">
                <CardTitle className="text-lg font-headline mb-1 leading-tight">{product.name}</CardTitle>
                <Badge variant={product.stock > 10 ? "secondary" : "destructive"}>
                    Plus que {product.stock} en stock!
                </Badge>
                </CardContent>
                <CardFooter className="p-0 pt-4 flex items-center justify-between">
                <p className="text-2xl font-bold font-headline text-primary">{product.price.toLocaleString('fr-FR')} FCFA</p>
                <Button asChild>
                    <Link href={`/dashboard/marketplace/${product.id}`}>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Acheter
                    </Link>
                </Button>
                </CardFooter>
            </div>
      </Link>
    </Card>
  );
}
