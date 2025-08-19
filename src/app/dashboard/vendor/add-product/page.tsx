

"use client";

import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Simulation: In a real app, you would process the form data here.
        toast({
            title: "Produit ajouté avec succès (Simulation)",
            description: "Votre nouveau produit est maintenant visible sur le marché.",
        });
        router.push('/dashboard/vendor/products');
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                  <Link href="/dashboard/vendor/products">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Ajouter un nouveau produit</h1>
                    <p className="text-muted-foreground">Remplissez les détails de votre produit.</p>
                </div>
            </div>

            <Card className="max-w-4xl">
                <CardHeader>
                    <CardTitle>Détails du Produit</CardTitle>
                    <CardDescription>Fournissez les informations et une image pour votre produit.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="product-name">Nom du produit</Label>
                                <Input id="product-name" placeholder="Ex: Casque sans fil" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="product-description">Description</Label>
                                <Textarea id="product-description" placeholder="Décrivez votre produit en détail..." required />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Prix (FCFA)</Label>
                                    <Input id="price" type="number" placeholder="90000" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Quantité en stock</Label>
                                    <Input id="stock" type="number" placeholder="24" required />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="product-category">Catégorie</Label>
                                <Input id="product-category" placeholder="Ex: Électronique" required />
                            </div>
                        </div>

                        <div className="space-y-4 flex flex-col">
                             <Label>Image du produit</Label>
                            <div className="flex-grow flex items-center justify-center w-full">
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground">
                                            <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                                        </p>
                                        <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden" />
                                </label>
                            </div> 
                            <Button type="submit" className="w-full mt-auto">Enregistrer le produit</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
