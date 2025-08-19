
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VendorDashboardPage from '@/app/dashboard/vendor/dashboard/page';
import VendorProductsPage from '@/app/dashboard/vendor/products/page';
import VendorAnalyticsPage from '@/app/dashboard/vendor/analytics/page';
import VendorOrdersPage from '@/app/dashboard/vendor/orders/page';

export default function VendorSpace() {
    return (
        <Tabs defaultValue="overview" className="w-full">
            <TabsList>
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="products">Produits</TabsTrigger>
                <TabsTrigger value="orders">Commandes</TabsTrigger>
                <TabsTrigger value="analytics">Analyses</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
                <VendorDashboardPage />
            </TabsContent>
            <TabsContent value="products" className="mt-6">
                <VendorProductsPage />
            </TabsContent>
            <TabsContent value="orders" className="mt-6">
                <VendorOrdersPage />
            </TabsContent>
            <TabsContent value="analytics" className="mt-6">
                <VendorAnalyticsPage />
            </TabsContent>
        </Tabs>
    );
}
