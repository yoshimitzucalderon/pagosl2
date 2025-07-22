"use client"
import React, { useState, useContext, useEffect } from "react";
import { InvoiceContext } from "@/app/context/InvoiceContext";
import { useRouter } from "next/navigation";
import { Alert, Button, Label, Select, TextInput } from "flowbite-react";
import { format, isValid, parseISO } from "date-fns";
import Link from "next/link";
import UploadForm from "../../../../../components/UploadForm";
import { RotateCcw } from "lucide-react";

function CreateInvoice() {
  const { addInvoice, invoices } = useContext(InvoiceContext);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
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
  const [uploadMode, setUploadMode] = useState<'auto' | 'manual'>('auto');
  const [manualForm, setManualForm] = useState({
    fechaPago: '',
    proveedor: '',
    concepto: '',
    moneda: '',
    importe: '',
    notas: '', // nuevo campo
  });
  const [n8nLoading, setN8nLoading] = useState(false);
  const [n8nMessage, setN8nMessage] = useState("");

  useEffect(() => {
    if (invoices.length > 0) {
      const lastId = invoices[invoices.length - 1].id;
      setFormData(prevData => ({ ...prevData, id: lastId + 1 }));
    } else {
      setFormData(prevData => ({ ...prevData, id: 1 }));
    }
  }, [invoices]);

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

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setManualForm((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja los datos procesados por n8n
  const handleMediaUpload = async (ocrData: any) => {
    setN8nLoading(false);
    setN8nMessage("");
    
    // Mapear datos de OCR a formulario manual
    setManualForm({
      fechaPago: ocrData.fecha_de_pago_proceso_l2 || '',
      proveedor: ocrData.proveedor_proceso_l2 || '',
      concepto: ocrData.concepto_proceso_l2 || '',
      moneda: ocrData.moneda_proceso_l2 || 'MXN',
      importe: ocrData.pagado_proceso_l2 || '',
      notas: ocrData.notas_proceso_l2 || '',
    });
    
    setUploadMode('manual');
    setN8nMessage('Revisa y corrige los datos extraídos antes de guardar.');
    
    // Mostrar información de duplicados si existe
    if (ocrData.isDuplicate) {
      setN8nMessage('⚠️ Se encontraron pagos similares. Revisa los datos antes de guardar.');
    }
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
    await addInvoice(invoiceData);
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

  // función para resetear el formulario manual
  const handleReset = () => {
    setManualForm({
      fechaPago: '',
      proveedor: '',
      concepto: '',
      moneda: '',
      importe: '',
      notas: '', // incluir notas vacío
    });
  };

  // función para saber si algún campo tiene valor
  const isManualFormFilled = Object.values(manualForm).some((v) => v && v.toString().trim() !== '');

  return (
    <div className="space-y-6">
      {showAlert && (
        <Alert color="success" onDismiss={() => setShowAlert(false)}>
          Invoice created successfully! Redirecting to invoice list...
        </Alert>
      )}

      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Agregar nuevo pago L2</h2>
        <div className="text-gray-500 text-sm mb-2 flex flex-wrap gap-4">
          <span>ID: {formData.id}</span>
          <span>Date: {formattedDate}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selector de modo de carga */}
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded font-medium border transition-colors ${uploadMode === 'auto' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setUploadMode('auto')}
          >
            Cargar automáticamente
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded font-medium border transition-colors ${uploadMode === 'manual' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setUploadMode('manual')}
          >
            Cargar manualmente
          </button>
        </div>
        {/* Render condicional */}
        {n8nLoading && <p className="text-blue-600">Procesando imagen...</p>}
        {n8nMessage && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 text-yellow-800 rounded">
            {n8nMessage}
          </div>
        )}
        {uploadMode === 'auto' && (
          <UploadForm onProcessed={handleMediaUpload} onCancel={() => setUploadMode('manual')} />
        )}
        {uploadMode === 'manual' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-6 border">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de pago:</label>
              <input type="date" name="fechaPago" value={manualForm.fechaPago} onChange={handleManualChange} className="w-full rounded px-3 py-2 border border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Proveedor:</label>
              <input type="text" name="proveedor" value={manualForm.proveedor} onChange={handleManualChange} className="w-full rounded px-3 py-2 border border-gray-300" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Concepto:</label>
              <input type="text" name="concepto" value={manualForm.concepto} onChange={handleManualChange} className="w-full rounded px-3 py-2 border border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Moneda:</label>
              <input type="text" name="moneda" value={manualForm.moneda} onChange={handleManualChange} className="w-full rounded px-3 py-2 border border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Importe neto pagado:</label>
              <input type="number" name="importe" value={manualForm.importe} onChange={handleManualChange} className="w-full rounded px-3 py-2 border border-gray-300" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Notas:</label>
              <input type="text" name="notas" value={manualForm.notas} onChange={handleManualChange} className="w-full rounded px-3 py-2 border border-gray-300" />
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-wrap gap-4 justify-end mt-8">
          <button
            type="submit"
            className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isManualFormFilled}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle"><path d="M12 5v14m7-7H5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Agregar pago</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1 text-pink-600 hover:text-white px-3 py-1 rounded transition-colors border border-pink-200 bg-pink-50 font-medium hover:bg-pink-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleReset}
            disabled={!isManualFormFilled}
          >
            <RotateCcw size={14} className="inline-block align-middle" />
            <span>Resetear</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateInvoice; 