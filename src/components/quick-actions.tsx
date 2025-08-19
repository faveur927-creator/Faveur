"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceiptText, Smartphone, ShoppingCart, Package } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const actions = [
  {
    label: "Payer une facture",
    icon: ReceiptText,
    href: "/dashboard/pay-bill",
  },
  {
    label: "Acheter du crédit",
    icon: Smartphone,
    href: "/dashboard/buy-credit",
  },
  {
    label: "Acheter un forfait",
    icon: Package,
    href: "/dashboard/buy-bundle",
  },
  {
    label: "Aller au marché",
    icon: ShoppingCart,
    href: "/dashboard/marketplace",
  },
];

export default function QuickActions() {
  const router = useRouter();

  const handleActionClick = (href: string) => {
    if (href && href !== "#") {
      router.push(href);
    }
    // Potentiellement ouvrir un dialogue pour les actions qui ne sont pas des liens
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions Rapides</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action) => (
           <Button 
            key={action.label} 
            variant="outline" 
            className="h-24 flex-col gap-2"
            onClick={() => handleActionClick(action.href)}
          >
            <action.icon className="w-6 h-6" />
            <span className="text-center">{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
