
"use client";

import { products } from '@/lib/products';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from 'react';


export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    // Simulate adding to cart using localStorage
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingProductIndex = cart.findIndex((item: any) => item.id === product.id);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage')); // Notify other components of the change

        toast({
          title: "Produit ajouté au panier !",
          description: `${product.name} est maintenant dans votre panier.`,
        });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Impossible d\'ajouter le produit au panier.'
        })
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // In a real app, this would redirect to a checkout page
    // For now, we can just show a toast.
    toast({
        title: "Simulation d'achat",
        description: "Le produit a été ajouté, vous seriez normalement redirigé vers le paiement.",
    });
  }

  return (
    <div className="flex flex-col gap-6">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbLink href="/marketplace">Marché</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>


      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image 
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    data-ai-hint={product.dataAiHint}
                />
            </div>
            
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl lg:text-4xl font-bold font-headline">{product.name}</h1>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-muted stroke-amber-500" />
                </div>
                <span className="text-sm text-muted-foreground">(123 avis)</span>
              </div>
              
              <p className="text-4xl font-bold font-headline text-primary">{product.price.toLocaleString('fr-FR')} FCFA</p>
              
               <div>
                <h3 className="font-semibold mb-2">Vendu par :</h3>
                <p className="text-muted-foreground">{product.vendeur}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                 <Button size="lg" className="w-full" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-5 w-5" /> Ajouter au Panier
                </Button>
                <Button size="lg" variant="outline" className="w-full" onClick={handleBuyNow}>Acheter Maintenant</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
