import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import React from "react";
import type { Metadata } from "next";
import CreateInvoiceApp from "@/app/components/apps/invoice/Add-invoice";
import InvoiceTabs from '@/app/components/apps/invoice/InvoiceTabs';
import CardBox from "@/app/components/shared/CardBox";
import LogoutButton from '@/app/components/shared/LogoutButton';
import { InvoiceProvider } from '@/app/context/InvoiceContext/index';

export const metadata: Metadata = {
  title: "Invoice Create App",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    to: "/invoice/create",
    title: "Crear registro L2",
  },
];

function CreateList() {
  return (
    <InvoiceProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <LogoutButton />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbComp items={BCrumb} />
          <CardBox className="shadow-lg">
            <InvoiceTabs />
            <CreateInvoiceApp />
          </CardBox>
        </div>
      </div>
    </InvoiceProvider>
  );
}

export default CreateList; 