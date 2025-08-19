"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Logo from '@/components/logo';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '@/ai/flows/user-actions';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '@/lib/firebase';
import React from 'react';

const loginSchema = z.object({
  email: z.string().email({ message: "L'adresse e-mail n'est pas valide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const googleProvider = new GoogleAuthProvider();


  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const result = await loginUser(values);

      if (result.userId && result.name) {
        localStorage.setItem('userName', result.name);
        localStorage.setItem('userId', result.userId);
        toast({
          title: `Bienvenue, ${result.name}!`,
          description: "Vous êtes maintenant connecté.",
        });
        router.push('/dashboard');
      } else if (result.error) {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: result.error,
        });
      }
    } catch (error) {
       console.error(error);
       toast({
        variant: "destructive",
        title: "Une erreur inattendue est survenue",
        description: "Veuillez réessayer plus tard.",
      });
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user && user.email && user.displayName) {
        // Register or login the user in our system
        const registrationResult = await registerUser({
          email: user.email,
          name: user.displayName,
          password: `google_auth_${user.uid}` // Dummy password for Google users
        });

        if (registrationResult.userId) {
          localStorage.setItem('userName', user.displayName);
          localStorage.setItem('userId', registrationResult.userId);
          toast({
            title: `Bienvenue, ${user.displayName}!`,
            description: "Vous êtes maintenant connecté avec Google.",
          });
          router.push('/dashboard');
        } else {
           throw new Error(registrationResult.error || "Échec de l'inscription/connexion interne.");
        }
      } else {
        throw new Error("Les informations de l'utilisateur Google sont incomplètes.");
      }
    } catch (error: any) {
      console.error("Erreur de connexion Google: ", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion Google",
        description: error.message || "Impossible de se connecter avec Google.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="mx-auto w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">Bon retour</CardTitle>
          <CardDescription>Entrez vos identifiants pour accéder à votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <div className="flex items-center">
                      <FormLabel>Mot de passe</FormLabel>
                      <Link href="#" className="ml-auto inline-block text-sm underline hover:text-primary">
                        Mot de passe oublié?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-bold" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </Form>
          <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin} disabled={isGoogleLoading}>
            {isGoogleLoading ? "Connexion en cours..." : "Se connecter avec Google"}
          </Button>
          <div className="mt-4 text-center text-sm">
            Vous n'avez pas de compte?{' '}
            <Link href="/register" className="underline hover:text-primary">
              S'inscrire
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
