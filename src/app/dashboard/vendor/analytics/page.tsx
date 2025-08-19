
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Package, ShoppingCart, Percent, ArrowUp, ArrowDown } from 'lucide-react';
import { products } from '@/lib/products';

const topProducts = products.slice(0, 5).map(p => ({
    ...p,
    sales: Math.floor(Math.random() * 50) + 10,
    revenue: p.price * (Math.floor(Math.random() * 50) + 10),
})).sort((a,b) => b.revenue - a.revenue);

const kpiData = {
    totalRevenue: { value: 1250000, change: 20.1, changeType: 'increase' },
    totalSales: { value: 120, change: 15, changeType: 'increase' },
    conversionRate: { value: 2.3, change: 0.2, changeType: 'increase' },
    averageOrderValue: { value: 10416, change: 5.1, changeType: 'decrease' },
};


export default function VendorAnalyticsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">Analyses des Ventes</h1>
                <p className="text-muted-foreground">Examinez les performances de votre boutique.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpiData.totalRevenue.value.toLocaleString('fr-FR')} FCFA</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <ArrowUp className="h-4 w-4 text-green-500" />
                            {kpiData.totalRevenue.change}% ce mois-ci
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{kpiData.totalSales.value}</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                             <ArrowUp className="h-4 w-4 text-green-500" />
                            {kpiData.totalSales.change}% ce mois-ci
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpiData.conversionRate.value}%</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <ArrowUp className="h-4 w-4 text-green-500" />
                            +{kpiData.conversionRate.change}% depuis hier
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Panier Moyen</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">{kpiData.averageOrderValue.value.toLocaleString('fr-FR')} FCFA</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                           <ArrowDown className="h-4 w-4 text-red-500" />
                            {kpiData.averageOrderValue.change}% ce mois-ci
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Produits les plus performants</CardTitle>
                    <CardDescription>Vos produits les plus vendus ce mois-ci.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produit</TableHead>
                                <TableHead className="text-center">Ventes</TableHead>
                                <TableHead className="text-right">Revenu</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="text-center">{product.sales}</TableCell>
                                    <TableCell className="text-right">{product.revenue.toLocaleString('fr-FR')} FCFA</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
