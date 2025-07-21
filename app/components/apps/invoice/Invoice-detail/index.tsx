"use client";
import React, { useContext, useEffect, useState } from "react";
import { InvoiceContext } from "@/app/context/InvoiceContext/index";
import { useAuth } from '@/app/context/AuthContext';
import LogoutConfirmModal from "@/app/components/shared/LogoutConfirmModal";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge, Button, Table } from "flowbite-react";
import { format, isValid, parseISO } from "date-fns";

const InvoiceDetail = () => {
  const { invoices } = useContext(InvoiceContext);
  const { signOut } = useAuth();
  const router = useRouter();
  const [selectedInvoice, setSelectedInvoice]: any = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    if (!isLoggingOut) {
      setShowLogoutModal(false);
    }
  };

  useEffect(() => {
    if (invoices.length > 0) {
      setSelectedInvoice(invoices[0]);
    }
  }, [invoices]);

  const pathName = usePathname();
  const getTitle = pathName.split("/").pop();

  useEffect(() => {
    if (getTitle) {
      const invoice = invoices.find(
        (p: { id: number }) => p.id === parseInt(getTitle)
      );
      if (invoice) {
        setSelectedInvoice(invoice);
      }
    }
  }, [getTitle, invoices]);

  if (!selectedInvoice) {
    return <div>Loading...</div>;
  }

  const orderDate = selectedInvoice.orderDate
    ? (isValid(parseISO(selectedInvoice.orderDate))
      ? format(parseISO(selectedInvoice.orderDate), "EEEE, MMMM dd, yyyy")
      : "Invalid Date")
    : format(new Date(), "EEEE, MMMM dd, yyyy");

  return (
    <>
      <div className="sm:flex justify-between items-start mb-6">
        <div className="text-2xl font-bold text-blue-600">Sistema de Pagos</div>
        <div className="md:text-end md:mt-0 mt-5">
          <Badge color={
            selectedInvoice.status === "Shipped" ? "success" :
            selectedInvoice.status === "Delivered" ? "info" : "warning"
          }>
            {selectedInvoice.status}
          </Badge>
          <h3 className="items-center mt-1 text-xl"># {selectedInvoice.id}</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="md:col-span-6 col-span-12">
          <h6 className="text-base font-semibold">Bill From</h6>
          <p>{selectedInvoice.billFrom}</p>
          <p>{selectedInvoice.billFromEmail}</p>
          <p>{selectedInvoice.billFromAddress}</p>
          <p>{selectedInvoice.billFromPhone}</p>
        </div>
        <div className="md:col-span-6 col-span-12 flex md:justify-end">
          <div className="md:text-right">
            <h6 className="text-base font-semibold">Bill To</h6>
            <p>{selectedInvoice.billTo}</p>
            <p>{selectedInvoice.billToEmail}</p>
            <p>{selectedInvoice.billToAddress}</p>
            <p>{selectedInvoice.billToPhone}</p>
            <p>Order Date: {orderDate}</p>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto mt-6">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Item Name</Table.HeadCell>
            <Table.HeadCell>Unit Price</Table.HeadCell>
            <Table.HeadCell>Unit</Table.HeadCell>
            <Table.HeadCell className="text-end">Total Cost</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {selectedInvoice.orders.map((order: any, index: number) => (
              <Table.Row key={index}>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {order.itemName}
                </Table.Cell>
                <Table.Cell>${order.unitPrice}</Table.Cell>
                <Table.Cell>{order.units}</Table.Cell>
                <Table.Cell className="text-end">${order.unitTotalPrice}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className="flex justify-end mt-6">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${selectedInvoice.totalCost}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT (10%):</span>
            <span>${selectedInvoice.vat}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Grand Total:</span>
            <span>${selectedInvoice.grandTotal}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Link href="/invoice/list">
          <Button color="gray">Back to List</Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/invoice/edit/${selectedInvoice.id}`}>
            <Button color="primary">Edit Invoice</Button>
          </Link>
          <Button color="failure" onClick={handleLogoutClick}>
            Cerrar Sesión
          </Button>
        </div>
      </div>

             <LogoutConfirmModal
         isOpen={showLogoutModal}
         onConfirm={handleLogoutConfirm}
         onClose={handleLogoutCancel}
         isLoggingOut={isLoggingOut}
       />
    </>
  );
};

export default InvoiceDetail; 