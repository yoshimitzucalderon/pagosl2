"use client"
import React, { useState, useContext, useEffect } from "react";
import { InvoiceContext } from "@/app/context/InvoiceContext";
import { useRouter } from "next/navigation";
import { Alert, Button, Label, Select, TextInput } from "flowbite-react";
import { format, isValid, parseISO } from "date-fns";
import Link from "next/link";
import UploadForm from "../../../../../components/UploadForm";
import { RotateCcw, Save, AlertTriangle } from "lucide-react";
import { supabase } from '../../../../../lib/supabase';
import { useAuth } from '@/app/context/AuthContext';

function CreateInvoice() {
  const { addInvoice, invoices } = useContext(InvoiceContext);
  const { user } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  
  // Estado para el modo de carga
  const [uploadMode, setUploadMode] = useState<'auto' | 'manual'>('auto');
  
  // Estado para el formulario manual
  const [manualForm, setManualForm] = useState({
    fecha_de_pago_proceso_l2: '',
    proveedor_proceso_l2: '',
    concepto_proceso_l2: '',
    moneda: 'MXN',
    pagado_proceso_l2: '',
    nota_proceso_l2: '',
    proyecto: 'General',
    tc_pagado: ''
  });

  // Estado para proyectos disponibles
  const [availableProjects, setAvailableProjects] = useState<string[]>([]);
  
  // Estado para el procesamiento
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [ocrData, setOcrData] = useState<any>(null);

  // Cargar proyectos al montar el componente
  useEffect(() => {
    fetchProjects();
  }, []);

  // Debug: Monitorear cambios en el formulario manual
  useEffect(() => {
    console.log('🔄 Formulario manual actualizado:', manualForm);
  }, [manualForm]);

  // Debug: Monitorear cambios en el modo de upload
  useEffect(() => {
    console.log('🔄 Modo de upload actualizado:', uploadMode);
  }, [uploadMode]);

  // Función para obtener proyectos desde Supabase
  const fetchProjects = async (): Promise<void> => {
    try {
      console.log('🔄 Cargando proyectos desde Supabase...');
      
      const { data, error } = await supabase
        .from('erp_proyectos')
        .select('proyecto')
        .order('proyecto');
      
      if (error) {
        console.error('❌ Error en Supabase:', error);
        throw error;
      }
      
      console.log('📊 Proyectos obtenidos de Supabase:', data);
      console.log('📊 Tipo de datos:', typeof data);
      console.log('📊 Es array:', Array.isArray(data));
      console.log('📊 Longitud:', data?.length);
      
      if (!data || data.length === 0) {
        console.warn('⚠️ No se encontraron proyectos en la tabla erp_proyectos');
        // Usar proyectos de respaldo
        const fallbackProjects = ['General', 'Everett', 'Nueva la Tierra', 'Showroom EV/NLT', 'A1', 'A2', 'Oficina', 'Arboreta', 'Otros'];
        setAvailableProjects(fallbackProjects);
        console.log('🔄 Usando proyectos de respaldo:', fallbackProjects);
        return;
      }
      
      const projects = data.map((item: any) => item.proyecto);
      setAvailableProjects(projects);
      
      console.log('✅ Proyectos cargados exitosamente:', projects);
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      // Fallback projects
      const fallbackProjects = ['General', 'Everett', 'Nueva la Tierra', 'Showroom EV/NLT', 'A1', 'A2', 'Oficina', 'Arboreta', 'Otros'];
      setAvailableProjects(fallbackProjects);
      console.log('🔄 Usando proyectos de respaldo:', fallbackProjects);
    }
  };

  // Maneja los datos procesados por n8n
  const handleMediaUpload = async (processedData: any) => {
    console.log('🔄 handleMediaUpload llamado con datos:', processedData);
    
    setIsProcessing(false);
    setProcessingMessage("");
    setOcrData(processedData);
    
    // Mapear datos de OCR a formulario manual
    const mappedData = {
      fecha_de_pago_proceso_l2: processedData.fecha_de_pago_proceso_l2 || '',
      proveedor_proceso_l2: processedData.proveedor_proceso_l2 || '',
      concepto_proceso_l2: processedData.concepto_proceso_l2 || '',
      moneda: processedData.moneda || 'MXN',
      pagado_proceso_l2: processedData.pagado_proceso_l2?.toString() || '',
      nota_proceso_l2: processedData.nota_proceso_l2 || '',
      proyecto: processedData.proyecto || 'General',
      tc_pagado: processedData.tc_pagado?.toString() || ''
    };
    
    console.log('📝 Datos mapeados al formulario:', mappedData);
    setManualForm(mappedData);
    
    setUploadMode('manual');
    
    // Mostrar información sobre la detección RAG
    if (processedData.rag_detection) {
      const rag = processedData.rag_detection;
      console.log('🧠 Detección RAG:', rag);
      if (rag.confidence_score >= 0.8) {
        setProcessingMessage(`✅ Proyecto detectado: "${rag.detected_project}" (${Math.round(rag.confidence_score * 100)}% confianza)`);
      } else {
        setProcessingMessage(`⚠️ Proyecto detectado con baja confianza: "${rag.detected_project}" (${Math.round(rag.confidence_score * 100)}%). Verifica el proyecto seleccionado.`);
      }
    } else {
      setProcessingMessage('📄 Datos extraídos exitosamente. Revisa y confirma antes de guardar.');
    }
    
    console.log('✅ handleMediaUpload completado');
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setManualForm((prev) => ({ ...prev, [name]: value }));
  };

  // Debug: Mostrar el estado actual del formulario
  console.log('📊 Estado actual del formulario manual:', manualForm);
  console.log('📊 Estado actual del modo de upload:', uploadMode);

  // Función para guardar usando el webhook de confirmación de n8n
  const handleSaveToN8n = async () => {
    if (!isManualFormFilled) return;

    setIsProcessing(true);
    setProcessingMessage("Guardando datos...");

    try {
      // Preparar datos para enviar al webhook de confirmación
      const dataToSave = {
        ...manualForm,
        pagado_proceso_l2: parseFloat(manualForm.pagado_proceso_l2) || 0,
        user_email: user?.email || 'unknown',
        user_id: user?.id || 1,
        
        // Agregar datos del OCR original si existen
        ...(ocrData && {
          file_name: ocrData.file_name,
          processing_type: ocrData.processing_type,
          processing_version: ocrData.processing_version,
          rag_detection: ocrData.rag_detection,
          anexo_proceso_l2: ocrData.anexo_proceso_l2
        })
      };

      console.log('Enviando datos a n8n:', dataToSave);

      // Enviar al webhook de confirmación
      const response = await fetch('https://n8n.ycm360.com/webhook/confirm-save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave)
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setProcessingMessage("✅ Pago guardado exitosamente");
        setShowAlert(true);
        
        // Redireccionar después de un breve delay
        setTimeout(() => {
          router.push('/invoice/list');
        }, 2000);
      } else {
        throw new Error(result.message || 'Error desconocido al guardar');
      }

    } catch (error) {
      console.error('Error guardando en n8n:', error);
      setProcessingMessage(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Función alternativa para guardar manualmente sin OCR
  const handleSaveManualToN8n = async () => {
    if (!isManualFormFilled) return;

    setIsProcessing(true);
    setProcessingMessage("Guardando datos...");

    try {
      const dataToSave = {
        ...manualForm,
        pagado_proceso_l2: parseFloat(manualForm.pagado_proceso_l2) || 0,
        user_email: user?.email || 'unknown',
        user_id: user?.id || 1
      };

      // Enviar al webhook de entrada manual
      const response = await fetch('https://n8n.ycm360.com/webhook/manual-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave)
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setProcessingMessage("✅ Pago guardado exitosamente");
        setShowAlert(true);
        
        setTimeout(() => {
          router.push('/invoice/list');
        }, 2000);
      } else {
        throw new Error(result.message || 'Error desconocido al guardar');
      }

    } catch (error) {
      console.error('Error guardando en n8n:', error);
      setProcessingMessage(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // función para resetear el formulario manual
  const handleReset = () => {
    setManualForm({
      fecha_de_pago_proceso_l2: '',
      proveedor_proceso_l2: '',
      concepto_proceso_l2: '',
      moneda: 'MXN',
      pagado_proceso_l2: '',
      nota_proceso_l2: '',
      proyecto: 'General',
      tc_pagado: ''
    });
    setOcrData(null);
    setProcessingMessage("");
  };

  // función para saber si algún campo tiene valor
  const isManualFormFilled = Object.entries(manualForm).some(([key, value]) => {
    if (key === 'moneda' && value === 'MXN') return false; // valor por defecto
    if (key === 'proyecto' && value === 'General') return false; // valor por defecto
    if (key === 'tc_pagado' && (!value || value === '')) return false; // tipo de cambio es opcional
    return value && value.toString().trim() !== '';
  });

  // Fecha formateada para el header
  const formattedDate = format(new Date(), 'EEEE, MMMM dd, yyyy');

  return (
    <div className="space-y-6">
      {showAlert && (
        <Alert color="success" onDismiss={() => setShowAlert(false)}>
          ¡Pago creado exitosamente! Redirigiendo a la lista de pagos...
        </Alert>
      )}

      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Agregar nuevo pago L2</h2>
        <div className="text-gray-500 text-sm mb-2 flex flex-wrap gap-4">
          <span>Fecha: {formattedDate}</span>
          <span>Usuario: {user?.email || 'Desconocido'}</span>
        </div>
      </div>

      {/* Selector de modo de carga */}
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          className={`px-4 py-2 rounded font-medium border transition-colors ${
            uploadMode === 'auto' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
          onClick={() => setUploadMode('auto')}
          disabled={isProcessing}
        >
          📁 Cargar automáticamente
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded font-medium border transition-colors ${
            uploadMode === 'manual' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
          onClick={() => setUploadMode('manual')}
          disabled={isProcessing}
        >
          ✏️ Cargar manualmente
        </button>
      </div>

      {/* Mensajes de estado */}
      {isProcessing && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 text-blue-800 rounded flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          {processingMessage}
        </div>
      )}
      
      {processingMessage && !isProcessing && (
        <div className={`border-l-4 p-3 mb-4 rounded ${
          processingMessage.includes('✅') 
            ? 'bg-green-50 border-green-400 text-green-800'
            : processingMessage.includes('⚠️')
            ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
            : processingMessage.includes('❌')
            ? 'bg-red-50 border-red-400 text-red-800'
            : 'bg-blue-50 border-blue-400 text-blue-800'
        }`}>
          {processingMessage}
        </div>
      )}

      {/* Render condicional */}
      {uploadMode === 'auto' && (
        <UploadForm 
          onProcessed={handleMediaUpload} 
          onCancel={() => setUploadMode('manual')} 
        />
      )}

      {uploadMode === 'manual' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-6 border">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de pago *:</label>
              <input 
                type="date" 
                name="fecha_de_pago_proceso_l2" 
                value={manualForm.fecha_de_pago_proceso_l2} 
                onChange={handleManualChange} 
                className="w-full rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Proveedor *:</label>
              <input 
                type="text" 
                name="proveedor_proceso_l2" 
                value={manualForm.proveedor_proceso_l2} 
                onChange={handleManualChange} 
                className="w-full rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                placeholder="Nombre del proveedor"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Concepto *:</label>
              <input 
                type="text" 
                name="concepto_proceso_l2" 
                value={manualForm.concepto_proceso_l2} 
                onChange={handleManualChange} 
                className="w-full rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                placeholder="Descripción del servicio o producto"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Moneda:</label>
              <select 
                name="moneda" 
                value={manualForm.moneda} 
                onChange={handleManualChange} 
                className="w-full rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="MXN">MXN (Pesos Mexicanos)</option>
                <option value="USD">USD (Dólares)</option>
                <option value="EUR">EUR (Euros)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Importe neto pagado *:</label>
              <input 
                type="number" 
                name="pagado_proceso_l2" 
                value={manualForm.pagado_proceso_l2} 
                onChange={handleManualChange} 
                className="w-full rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            
                         <div>
               <label className="block text-sm font-medium mb-1">Proyecto:</label>
               <select 
                 name="proyecto" 
                 value={manualForm.proyecto} 
                 onChange={handleManualChange} 
                 className="w-full rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
               >
                 {availableProjects.map(project => (
                   <option key={project} value={project}>{project}</option>
                 ))}
               </select>
             </div>
             
             <div>
               <label className="block text-sm font-medium mb-1">Tipo de cambio:</label>
               <input 
                 type="number" 
                 name="tc_pagado" 
                 value={manualForm.tc_pagado} 
                 onChange={handleManualChange} 
                 className="w-full rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                 placeholder="1.00"
                 min="0"
                 step="0.01"
               />
             </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Notas:</label>
              <textarea
                name="nota_proceso_l2" 
                value={manualForm.nota_proceso_l2} 
                onChange={handleManualChange} 
                className="w-full rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                placeholder="Información adicional (opcional)"
                rows={3}
              />
            </div>
          </div>

          {/* Información sobre el OCR si existe */}
          {ocrData && ocrData.rag_detection && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">🧠 Información de Detección Inteligente</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Proyecto detectado:</strong> {ocrData.rag_detection.detected_project}</p>
                <p><strong>Confianza:</strong> {Math.round(ocrData.rag_detection.confidence_score * 100)}%</p>
                <p><strong>Método:</strong> {ocrData.rag_detection.method}</p>
                {ocrData.rag_detection.original_mention && (
                  <p><strong>Mención original:</strong> "{ocrData.rag_detection.original_mention}"</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botones */}
      {uploadMode === 'manual' && (
        <div className="flex flex-wrap gap-4 justify-end mt-8">
          <button
            type="button"
            className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={ocrData ? handleSaveToN8n : handleSaveManualToN8n}
            disabled={!isManualFormFilled || isProcessing}
          >
            <Save size={16} />
            <span>Guardar pago</span>
          </button>
          
          <button
            type="button"
            className="flex items-center gap-2 text-pink-600 hover:text-white px-4 py-2 rounded transition-colors border border-pink-200 bg-pink-50 font-medium hover:bg-pink-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleReset}
            disabled={!isManualFormFilled || isProcessing}
          >
            <RotateCcw size={16} />
            <span>Resetear</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateInvoice; 