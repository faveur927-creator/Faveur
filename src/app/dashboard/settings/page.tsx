
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpRight, ArrowDownLeft, FileCheck, Upload, Loader2, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';


const transactions = [
    { id: '1', date: '2024-07-22', type: 'Achat', description: 'Sneakers à la mode', amount: -15000, currency: 'FCFA' },
    { id: '2', date: '2024-07-21', type: 'Dépôt', description: 'Dépôt via MTN Mobile Money', amount: 25000, currency: 'FCFA' },
    { id: '3', date: '2024-07-20', type: 'Achat', description: 'Abonnement Netflix', amount: -5500, currency: 'FCFA' },
    { id: '4', date: '2024-07-19', type: 'Transfert', description: 'Envoyé à John Doe', amount: -10000, currency: 'FCFA' },
    { id: '5', date: '2024-07-18', type: 'Revenu', description: 'Reçu de Jane Smith', amount: 50000, currency: 'FCFA' },
    { id: '6', date: '2024-07-17', type: 'Achat', description: 'Courses au supermarché', amount: -22500, currency: 'FCFA' },
  ];

export default function SettingsPage() {
  const [userName, setUserName] = React.useState<string | null>(null);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = React.useState<string>("https://i.pravatar.cc/150?u=a042581f4e29026704d");
  const [shopLogoUrl, setShopLogoUrl] = React.useState<string | null>(null);
  
  const [recto, setRecto] = React.useState<File | null>(null);
  const [verso, setVerso] = React.useState<File | null>(null);
  const [numeroCNI, setNumeroCNI] = React.useState("");

  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);

  const { toast } = useToast();
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const logoInputRef = React.useRef<HTMLInputElement>(null);


  React.useEffect(() => {
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const avatar = localStorage.getItem('userAvatar');
    setUserName(name);
    setUserEmail(email);
    if(avatar) {
      setAvatarUrl(avatar);
    }
  }, []);

  const handleUpdateProfile = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées (simulation).",
    });
  }
  
  const handleUpdateVendorProfile = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
        title: "Profil Vendeur mis à jour",
        description: "Les informations de votre boutique ont été sauvegardées (simulation).",
    });
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        const newAvatarUrl = `/uploads/${data.file.filename}`;
        setAvatarUrl(newAvatarUrl);
        localStorage.setItem('userAvatar', newAvatarUrl);
        toast({
          title: "Photo de profil mise à jour!",
          description: "Votre nouvelle photo a été enregistrée.",
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
      setIsUploading(false);
    }
  };
  
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

  const handleKycSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!recto || !verso || !numeroCNI) {
        toast({
            variant: 'destructive',
            title: "Champs obligatoires",
            description: "Veuillez fournir le recto, le verso et le numéro de votre CNI.",
        });
        return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("recto", recto);
    formData.append("verso", verso);
    formData.append("numeroCNI", numeroCNI);

    try {
        const res = await fetch("/api/kyc", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (res.ok) {
            toast({
                title: "KYC soumis avec succès",
                description: `${data.message}`,
            });
            setRecto(null);
            setVerso(null);
            setNumeroCNI("");
        } else {
            throw new Error(data.error || "Une erreur est survenue lors du téléversement.");
        }
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: "Erreur de vérification",
            description: error.message,
        });
    } finally {
        setIsUploading(false);
    }
  };

  const isKycFormSubmittable = recto && verso && numeroCNI;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez votre profil, votre boutique, vos documents et vos transactions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Profil Utilisateur</CardTitle>
                    <CardDescription>Mettez à jour vos informations personnelles.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="flex flex-col items-center space-y-2">
                           <Avatar className="h-24 w-24">
                                <AvatarImage src={avatarUrl} alt={userName || 'User'} />
                                <AvatarFallback>{userName?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <input
                              type="file"
                              ref={avatarInputRef}
                              onChange={handleAvatarChange}
                              accept="image/png, image/jpeg"
                              className="hidden"
                            />
                            <Button variant="link" size="sm" type="button" onClick={() => avatarInputRef.current?.click()} disabled={isUploading}>
                                {isUploading ? 'Chargement...' : 'Changer de photo'}
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom complet</Label>
                            <Input id="name" defaultValue={userName || ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Adresse e-mail</Label>
                            <Input id="email" type="email" defaultValue={userEmail || 'm@example.com'} disabled />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone">Numéro de téléphone</Label>
                            <Input id="phone" type="tel" placeholder="+225 01 02 03 04 05" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="address">Adresse</Label>
                            <Input id="address" placeholder="Abidjan, Côte d'Ivoire" />
                        </div>
                        <Button type="submit" className="w-full">Mettre à jour le profil</Button>
                    </form>
                </CardContent>
            </Card>

            {/* KYC Card */}
            <Card>
                 <form onSubmit={handleKycSubmit}>
                    <CardHeader>
                        <CardTitle>Vérification d'Identité (KYC)</CardTitle>
                        <CardDescription>Vérifiez votre identité pour débloquer toutes les fonctionnalités.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <p className="font-medium">Statut</p>
                            <Badge variant="destructive">Non vérifié</Badge>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="numero-cni">Numéro de la CNI</Label>
                            <Input 
                                id="numero-cni" 
                                type="text" 
                                value={numeroCNI} 
                                onChange={(e) => setNumeroCNI(e.target.value)} 
                                placeholder="C00123456789"
                                disabled={isUploading} 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="recto-cni">Recto de la CNI</Label>
                            <Input id="recto-cni" type="file" onChange={(e) => setRecto(e.target.files?.[0] || null)} accept="image/png, image/jpeg" disabled={isUploading} />
                        </div>
                         {recto && (
                            <div className="text-sm text-muted-foreground flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                                <FileCheck className="h-4 w-4 text-green-500" />
                                <span>{recto.name}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="verso-cni">Verso de la CNI</Label>
                            <Input id="verso-cni" type="file" onChange={(e) => setVerso(e.target.files?.[0] || null)} accept="image/png, image/jpeg" disabled={isUploading} />
                        </div>
                         {verso && (
                            <div className="text-sm text-muted-foreground flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                                <FileCheck className="h-4 w-4 text-green-500" />
                                <span>{verso.name}</span>
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                            Téléchargez des images claires (JPG, PNG) de votre pièce d'identité. Max 5MB.
                        </p>
                        <Button type="submit" className="w-full" disabled={isUploading || !isKycFormSubmittable}>
                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4"/>}
                            {isUploading ? "Vérification en cours..." : "Lancer la vérification"}
                        </Button>
                    </CardContent>
                 </form>
            </Card>

        </div>
        <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Vendor Profile Card */}
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

            {/* Transaction History Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Historique des Transactions</CardTitle>
                    <CardDescription>Retrouvez ici l'historique complet de vos opérations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Montant</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="font-medium">{tx.date}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {tx.amount > 0 ? <ArrowDownLeft className="h-4 w-4 text-green-500"/> : <ArrowUpRight className="h-4 w-4 text-red-500"/>}
                                            {tx.type}
                                        </div>
                                    </TableCell>
                                    <TableCell>{tx.description}</TableCell>
                                    <TableCell className={`text-right font-semibold ${tx.amount > 0 ? 'text-green-600' : ''}`}>
                                        {tx.amount.toLocaleString('fr-FR')} {tx.currency}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
