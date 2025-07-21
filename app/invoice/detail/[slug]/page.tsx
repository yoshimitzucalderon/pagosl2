import React from 'react'
import CardBox from "@/app/components/shared/CardBox";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import InvoiceDetail from '@/app/components/apps/invoice/Invoice-detail/index'
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
            <BreadcrumbComp title="Invoice Detail" items={BCrumb} />
            <CardBox>
                <InvoiceDetail />
            </CardBox>
        </InvoiceProvider>
    )
}

export default Detail; 