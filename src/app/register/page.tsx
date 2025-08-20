
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
import { registerUser, loginUser, sendOtp } from '@/ai/flows/user-actions';
import React from 'react';
import OtpForm from '@/components/otp-form';
import { auth, googleProvider, signInWithPopup } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const clientSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "L'adresse e-mail n'est pas valide." }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." }),
});

const vendorSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "L'adresse e-mail n'est pas valide." }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." }),
  shopIdentifier: z.string().min(3, { message: "L'identifiant de la boutique est requis." }),
});


export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [step, setStep] = React.useState('register'); // 'register' or 'verify_otp'
  const [submittedOtp, setSubmittedOtp] = React.useState<string | null>(null);
  const [registrationData, setRegistrationData] = React.useState<any>(null);

  const clientForm = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const vendorForm = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: { name: "", email: "", password: "", shopIdentifier: "" },
  });

  const { isSubmitting: isClientSubmitting } = useFormState({ control: clientForm.control });
  const { isSubmitting: isVendorSubmitting } = useFormState({ control: vendorForm.control });
  
  const handleGoogleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        if (user.email && user.displayName) {
             const password = `google_auth_${user.uid}`;
            let loginResult = await loginUser({ email: user.email, password });

             if (loginResult.error) {
                const registerResult = await registerUser({ name: user.displayName, email: user.email, password });
                if (registerResult.error) {
                    throw new Error(registerResult.error);
                }
                loginResult = await loginUser({ email: user.email, password });
            }

            if (loginResult.userId && loginResult.name) {
                localStorage.setItem('userName', loginResult.name);
                localStorage.setItem('userId', loginResult.userId);
                localStorage.setItem('userEmail', user.email);
                toast({ title: `Bienvenue, ${loginResult.name}!`, description: "Votre compte a été créé avec succès." });
                router.push('/');
            } else {
                 toast({ variant: "destructive", title: "Erreur de connexion", description: "Impossible de se connecter après l'inscription avec Google." });
            }
        }
    } catch (error: any) {
        console.error("Google Sign-in Error:", error);
        toast({ variant: "destructive", title: "Erreur Google", description: error.message || "Une erreur est survenue lors de l'inscription avec Google." });
    }
  }


  const handleRegistrationSubmit = async (values: z.infer<typeof clientSchema> | z.infer<typeof vendorSchema>) => {
    try {
      setRegistrationData(values); // Store form data
      const otpResult = await sendOtp({ email: values.email });

      if (otpResult.otp) {
        toast({
          title: "Code de vérification envoyé (simulation)",
          description: `Votre code est : ${otpResult.otp}`,
        });
        setSubmittedOtp(otpResult.otp); // Store the "sent" OTP
        setStep('verify_otp'); // Move to the next step
      } else {
        toast({ variant: "destructive", title: "Erreur", description: otpResult.error || "Impossible d'envoyer l'OTP." });
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Une erreur inattendue est survenue", description: "Veuillez réessayer plus tard." });
    }
  };

  const handleOtpSubmit = async (otp: string) => {
    if (otp === submittedOtp) {
      try {
        const registerResult = await registerUser(registrationData);

        if (registerResult.userId) {
          const loginResult = await loginUser({ email: registrationData.email, password: registrationData.password });
          if(loginResult.userId && loginResult.name) {
            localStorage.setItem('userName', loginResult.name);
            localStorage.setItem('userId', loginResult.userId);
            localStorage.setItem('userEmail', registrationData.email);
            toast({ title: `Bienvenue, ${loginResult.name}!`, description: "Votre compte a été créé avec succès." });
            router.push('/');
          } else {
             toast({ variant: "destructive", title: "Erreur de connexion", description: loginResult.error || "Impossible de se connecter après l'inscription." });
          }
        } else {
            toast({ variant: "destructive", title: "Erreur d'inscription", description: registerResult.error });
            setStep('register');
        }
      } catch (error) {
         toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue lors de la finalisation de l'inscription." });
      }
    } else {
      toast({ variant: "destructive", title: "Code incorrect", description: "Le code OTP que vous avez entré n'est pas valide. Veuillez réessayer." });
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="mx-auto w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">
            {step === 'register' ? 'Créer un compte' : 'Vérifiez votre e-mail'}
          </CardTitle>
          <CardDescription>
            {step === 'register'
              ? 'Rejoignez-nous en tant que client ou vendeur.'
              : `Nous avons envoyé un code à 6 chiffres à ${registrationData?.email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'register' ? (
            <Tabs defaultValue="client" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="vendor">Vendeur</TabsTrigger>
              </TabsList>
              <TabsContent value="client" className="pt-4">
                 <Form {...clientForm}>
                  <form onSubmit={clientForm.handleSubmit(handleRegistrationSubmit)} className="space-y-4">
                     <FormField control={clientForm.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Nom</FormLabel> <FormControl> <Input placeholder="John Doe" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                     <FormField control={clientForm.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl> <Input placeholder="m@example.com" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                     <FormField control={clientForm.control} name="password" render={({ field }) => ( <FormItem> <FormLabel>Mot de passe</FormLabel> <FormControl> <Input type="password" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                     <Button type="submit" className="w-full font-bold" disabled={isClientSubmitting}> {isClientSubmitting ? "Envoi en cours..." : "Recevoir le code"} </Button>
                  </form>
                </Form>
              </TabsContent>
               <TabsContent value="vendor" className="pt-4">
                <Form {...vendorForm}>
                  <form onSubmit={vendorForm.handleSubmit(handleRegistrationSubmit)} className="space-y-4">
                     <FormField control={vendorForm.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Nom du gérant</FormLabel> <FormControl> <Input placeholder="John Doe" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                     <FormField control={vendorForm.control} name="shopIdentifier" render={({ field }) => ( <FormItem> <FormLabel>Identifiant unique de la boutique</FormLabel> <FormControl> <Input placeholder="Ex: RCCM, N° de commerçant" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                     <FormField control={vendorForm.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl> <Input placeholder="boutique@example.com" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                     <FormField control={vendorForm.control} name="password" render={({ field }) => ( <FormItem> <FormLabel>Mot de passe</FormLabel> <FormControl> <Input type="password" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                     <Button type="submit" className="w-full font-bold" disabled={isVendorSubmitting}> {isVendorSubmitting ? "Envoi en cours..." : "Recevoir le code"} </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          ) : (
            <OtpForm onSubmit={handleOtpSubmit} />
          )}
          
           {step === 'register' && (
             <>
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
            </>
           )}

          <div className="mt-4 text-center text-sm">
            {step === 'register' ? (
              <>
                Vous avez déjà un compte?{' '}
                <Link href="/login" className="underline hover:text-primary">
                  Se connecter
                </Link>
              </>
            ) : (
              <Button variant="link" onClick={() => setStep('register')} className="p-0 h-auto">
                Modifier l'adresse e-mail?
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
