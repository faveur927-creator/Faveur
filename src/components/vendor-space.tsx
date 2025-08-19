
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VendorDashboardPage from '@/app/dashboard/vendor/dashboard/page';
import VendorProductsPage from '@/app/dashboard/vendor/products/page';
import VendorAnalyticsPage from '@/app/dashboard/vendor/analytics/page';
import VendorOrdersPage from '@/app/dashboard/vendor/orders/page';
import VendorTransactionsPage from '@/app/dashboard/vendor/transactions/page';
import VendorSettingsPage from '@/app/dashboard/vendor/settings/page';

export default function VendorSpace() {
    return (
        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="products">Produits</TabsTrigger>
                <TabsTrigger value="orders">Commandes</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="analytics">Analyses</TabsTrigger>
                <TabsTrigger value="settings">Paramètres Boutique</TabsTrigger>
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
            <TabsContent value="transactions" className="mt-6">
                <VendorTransactionsPage />
            </TabsContent>
            <TabsContent value="analytics" className="mt-6">
                <VendorAnalyticsPage />
            </TabsContent>
            <TabsContent value="settings" className="mt-6">
                <VendorSettingsPage />
            </TabsContent>
        </Tabs>
    );
}
