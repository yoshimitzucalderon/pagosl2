"use client";
import React, { useContext, useEffect, useState } from "react";
import { InvoiceContext } from "@/app/context/InvoiceContext/index";
import { useAuth } from '@/app/context/AuthContext';
import LogoutConfirmModal from "@/app/components/shared/LogoutConfirmModal";
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
import { usePathname, useRouter } from "next/navigation";
import { mutate } from "swr";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

function InvoiceList() {
  const { invoices, deleteInvoice } = useContext(InvoiceContext);
  const { signOut } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProducts, setSelectedProducts] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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

  // --- Tabla editable para pagos L2 ---
  const columnHelper = createColumnHelper<any>();
  const editableColumns = [
    columnHelper.accessor("fechaPago", {
      header: () => <span>Fecha de pago</span>,
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("proveedor", {
      header: () => <span>Proveedor</span>,
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("concepto", {
      header: () => <span>Concepto</span>,
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("moneda", {
      header: () => <span>Moneda</span>,
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("importe", {
      header: () => <span>Importe neto pagado</span>,
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("notas", {
      header: () => <span>Notas</span>,
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: "edit",
      header: () => <span>Editar</span>,
      cell: ({ row }) => (
        <button
          onClick={() => handleEditEditableRow(row.original)}
          className="text-blue-500"
        >
          Editar
        </button>
      ),
    }),
  ];

  // Estado para la tabla editable
  const [editableRows, setEditableRows] = useState([
    {
      id: 1,
      fechaPago: "",
      proveedor: "",
      concepto: "",
      moneda: "",
      importe: "",
      notas: "",
    },
  ]);
  const [editEditableRowId, setEditEditableRowId] = useState(null);
  const [editedEditableRow, setEditedEditableRow] = useState(null);

  const editableTable = useReactTable({
    data: editableRows,
    columns: editableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  function handleEditEditableRow(row) {
    setEditEditableRowId(row.id);
    setEditedEditableRow({ ...row });
  }
  function handleSaveEditableRow() {
    setEditableRows(editableRows.map(r => r.id === editedEditableRow.id ? editedEditableRow : r));
    setEditEditableRowId(null);
    setEditedEditableRow(null);
  }
  function handleChangeEditableRow(e, field) {
    setEditedEditableRow({ ...editedEditableRow, [field]: e.target.value });
  }
  function handleAddEditableRow() {
    setEditableRows([
      ...editableRows,
      {
        id: Date.now(),
        fechaPago: "",
        proveedor: "",
        concepto: "",
        moneda: "",
        importe: "",
        notas: "",
      },
    ]);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Summary sections */}
        <div
          className={`flex gap-3 items-center cursor-pointer p-4 rounded-lg hover:bg-gray-100 transition-colors ${
            activeTab == "All" ? "bg-gray-100" : "bg-white"
          }`}
          onClick={() => handleTabClick("All")}
        >
          <div className="h-12 w-12 rounded-full border-2 border-blue-600 text-blue-600 flex justify-center items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7H21M3 12H21M3 17H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h5 className="text-sm font-semibold">Total</h5>
            <p className="text-gray-600 text-xs">{invoices.length} invoices</p>
            <h6 className="text-sm font-bold">$46,218.04</h6>
          </div>
        </div>
        <div
          className={`flex gap-3 items-center cursor-pointer p-4 rounded-lg hover:bg-gray-100 transition-colors ${
            activeTab == "Shipped" ? "bg-gray-100" : "bg-white"
          }`}
          onClick={() => handleTabClick("Shipped")}
        >
          <div className="h-12 w-12 rounded-full border-2 border-green-600 text-green-600 flex justify-center items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V12C3 16.4183 6.58172 20 11 20C15.4183 20 19 16.4183 19 12V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h5 className="text-sm font-semibold">Shipped</h5>
            <p className="text-gray-600 text-xs">{Shipped} invoices</p>
            <h6 className="text-sm font-bold">$23,110.23</h6>
          </div>
        </div>
        <div
          className={`flex gap-3 items-center cursor-pointer p-4 rounded-lg hover:bg-gray-100 transition-colors ${
            activeTab == "Delivered" ? "bg-gray-100" : "bg-white"
          }`}
          onClick={() => handleTabClick("Delivered")}
        >
          <div className="h-12 w-12 rounded-full border-2 border-purple-600 text-purple-600 flex justify-center items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h5 className="text-sm font-semibold">Delivered</h5>
            <p className="text-gray-600 text-xs">{Delivered} invoices</p>
            <h6 className="text-sm font-bold">$13,825.05</h6>
          </div>
        </div>
        <div
          className={`flex gap-3 items-center cursor-pointer p-4 rounded-lg hover:bg-gray-100 transition-colors ${
            activeTab == "Pending" ? "bg-gray-100" : "bg-white"
          }`}
          onClick={() => handleTabClick("Pending")}
        >
          <div className="h-12 w-12 rounded-full border-2 border-yellow-600 text-yellow-600 flex justify-center items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 4V10H17M1 20V14H7M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h5 className="text-sm font-semibold">Pending</h5>
            <p className="text-gray-600 text-xs">{Pending} invoices</p>
            <h6 className="text-sm font-bold">$4,655.63</h6>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-64">
          <TextInput
            id="dis"
            type="text"
            className="form-input"
            placeholder="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            color="failure"
            onClick={handleDelete}
            disabled={selectedProducts.length === 0}
            size="sm"
          >
            Delete Selected
          </Button>
          <Link href="/invoice/create">
            <Button color="primary" size="sm">New Invoice</Button>
          </Link>
          <Button color="failure" onClick={handleLogoutClick} size="sm">
            Logout
          </Button>
        </div>
      </div>
      <Table className="text-sm">
        <Table.Head>
          <Table.HeadCell className="p-3">
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
              <Table.Cell className="p-3">
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
                 <div className="flex gap-1">
                   <Link href={`/invoice/detail/${invoice.id}`}>
                     <Button size="xs" color="gray" className="p-1">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                         <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     </Button>
                   </Link>
                   <Link href={`/invoice/edit/${invoice.id}`} className="flex items-center gap-1 text-gray-500 hover:text-blue-600 px-2 py-1 rounded transition-colors">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle"><path d="M3 17.25V21h3.75l11.06-11.06a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.76 3.76 1.83-1.83z" fill="#94a3b8"/></svg>
                     <span>Editar</span>
                   </Link>
                   <Button 
                     size="xs" 
                     color="failure" 
                     className="p-1"
                     onClick={handleLogoutClick}
                     title="Cerrar Sesión"
                   >
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M9 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H9M16 17L21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </Button>
                 </div>
               </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Tabla editable de pagos L2 */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Pagos L2 (editable)</h3>
          <button onClick={handleAddEditableRow} className="bg-blue-500 text-white px-3 py-1 rounded">Agregar fila</button>
        </div>
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full">
            <thead>
              {editableTable.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-4 py-2 text-left bg-gray-100">{flexRender(header.column.columnDef.header, header.getContext())}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {editableTable.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-2">
                      {editEditableRowId === row.original.id && cell.column.id !== "edit" ? (
                        <input
                          type="text"
                          value={editedEditableRow[cell.column.id] || ""}
                          onChange={e => handleChangeEditableRow(e, cell.column.id)}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : cell.column.id === "edit" ? (
                        editEditableRowId === row.original.id ? (
                          <>
                            <button onClick={handleSaveEditableRow} className="text-green-600 mr-2">Guardar</button>
                            <button onClick={() => setEditEditableRowId(null)} className="text-red-600">Cancelar</button>
                          </>
                        ) : (
                          <button onClick={() => handleEditEditableRow(row.original)} className="text-blue-500">Editar</button>
                        )
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

             {/* Logout Confirmation Modal */}
       <LogoutConfirmModal
         isOpen={showLogoutModal}
         onConfirm={handleLogoutConfirm}
         onClose={handleLogoutCancel}
         isLoggingOut={isLoggingOut}
       />
    </div>
  );
}

export default InvoiceList; 