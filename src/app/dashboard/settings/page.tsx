
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileCheck, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export default function SettingsPage() {
  const [userName, setUserName] = React.useState<string | null>(null);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = React.useState<string>("https://i.pravatar.cc/150?u=a042581f4e29026704d");
  
  const [recto, setRecto] = React.useState<File | null>(null);
  const [verso, setVerso] = React.useState<File | null>(null);
  const [numeroCNI, setNumeroCNI] = React.useState("");

  const [isUploading, setIsUploading] = React.useState(false);

  const { toast } = useToast();
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

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
        <h1 className="text-3xl font-bold font-headline tracking-tight">Paramètres du Compte</h1>
        <p className="text-muted-foreground">Gérez votre profil personnel et la vérification de votre identité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
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
        <Card className="lg:col-span-2">
             <form onSubmit={handleKycSubmit}>
                <CardHeader>
                    <CardTitle>Vérification d'Identité (KYC)</CardTitle>
                    <CardDescription>Vérifiez votre identité pour débloquer les fonctionnalités de vendeur.</CardDescription>
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
    </div>
  );
}
