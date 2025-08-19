
"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { products as allProducts } from '@/lib/products';

type CartItem = typeof allProducts[0] & { quantity: number };

export default function CartSheet({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const { toast } = useToast();

    const getCart = useCallback(() => {
        return JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
    }, []);

    const saveCart = useCallback((cartToSave: CartItem[]) => {
        localStorage.setItem('cart', JSON.stringify(cartToSave));
        setCart(cartToSave);
        window.dispatchEvent(new Event('storage')); // To update header count
    }, []);

    useEffect(() => {
        setCart(getCart());
        
        const handleStorageChange = () => {
            setCart(getCart());
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [getCart]);

    const updateQuantity = (productId: string, newQuantity: number) => {
        const currentCart = getCart();
        let updatedCart;
        if (newQuantity <= 0) {
            updatedCart = currentCart.filter(item => item.id !== productId);
        } else {
            updatedCart = currentCart.map(item => 
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
        }
        saveCart(updatedCart);
    };

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = () => {
        try {
            const currentBalance = parseFloat(localStorage.getItem('userBalance') || '0');
            if (currentBalance < total) {
                toast({
                    variant: 'destructive',
                    title: 'Solde insuffisant',
                    description: 'Votre solde est insuffisant pour effectuer cette transaction.',
                });
                return;
            }
            const newBalance = currentBalance - total;
            localStorage.setItem('userBalance', newBalance.toString());
            saveCart([]); // Clear cart
            window.dispatchEvent(new Event('storage')); // Update balance and cart display

            toast({
                title: 'Achat réussi !',
                description: `Votre commande de ${total.toLocaleString('fr-FR')} FCFA a été validée.`,
            });

        } catch (e) {
             toast({
                variant: 'destructive',
                title: 'Erreur',
                description: 'Impossible de finaliser la commande.',
            });
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Votre Panier</SheetTitle>
                </SheetHeader>
                <Separator />
                {cart.length > 0 ? (
                    <>
                        <div className="flex-1 overflow-y-auto pr-4 -mr-4">
                            <div className="flex flex-col gap-4 py-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md object-cover" data-ai-hint={item.dataAiHint} />
                                        <div className="flex-1">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">{item.price.toLocaleString('fr-FR')} FCFA</p>
                                             <div className="flex items-center gap-2 mt-2">
                                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                                                <span>{item.quantity}</span>
                                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                                            </div>
                                        </div>
                                        <div>
                                            <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, 0)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator />
                        <SheetFooter className="mt-auto">
                            <div className="w-full space-y-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>{total.toLocaleString('fr-FR')} FCFA</span>
                                </div>
                                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={total <= 0}>Passer la commande</Button>
                            </div>
                        </SheetFooter>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <ShoppingCart className="w-16 h-16 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">Votre panier est vide</h3>
                        <p className="text-muted-foreground">Parcourez le marché pour trouver des produits.</p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
