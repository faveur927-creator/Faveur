"use client";

import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const otpSchema = z.object({
  otp: z.string().length(6, { message: "Le code doit contenir 6 chiffres." }),
});

interface OtpFormProps {
  onSubmit: (otp: string) => void;
}

export default function OtpForm({ onSubmit }: OtpFormProps) {
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { isSubmitting } = useFormState({ control: form.control });

  const handleFormSubmit = (values: z.infer<typeof otpSchema>) => {
    onSubmit(values.otp);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code de vérification</FormLabel>
              <FormControl>
                <Input {...field} placeholder="123456" maxLength={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full font-bold" disabled={isSubmitting}>
          {isSubmitting ? "Vérification..." : "Vérifier et créer le compte"}
        </Button>
      </form>
    </Form>
  );
}
