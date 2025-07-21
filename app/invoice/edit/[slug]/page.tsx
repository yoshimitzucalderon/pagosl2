import React from 'react'
import CardBox from "@/app/components/shared/CardBox";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import EditInvoice from '@/app/components/apps/invoice/Edit-invoice/index'
import { InvoiceProvider } from '@/app/context/InvoiceContext/index';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice Edit App",
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
        title: "Invoice Edit",
    },
];

function Edit({ params }: { params: { slug: string } }) {
    return (
        <InvoiceProvider>
            <BreadcrumbComp title="Invoice Edit" items={BCrumb} />
            <CardBox>
                <EditInvoice />
            </CardBox>
        </InvoiceProvider>
    )
}

export default Edit; 