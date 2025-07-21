"use client";
import React, { useContext, useEffect, useState } from "react";
import { InvoiceContext } from "@/app/context/InvoiceContext/index";
import {
  Checkbox,
  Table,
  TextInput,
  Button,
  Modal,
  Badge,
  Tooltip,
} from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mutate } from "swr";

function InvoiceList() {
  const { invoices, deleteInvoice } = useContext(InvoiceContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProducts, setSelectedProducts] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(
    (invoice: { billFrom: string; billTo: string; status: string }) => {
      return (
        (invoice.billFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.billTo.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (activeTab === "All" || invoice.status === activeTab)
      );
    }
  );

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Calculate the counts for different statuses
  const Shipped = invoices.filter(
    (t: { status: string }) => t.status === "Shipped"
  ).length;
  const Delivered = invoices.filter(
    (t: { status: string }) => t.status === "Delivered"
  ).length;
  const Pending = invoices.filter(
    (t: { status: string }) => t.status === "Pending"
  ).length;

  // Toggle all checkboxes
  const toggleSelectAll = () => {
    const selectAllValue = !selectAll;
    setSelectAll(selectAllValue);
    if (selectAllValue) {
      setSelectedProducts(invoices.map((invoice: { id: any }) => invoice.id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Toggle individual product selection
  const toggleSelectProduct = (productId: any) => {
    const index = selectedProducts.indexOf(productId);
    if (index === -1) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(
        selectedProducts.filter((id: any) => id !== productId)
      );
    }
  };

  // Handle opening delete confirmation dialog
  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  // Handle confirming deletion of selected products
  const handleConfirmDelete = async () => {
    for (const productId of selectedProducts) {
      await deleteInvoice(productId);
    }
    setSelectedProducts([]);
    setSelectAll(false);
    setOpenDeleteDialog(false);
  };

  // Handle closing delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Reset Invoice on browser refresh
  const location = usePathname();
  const handleResetTickets = async () => {
    const response = await fetch("/api/invoice", {
      method: "GET",
      headers: {
        broserRefreshed: "true",
      },
    });
    const result = await response.json();
    await mutate("/api/invoice");
  };

  useEffect(() => {
    const isPageRefreshed = sessionStorage.getItem("isPageRefreshed");
    if (isPageRefreshed === "true") {
      console.log("page refreshed");
      sessionStorage.removeItem("isPageRefreshed");
      handleResetTickets();
    }
  }, [location]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("isPageRefreshed", "true");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between overflow-x-auto gap-6 ">
        {/* Summary sections */}
        <div
          className={`flex gap-3 items-center sm:w-3/12 w-full mb-2 cursor-pointer p-5 rounded-lg hover:bg-gray-100 ${
            activeTab == "All" ? "bg-gray-100" : null
          }`}
          onClick={() => handleTabClick("All")}
        >
          <div className="h-14 w-14 rounded-full border-2 border-blue-600 text-blue-600 flex justify-center items-center">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7H21M3 12H21M3 17H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h5 className="text-base">Total</h5>
            <p className="text-gray-600">{invoices.length} invoices</p>
            <h6 className="text-sm">$46,218.04</h6>
          </div>
        </div>
        <div
          className={`flex gap-3 items-center sm:w-3/12 w-full mb-2 cursor-pointer p-5 rounded-lg hover:bg-gray-100 ${
            activeTab == "Shipped" ? "bg-gray-100" : null
          }`}
          onClick={() => handleTabClick("Shipped")}
        >
          <div className="h-14 w-14 rounded-full border-2 border-green-600 text-green-600 flex justify-center items-center">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V12C3 16.4183 6.58172 20 11 20C15.4183 20 19 16.4183 19 12V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h5 className="text-base">Shipped</h5>
            <p className="text-gray-600">{Shipped} invoices</p>
            <h6 className="text-sm">$23,110.23</h6>
          </div>
        </div>
        <div
          className={`flex gap-3 items-center sm:w-3/12 w-full mb-2 cursor-pointer p-5 rounded-lg hover:bg-gray-100 ${
            activeTab == "Delivered" ? "bg-gray-100" : null
          }`}
          onClick={() => handleTabClick("Delivered")}
        >
          <div className="h-14 w-14 rounded-full border-2 border-purple-600 text-purple-600 flex justify-center items-center">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h5 className="text-base">Delivered</h5>
            <p className="text-gray-600">{Delivered} invoices</p>
            <h6 className="text-sm">$13,825.05</h6>
          </div>
        </div>
        <div
          className={`flex gap-3 items-center sm:w-3/12 w-full mb-2 cursor-pointer p-5 rounded-lg hover:bg-gray-100 ${
            activeTab == "Pending" ? "bg-gray-100" : null
          }`}
          onClick={() => handleTabClick("Pending")}
        >
          <div className="h-14 w-14 rounded-full border-2 border-yellow-600 text-yellow-600 flex justify-center items-center">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 4V10H17M1 20V14H7M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h5 className="text-base">Pending</h5>
            <p className="text-gray-600">{Pending} invoices</p>
            <h6 className="text-sm">$4,655.63</h6>
          </div>
        </div>
      </div>
      <div className="sm:flex justify-between my-6">
        <div>
          <TextInput
            id="dis"
            type="text"
            className="form-input"
            placeholder="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            color="failure"
            onClick={handleDelete}
            disabled={selectedProducts.length === 0}
          >
            Delete Selected
          </Button>
          <Link href="/invoice/create">
            <Button color="primary">Add Invoice</Button>
          </Link>
        </div>
      </div>
      <Table>
        <Table.Head>
          <Table.HeadCell className="p-4">
            <Checkbox
              checked={selectAll}
              onChange={toggleSelectAll}
            />
          </Table.HeadCell>
          <Table.HeadCell>Invoice</Table.HeadCell>
          <Table.HeadCell>Bill From</Table.HeadCell>
          <Table.HeadCell>Bill To</Table.HeadCell>
          <Table.HeadCell>Total Cost</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {filteredInvoices.map((invoice: any) => (
            <Table.Row key={invoice.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="p-4">
                <Checkbox
                  checked={selectedProducts.includes(invoice.id)}
                  onChange={() => toggleSelectProduct(invoice.id)}
                />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                #{invoice.id}
              </Table.Cell>
              <Table.Cell>{invoice.billFrom}</Table.Cell>
              <Table.Cell>{invoice.billTo}</Table.Cell>
              <Table.Cell>${invoice.totalCost}</Table.Cell>
              <Table.Cell>
                <Badge
                  color={
                    invoice.status === "Shipped"
                      ? "success"
                      : invoice.status === "Delivered"
                      ? "info"
                      : "warning"
                  }
                >
                  {invoice.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <div className="flex gap-2">
                                     <Link href={`/invoice/detail/${invoice.id}`}>
                     <Button size="xs" color="gray">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                         <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     </Button>
                   </Link>
                   <Link href={`/invoice/edit/${invoice.id}`}>
                     <Button size="xs" color="gray">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M11 4H4A2 2 0 0 0 2 6V20A2 2 0 0 0 4 22H18A2 2 0 0 0 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                         <path d="M18.5 2.5A2.121 2.121 0 0 1 21 5L11 15H8V12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     </Button>
                   </Link>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal show={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the selected invoices?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button color="failure" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default InvoiceList; 