import React from 'react'
import CardBox from "@/app/components/shared/CardBox";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import InvoiceList from '@/app/components/apps/invoice/Invoice-list/index'
import InvoiceTabs from '@/app/components/apps/invoice/InvoiceTabs'
import { InvoiceProvider } from '@/app/context/InvoiceContext/index';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice List App",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Pagos L2",
  },
];

function List() {
    return (
        <InvoiceProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <BreadcrumbComp title="Pagos L2" items={BCrumb} />
                    <CardBox className="shadow-lg">
                        <InvoiceTabs />
                        <InvoiceList />
                    </CardBox>
                </div>
            </div>
        </InvoiceProvider>
    )
}

export default List; 