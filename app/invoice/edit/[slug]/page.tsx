import React from 'react'
import CardBox from "@/app/components/shared/CardBox";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import EditInvoice from '@/app/components/apps/invoice/Edit-invoice/index'
import InvoiceTabs from '@/app/components/apps/invoice/InvoiceTabs'
import LogoutButton from '@/app/components/shared/LogoutButton'
import { InvoiceProvider } from '@/app/context/InvoiceContext/index';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice Edit App",
};

function Edit({ params }: { params: { slug: string } }) {
    const BCrumb = [
        {
            to: "/",
            title: "Home",
        },
        {
            to: "/invoice/list",
            title: "Pagos L2",
        },
        {
            to: `/invoice/edit/${params?.slug || ''}`,
            title: "Invoice Edit",
        },
    ];
    return (
        <InvoiceProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <LogoutButton />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <BreadcrumbComp title="Invoice Edit" items={BCrumb} />
                    <CardBox className="shadow-lg">
                        <InvoiceTabs />
                        <EditInvoice />
                    </CardBox>
                </div>
            </div>
        </InvoiceProvider>
    )
}

export default Edit; 