
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Logo from '@/components/logo';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/ai/flows/user-actions';
import { Github } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "L'adresse e-mail n'est pas valide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});


export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "demo@superapp.com",
      password: "password123",
    },
  });

  const { isSubmitting } = useFormState({ control: form.control });

  const handleLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      // For the demo, we'll simulate a login.
      // In a real app, this would call your backend.
      const result = await loginUser(values);

      if (result.userId && result.name) {
        localStorage.setItem('userName', result.name);
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('userEmail', values.email);
        
        toast({
          title: `Connexion réussie!`,
          description: `Bienvenue, ${result.name}.`,
        });
        router.push('/');
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: result.error || "L'e-mail ou le mot de passe est incorrect.",
        });
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: "Une erreur est survenue lors de la connexion.",
      });
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="mx-auto w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
          <CardTitle className="text-2xl font-headline">Connectez-vous</CardTitle>
          <CardDescription>
            Entrez vos identifiants pour accéder à votre espace
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-bold" disabled={isSubmitting}>
                {isSubmitting ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </Form>

           <div className="mt-4 text-center text-sm">
            Pas encore de compte?{' '}
            <Link href="/register" className="underline hover:text-primary">
              S'inscrire
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
