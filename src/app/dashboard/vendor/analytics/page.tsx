
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VendorAnalyticsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">Analyses des Ventes</h1>
                <p className="text-muted-foreground">Cette page affichera des analyses détaillées sur vos produits et vos ventes.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Bientôt disponible</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Des graphiques et des statistiques avancés seront bientôt disponibles ici.</p>
                </CardContent>
            </Card>
        </div>
    )
}
