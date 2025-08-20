
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
import { auth, googleProvider, signInWithPopup } from '@/lib/firebase';
import { Separator } from '@/components/ui/separator';

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
  
    const handleGoogleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        if (user.email && user.displayName) {
            // We use a special password to signify Google Auth in our mock backend
            const loginResult = await loginUser({ email: user.email, password: `google_auth_${user.uid}` });

            if(loginResult.userId && loginResult.name) {
                localStorage.setItem('userName', loginResult.name);
                localStorage.setItem('userId', loginResult.userId);
                localStorage.setItem('userEmail', user.email);

                toast({
                    title: `Connexion réussie!`,
                    description: `Bienvenue, ${loginResult.name}.`,
                });
                router.push('/');
            } else {
                 toast({
                    variant: "destructive",
                    title: "Erreur de connexion",
                    description: loginResult.error || "Impossible de se connecter avec Google.",
                });
            }
        }
    } catch (error) {
        console.error("Google Sign-in Error:", error);
        toast({
            variant: "destructive",
            title: "Erreur Google",
            description: "Une erreur est survenue lors de la connexion avec Google.",
        });
    }
  }


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


            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Ou continuer avec
                    </span>
                </div>
            </div>
            
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.638,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                 Continuer avec Google
            </Button>

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
