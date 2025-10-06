
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { placeholderImages } from '@/lib/placeholder-images';

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

// Find the key in placeholderImages that matches the product image src
const findImageKey = (imageSrc: string) => {
    return Object.keys(placeholderImages).find(key => placeholderImages[key as keyof typeof placeholderImages].src === imageSrc);
}


export default function ProductCard({ product }: { product: Product }) {
    const { toast } = useToast();

    const imageKey = findImageKey(product.image);
    const imageDetails = imageKey ? placeholderImages[imageKey as keyof typeof placeholderImages] : null;

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent any parent Link navigation
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingProductIndex = cart.findIndex((item: any) => item.id === product.id);

            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('storage')); // Notify other components

            toast({
              title: "Produit ajouté au panier !",
              description: `${product.name} est maintenant dans votre panier.`,
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: "Impossible d'ajouter le produit au panier."
            })
        }
    };


  return (
    <Card className="overflow-hidden flex flex-col group hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="p-0">
            <Link href={`/marketplace/${product.id}`} className="block aspect-video relative overflow-hidden">
            <Image
                src={product.image}
                alt={product.name}
                width={imageDetails?.width || 600}
                height={imageDetails?.height || 400}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={product.dataAiHint}
            />
            </Link>
        </CardHeader>
        <div className="p-4 flex-grow flex flex-col">
            <CardContent className="p-0 flex-grow">
            <Link href={`/marketplace/${product.id}`}>
                <CardTitle className="text-lg font-headline mb-1 leading-tight hover:text-primary transition-colors">{product.name}</CardTitle>
            </Link>
            <Badge variant={product.stock > 10 ? "secondary" : "destructive"}>
                Plus que {product.stock} en stock!
            </Badge>
            </CardContent>
            <CardFooter className="p-0 pt-4 flex items-center justify-between">
            <p className="text-2xl font-bold font-headline text-primary">{product.price.toLocaleString('fr-FR')} FCFA</p>
            <Button onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Acheter
            </Button>
            </CardFooter>
        </div>
    </Card>
  );
}
