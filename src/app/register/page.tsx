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

const registerSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "L'adresse e-mail n'est pas valide." }),
  phone: z.string().min(9, { message: "Le numéro de téléphone doit contenir au moins 9 chiffres."}),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." }),
});


export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [step, setStep] = React.useState('register'); // 'register' or 'verify_otp'
  const [submittedOtp, setSubmittedOtp] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const { isSubmitting } = useFormState({ control: form.control });

  const handleRegistrationSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const otpResult = await sendOtp({ phone: values.phone });

      if (otpResult.otp) {
        toast({
          title: "Code de vérification envoyé (simulation)",
          description: `Votre code est : ${otpResult.otp}`,
        });
        setSubmittedOtp(otpResult.otp); // Store the "sent" OTP
        setStep('verify_otp'); // Move to the next step
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: otpResult.error || "Impossible d'envoyer l'OTP.",
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

  const handleOtpSubmit = async (otp: string) => {
    // In a real app, you might verify the OTP on the backend. Here, we just compare.
    if (otp === submittedOtp) {
      try {
        const registrationData = form.getValues();
        const registerResult = await registerUser(registrationData);

        if (registerResult.userId) {
          const loginResult = await loginUser({ email: registrationData.email, password: registrationData.password });
          if(loginResult.userId && loginResult.name) {
            localStorage.setItem('userName', loginResult.name);
            localStorage.setItem('userId', loginResult.userId);
            toast({
              title: `Bienvenue, ${loginResult.name}!`,
              description: "Votre compte a été créé avec succès.",
            });
            router.push('/dashboard');
          }
        } else {
            toast({
              variant: "destructive",
              title: "Erreur d'inscription",
              description: registerResult.error,
            });
        }
      } catch (error) {
         toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la finalisation de l'inscription.",
          });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Code incorrect",
        description: "Le code OTP que vous avez entré n'est pas valide. Veuillez réessayer.",
      });
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
            {step === 'register' ? 'Créer un compte' : 'Vérifiez votre numéro'}
          </CardTitle>
          <CardDescription>
            {step === 'register'
              ? 'Entrez vos informations pour créer un nouveau compte'
              : `Nous avons envoyé un code à 6 chiffres au ${form.getValues().phone}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'register' ? (
             <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRegistrationSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="+221 77 123 45 67" {...field} />
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
                  {isSubmitting ? "Envoi en cours..." : "Recevoir le code"}
                </Button>
              </form>
            </Form>
          ) : (
            <OtpForm onSubmit={handleOtpSubmit} />
          )}

          <div className="mt-4 text-center text-sm">
            {step === 'register' ? (
              <>
                Vous avez déjà un compte?{' '}
                <Link href="/" className="underline hover:text-primary">
                  Se connecter
                </Link>
              </>
            ) : (
              <Button variant="link" onClick={() => setStep('register')} className="p-0 h-auto">
                Modifier le numéro de téléphone?
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
