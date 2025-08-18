import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceiptText, Smartphone, ShoppingCart } from "lucide-react";

const actions = [
  {
    label: "Payer une facture",
    icon: ReceiptText,
  },
  {
    label: "Acheter du crédit",
    icon: Smartphone,
  },
  {
    label: "Aller au marché",
    icon: ShoppingCart,
  },
];

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions Rapides</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Button key={action.label} variant="outline" className="h-20 flex-col gap-2">
            <action.icon className="w-6 h-6" />
            <span>{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
