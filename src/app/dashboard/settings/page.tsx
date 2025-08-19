"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpRight, ArrowDownLeft, FileCheck, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


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
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    setUserName(name);
    setUserEmail(email);
  }, []);

  const handleUpdateProfile = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées (simulation).",
    });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleKycSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
        toast({
            variant: 'destructive',
            title: "Aucun fichier sélectionné",
            description: "Veuillez choisir un document à téléverser.",
        });
        return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (res.ok) {
            toast({
                title: "Téléversement réussi",
                description: `Votre document a été envoyé pour vérification.`,
            });
            setSelectedFile(null);
        } else {
            throw new Error(data.error || "Une erreur est survenue lors du téléversement.");
        }
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: "Erreur de téléversement",
            description: error.message,
        });
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez votre profil, vos documents et vos transactions.</p>
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
                                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt={userName || 'User'} />
                                <AvatarFallback>{userName?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Button variant="link" size="sm">Changer de photo</Button>
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
                            <Label htmlFor="kyc-file">Pièce d'identité</Label>
                            <Input id="kyc-file" type="file" onChange={handleFileChange} disabled={isUploading} />
                        </div>
                        {selectedFile && (
                        <div className="text-sm text-muted-foreground flex items-center gap-2 p-2 bg-muted rounded-md">
                            <FileCheck className="h-4 w-4 text-green-500" />
                            <span>{selectedFile.name}</span>
                        </div>
                        )}
                        <p className="text-sm text-muted-foreground">
                            Téléchargez une copie de votre CNI, passeport, etc.
                        </p>
                        <Button type="submit" className="w-full" disabled={isUploading || !selectedFile}>
                            <Upload className="mr-2 h-4 w-4"/>
                            {isUploading ? "Envoi en cours..." : "Lancer la vérification"}
                        </Button>
                    </CardContent>
                 </form>
            </Card>

        </div>
        <div className="lg:col-span-2">
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
