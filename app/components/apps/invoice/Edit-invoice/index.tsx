"use client"
import React, { useState, useContext, useEffect } from "react";
import { InvoiceContext } from "@/app/context/InvoiceContext";
import { useAuth } from '@/app/context/AuthContext';
import LogoutConfirmModal from "@/app/components/shared/LogoutConfirmModal";
import { Alert, Button, Label, Select, TextInput, Table, Tooltip } from "flowbite-react";
import { useRouter, usePathname } from "next/navigation";
import { format, isValid, parseISO } from "date-fns";
import Link from "next/link";

function EditInvoice() {
  const { updateInvoice, invoices } = useContext(InvoiceContext);
  const { signOut } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const invoiceId = pathname.split("/").pop();

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push('/auth/signin');
    } catch (error) {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };
  const handleLogoutCancel = () => { if (!isLoggingOut) setShowLogoutModal(false); };

  const [formData, setFormData] = useState({
    id: 0,
    billFrom: "",
    billTo: "",
    totalCost: 0,
    status: "Pending",
    billFromAddress: "",
    billToAddress: "",
    orders: [{ itemName: "", unitPrice: "", units: "", unitTotalPrice: 0 }],
    vat: 0,
    grandTotal: 0,
    subtotal: 0,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (invoiceId && invoices.length > 0) {
      const invoice = invoices.find((inv: any) => inv.id === parseInt(invoiceId));
      if (invoice) {
        setFormData({
          id: invoice.id,
          billFrom: invoice.billFrom,
          billTo: invoice.billTo,
          totalCost: invoice.totalCost,
          status: invoice.status,
          billFromAddress: invoice.billFromAddress,
          billToAddress: invoice.billToAddress,
          orders: invoice.orders,
          vat: invoice.vat,
          grandTotal: invoice.grandTotal,
          subtotal: invoice.totalCost,
          date: invoice.orderDate ? new Date(invoice.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [invoiceId, invoices]);

  const calculateTotals = (orders: any[]) => {
    let subtotal = 0;
    orders.forEach(order => {
      const unitPrice = parseFloat(order.unitPrice) || 0;
      const units = parseInt(order.units) || 0;
      const totalCost = unitPrice * units;
      subtotal += totalCost;
      order.unitTotalPrice = totalCost;
    });
    const vat = subtotal * 0.1;
    const grandTotal = subtotal + vat;
    return { subtotal, vat, grandTotal };
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const newFormData = { ...prevData, [name]: value };
      const totals = calculateTotals(newFormData.orders);
      return { ...newFormData, ...totals };
    });
  };

  const handleOrderChange = (index: number, field: string, value: string) => {
    setFormData(prevData => {
      const updatedOrders = [...prevData.orders];
      updatedOrders[index] = { ...updatedOrders[index], [field]: value };
      const totals = calculateTotals(updatedOrders);
      return { ...prevData, orders: updatedOrders, ...totals };
    });
  };

  const handleAddItem = () => {
    setFormData(prevData => {
      const updatedOrders = [...prevData.orders, { itemName: "", unitPrice: "", units: "", unitTotalPrice: 0 }];
      const totals = calculateTotals(updatedOrders);
      return { ...prevData, orders: updatedOrders, ...totals };
    });
  };

  const handleDeleteItem = (index: number) => {
    setFormData(prevData => {
      const updatedOrders = prevData.orders.filter((_, i) => i !== index);
      const totals = calculateTotals(updatedOrders);
      return { ...prevData, orders: updatedOrders, ...totals };
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const invoiceData = {
      ...formData,
      orderDate: new Date(formData.date),
      totalCost: formData.subtotal,
      completed: false,
      isSelected: false,
      billFromEmail: "",
      billFromPhone: 0,
      billFromFax: 0,
      billToEmail: "",
      billToPhone: 0,
      billToFax: 0,
    };
    await updateInvoice(invoiceData);
    setShowAlert(true);
    setTimeout(() => {
      router.push('/invoice/list');
    }, 1000);
  };

  const handleCancel = () => {
    router.push('/invoice/list');
  };

  // Fecha formateada para el header
  const formattedDate = formData.date
    ? format(isValid(parseISO(formData.date)) ? parseISO(formData.date) : new Date(), 'EEEE, MMMM dd, yyyy')
    : format(new Date(), 'EEEE, MMMM dd, yyyy');

  return (
    <div className="space-y-6">
      {showAlert && (
        <Alert color="success" onDismiss={() => setShowAlert(false)}>
          Invoice updated successfully! Redirecting to invoice list...
        </Alert>
      )}

      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Edit Invoice Details</h2>
        <div className="text-gray-500 text-sm mb-2 flex flex-wrap gap-4">
          <span>ID: {formData.id}</span>
          <span>Date: {formattedDate}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Agrupación de campos principales */}
        <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 border">
          <div className="md:col-span-1">
            <Label htmlFor="billFrom">Bill From</Label>
            <TextInput
              id="billFrom"
              name="billFrom"
              value={formData.billFrom}
              onChange={handleChange}
              required
              className="rounded-full mt-1"
            />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="billTo">Bill To</Label>
            <TextInput
              id="billTo"
              name="billTo"
              value={formData.billTo}
              onChange={handleChange}
              required
              className="rounded-full mt-1"
            />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="rounded-full mt-1"
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </Select>
          </div>
          <div className="md:col-span-1"></div>
          <div className="md:col-span-2">
            <Label htmlFor="billFromAddress">From Address</Label>
            <TextInput
              id="billFromAddress"
              name="billFromAddress"
              value={formData.billFromAddress}
              onChange={handleChange}
              required
              className="rounded-full mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="billToAddress">Bill To Address</Label>
            <TextInput
              id="billToAddress"
              name="billToAddress"
              value={formData.billToAddress}
              onChange={handleChange}
              required
              className="rounded-full mt-1"
            />
          </div>
        </div>

        {/* Tabla de items */}
        <div className="overflow-x-auto mt-6">
          <Table className="min-w-full">
            <Table.Head>
              <Table.HeadCell>Item Name</Table.HeadCell>
              <Table.HeadCell>Unit Price</Table.HeadCell>
              <Table.HeadCell>Units</Table.HeadCell>
              <Table.HeadCell>Total Cost</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {formData.orders.map((order: any, index: number) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <TextInput
                      value={order.itemName}
                      onChange={(e) => handleOrderChange(index, 'itemName', e.target.value)}
                      required
                      className="rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TextInput
                      type="number"
                      value={order.unitPrice}
                      onChange={(e) => handleOrderChange(index, 'unitPrice', e.target.value)}
                      required
                      className="rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TextInput
                      type="number"
                      value={order.units}
                      onChange={(e) => handleOrderChange(index, 'units', e.target.value)}
                      required
                      className="rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {order.unitTotalPrice}
                  </Table.Cell>
                  <Table.Cell>
                    {formData.orders.length > 1 && (
                      <Button
                        type="button"
                        color="failure"
                        size="xs"
                        onClick={() => handleDeleteItem(index)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Totales */}
        <div className="flex justify-end mt-6">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Sub Total:</span>
              <span className="font-bold">{formData.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Vat:</span>
              <span className="font-bold">{formData.vat}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Grand Total:</span>
              <span>{formData.grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-wrap gap-4 justify-end mt-8">
          <Link href="/invoice/list" className="flex items-center gap-1 text-gray-500 hover:text-blue-600 px-4 py-2 rounded transition-colors border border-gray-200 bg-white font-medium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle"><path d="M15 19l-7-7 7-7" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Volver a la lista</span>
          </Link>
          <button
            type="submit"
            className="flex items-center gap-1 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors font-medium"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Guardar</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1 text-pink-600 hover:text-white px-4 py-2 rounded transition-colors border border-pink-200 bg-pink-50 font-medium hover:bg-pink-500"
            onClick={handleCancel}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle"><path d="M18 6L6 18M6 6l12 12" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Cancelar</span>
          </button>
        </div>
      </form>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onClose={handleLogoutCancel}
        isLoggingOut={isLoggingOut}
      />
    </div>
  );
}

export default EditInvoice; 