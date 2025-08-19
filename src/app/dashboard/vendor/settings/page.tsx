
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, Loader2, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

export default function VendorSettingsPage() {
  const [shopLogoUrl, setShopLogoUrl] = React.useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);

  const { toast } = useToast();
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleUpdateVendorProfile = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
        title: "Profil Vendeur mis à jour",
        description: "Les informations de votre boutique ont été sauvegardées (simulation).",
    });
  }

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        const newLogoUrl = `/uploads/${data.file.filename}`;
        setShopLogoUrl(newLogoUrl);
        toast({
          title: "Logo de la boutique mis à jour!",
          description: "Votre nouveau logo a été enregistré.",
        });
      } else {
        throw new Error(data.error || "Une erreur est survenue.");
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Paramètres de la Boutique</h1>
        <p className="text-muted-foreground">Gérez les informations publiques et les réglages de votre boutique.</p>
      </div>
        <Card>
            <CardHeader>
                <CardTitle>Profil Vendeur</CardTitle>
                <CardDescription>Gérez les informations publiques de votre boutique.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpdateVendorProfile} className="space-y-6">
                   <div className="space-y-4">
                       <Label>Logo de la boutique</Label>
                       <div className="flex items-center gap-4">
                            <Avatar className="h-24 w-24 rounded-md">
                                <AvatarImage src={shopLogoUrl ?? undefined} alt="Logo de la boutique" />
                                <AvatarFallback className="rounded-md"><Store className="h-10 w-10 text-muted-foreground" /></AvatarFallback>
                            </Avatar>
                            <input
                              type="file"
                              ref={logoInputRef}
                              onChange={handleLogoChange}
                              accept="image/png, image/jpeg"
                              className="hidden"
                            />
                            <Button variant="outline" type="button" onClick={() => logoInputRef.current?.click()} disabled={isUploadingLogo}>
                                {isUploadingLogo ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4"/>}
                                {isUploadingLogo ? 'Chargement...' : 'Changer de logo'}
                            </Button>
                       </div>
                   </div>

                    <div className="space-y-2">
                        <Label htmlFor="shop-name">Nom de la boutique</Label>
                        <Input id="shop-name" placeholder="Ex: La Boutique du Bonheur" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="shop-description">Description de la boutique</Label>
                        <Textarea id="shop-description" placeholder="Décrivez votre boutique, vos produits et ce qui vous rend unique." />
                    </div>

                     <div className="space-y-4">
                        <Label className="font-semibold">Adresse de la boutique</Label>
                         <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="shop-district">Arrondissement</Label>
                                <Input id="shop-district" placeholder="Ex: Cocody" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shop-neighborhood">Quartier</Label>
                                <Input id="shop-neighborhood" placeholder="Ex: Angré 7ème tranche" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shop-street">Rue (nom et numéro)</Label>
                            <Input id="shop-street" placeholder="Ex: Rue des jardins, N°123" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shop-landmark">Référentiel pour vous trouver (optionnel)</Label>
                            <Input id="shop-landmark" placeholder="Ex: Près de la pharmacie des étoiles" />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="shop-email">Email de contact</Label>
                            <Input id="shop-email" type="email" placeholder="contact@boutique.com" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="shop-phone">Téléphone de la boutique</Label>
                            <Input id="shop-phone" type="tel" placeholder="+225 01 02 03 04 05" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full">Mettre à jour la boutique</Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
