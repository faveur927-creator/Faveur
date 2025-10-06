
"use client";

import { Search, Bell, ShoppingCart, Camera } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useQueryParams } from '@/hooks/use-query-params';
import { Badge } from './ui/badge';
import CartSheet from './cart-sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const { createQueryString } = useQueryParams();
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    const avatar = localStorage.getItem('userAvatar');
    setUserName(name);
    setUserAvatar(avatar);
  }, []);


  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((acc: number, item: any) => acc + item.quantity, 0));
  };
  
  useEffect(() => {
    // Initial cart count
    updateCartCount();
    
    // Listen for storage changes to update cart count across components
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('storage', () => {
        setUserName(localStorage.getItem('userName'));
        setUserAvatar(localStorage.getItem('userAvatar'));
    });

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('storage', () => {
        setUserName(localStorage.getItem('userName'));
        setUserAvatar(localStorage.getItem('userAvatar'));
    });
    };
  }, []);


  useEffect(() => {
    // If the user is searching, always direct them to the marketplace tab
    if (searchQuery) {
        const newUrl = `/?tab=marketplace&${createQueryString('q', searchQuery)}`;
        router.replace(newUrl, { scroll: false });
    } else {
        // Clear the search query from the URL when the input is cleared
        const newUrl = `${pathname}?${createQueryString('q', '')}`;
        router.replace(newUrl, { scroll: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, pathname]);


  // Met à jour la barre de recherche si les paramètres de l'URL changent (ex: navigation arrière/avant)
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card/50 backdrop-blur-md px-4 sm:h-16 sm:px-6">
      <div className='md:hidden'>
        <SidebarTrigger />
      </div>
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher des produits..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
      </div>
      <div className="flex items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Camera className="h-5 w-5" />
              <span className="sr-only">Rechercher par image</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Recherche par Image (Bientôt !)</AlertDialogTitle>
              <AlertDialogDescription>
                Cette fonctionnalité vous permettra de téléverser une image pour trouver des produits similaires dans notre marché. Elle est en cours de développement.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction disabled>Téléverser une image</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <CartSheet>
          <Button variant="ghost" size="icon" className="rounded-full relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{cartCount}</Badge>
              )}
              <span className="sr-only">Panier</span>
          </Button>
        </CartSheet>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Activer/désactiver les notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatar || undefined} alt={userName || "U"} />
                  <AvatarFallback>{userName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Paramètres</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
