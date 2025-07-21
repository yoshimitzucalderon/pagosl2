import React from 'react'
import CardBox from "@/app/components/shared/CardBox";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import InvoiceDetail from '@/app/components/apps/invoice/Invoice-detail/index'
import InvoiceTabs from '@/app/components/apps/invoice/InvoiceTabs'
import { InvoiceProvider } from '@/app/context/InvoiceContext/index';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice Detail App",
};

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        to: "/invoice/list",
        title: "Invoice List",
    },
    {
        title: "Invoice Detail",
    },
];

function Detail({ params }: { params: { slug: string } }) {
    return (
        <InvoiceProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <BreadcrumbComp title="Invoice Detail" items={BCrumb} />
                    <CardBox className="shadow-lg">
                        <InvoiceTabs />
                        <InvoiceDetail />
                    </CardBox>
                </div>
            </div>
        </InvoiceProvider>
    )
}

export default Detail; 