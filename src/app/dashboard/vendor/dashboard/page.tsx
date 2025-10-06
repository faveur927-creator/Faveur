
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, ShoppingCart, ArrowUp } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
    {
      name: "Jan",
      total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
      name: "Feb",
      total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
      name: "Mar",
      total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
      name: "Apr",
      total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
      name: "May",
      total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
      name: "Jun",
      total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
      name: "Jul",
      total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
      name: "Aug",
      total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
      name: "Sep",
      total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
      name: "Oct",
      total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
      name: "Nov",
      total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
      name: "Dec",
      total: Math.floor(Math.random() * 500000) + 100000,
    },
]

export default function VendorDashboardPage() {
    const totalRevenue = data.reduce((acc, item) => acc + item.total, 0);
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">Tableau de bord Vendeur</h1>
                <p className="text-muted-foreground">Aperçu de vos activités de vente.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalRevenue.toLocaleString('fr-FR')} FCFA</div>
                        <p className="text-xs text-muted-foreground">+20.1% depuis le mois dernier</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventes</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+120</div>
                        <p className="text-xs text-muted-foreground">+15% depuis le mois dernier</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Produits Actifs</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">2 produits en rupture de stock</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Aperçu des Ventes</CardTitle>
                    <CardDescription>Graphique des ventes de cette année.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                     <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data}>
                            <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            />
                            <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${Number(value)/1000}K`}
                            />
                            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
