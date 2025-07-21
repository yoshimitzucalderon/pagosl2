"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
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
import { FiDownload } from "react-icons/fi";
import { FaFilePdf, FaFileExcel, FaFileCsv } from "react-icons/fa";
import { Pencil } from "lucide-react";

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
      header: () => null, // Sin header
      cell: ({ row }) => (
        <button
          onClick={() => handleEditEditableRow(row.original)}
          className="text-blue-500 flex items-center justify-center"
          title="Editar"
        >
          <Pencil size={18} />
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

  // Estado para el menú de descarga
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadBtnRef = useRef(null);
  const downloadMenuRef = useRef(null);

  const handleDownloadCSV = () => {
    const headers = ["Fecha de pago", "Proveedor", "Concepto", "Moneda", "Importe neto pagado", "Notas"];
    const rows = editableRows.map((item) => [
      item.fechaPago,
      item.proveedor,
      item.concepto,
      item.moneda,
      item.importe,
      item.notas,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "pagos-l2.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadMenu(false);
  };
  // Placeholder para PDF y XLSX
  const handleDownloadPDF = () => { setShowDownloadMenu(false); };
  const handleDownloadXLSX = () => { setShowDownloadMenu(false); };

  useEffect(() => {
    if (!showDownloadMenu) return;
    function handleClickOutside(event) {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(event.target) &&
        downloadBtnRef.current &&
        !downloadBtnRef.current.contains(event.target)
      ) {
        setShowDownloadMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDownloadMenu]);

  return (
    <div className="space-y-6">
      {/* Eliminar los 4 botones de resumen */}
      {/* Eliminar la barra de búsqueda */}
      {/* Eliminar el botón 'New Invoice' */}
      {/* Mantener solo la tabla editable de pagos L2 y los elementos necesarios */}
      <div className="mt-10">
        <div className="flex justify-end items-center mb-2 relative">
          {/* Botón de descarga */}
          <button
            ref={downloadBtnRef}
            onClick={() => setShowDownloadMenu((v) => !v)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            title="Descargar"
          >
            <FiDownload size={22} />
          </button>
          {/* Menú desplegable */}
          {showDownloadMenu && (
            <div
              ref={downloadMenuRef}
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            >
              <button
                onClick={handleDownloadPDF}
                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                <FaFilePdf className="mr-2 text-red-600" /> Descargar PDF
              </button>
              <button
                onClick={handleDownloadXLSX}
                className="flex items-center w-full px-4 py-2 text-green-600 hover:bg-gray-100"
              >
                <FaFileExcel className="mr-2 text-green-600" /> Descargar XLSX
              </button>
              <button
                onClick={handleDownloadCSV}
                className="flex items-center w-full px-4 py-2 text-blue-600 hover:bg-gray-100"
              >
                <FaFileCsv className="mr-2 text-blue-600" /> Descargar CSV
              </button>
          </div>
          )}
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