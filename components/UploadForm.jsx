// components/UploadForm.jsx - Ultra-simplificado, todo el procesamiento en n8n
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { processDocument, checkDuplicatePayment } from '../lib/api';
import { 
  validateImageFile, 
  getFileType, 
  formatFileSize, 
  detectDocumentType,
  getFormatDescription,
  needsSpecialProcessing,
  getProcessingInfo
} from '../utils/imageValidation';
import { 
  DocumentIcon, 
  PhotoIcon, 
  ArrowPathIcon, 
  DevicePhoneMobileIcon,
  CloudArrowUpIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const UploadForm = ({ onProcessed, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [processingStep, setProcessingStep] = useState('');

  // Obtener ícono según tipo de archivo (expandido)
  const getFileIcon = (file) => {
    const fileType = getFileType(file);
    switch (fileType) {
      case 'pdf':
        return <DocumentIcon className="h-6 w-6 text-red-600" />;
      case 'heic':
        return <DevicePhoneMobileIcon className="h-6 w-6 text-blue-600" />;
      case 'tiff':
        return <PhotoIcon className="h-6 w-6 text-purple-600" />;
      case 'gif':
        return <PhotoIcon className="h-6 w-6 text-yellow-600" />;
      case 'svg':
        return <PhotoIcon className="h-6 w-6 text-indigo-600" />;
      case 'avif':
        return <PhotoIcon className="h-6 w-6 text-cyan-600" />;
      case 'webm':
        return <PhotoIcon className="h-6 w-6 text-orange-600" />;
      case 'image':
        return <PhotoIcon className="h-6 w-6 text-green-600" />;
      default:
        return <DocumentIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  // Obtener descripción del tipo de archivo (simplificado)
  const getFileDescription = (file) => {
    return getFormatDescription(file);
  };

  // Manejar archivos soltados
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setSelectedFile(null);

    try {
      // Validar archivo
      validateImageFile(file);
      
      // Mostrar archivo seleccionado
      setSelectedFile(file);
      
      console.log('📄 Archivo seleccionado:', {
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        needsSpecialProcessing: needsSpecialProcessing(file),
        isDocument: detectDocumentType(file)
      });
      
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Configuración del dropzone (TODOS LOS FORMATOS)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [
        '.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp', 
        '.tiff', '.tif', '.heic', '.heif', '.avif', '.jxl', 
        '.svg', '.ico', '.webm'
      ],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024 // 25MB para TIFFs grandes
  });

  // Procesar documento con OCR
  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);
    setProcessingStep('Subiendo archivo...');

    try {
      console.log('📤 Enviando archivo a n8n para procesamiento completo:', {
        name: selectedFile.name,
        size: formatFileSize(selectedFile.size),
        type: selectedFile.type
      });

      // Actualizar paso según tipo de archivo
      const processingSteps = getProcessingInfo(selectedFile);
      if (processingSteps.length > 1) {
        setProcessingStep(processingSteps[0] + '...');
      } else {
        setProcessingStep('Procesando con OCR...');
      }

      // Enviar a n8n (manejará conversión + compresión + OCR)
      const response = await processDocument(selectedFile);
      const ocrData = await response.json();

      if (ocrData.error) {
        setError('Error procesando documento: ' + ocrData.error);
        return;
      }

      setProcessingStep('Verificando duplicados...');

      // Verificar duplicados si tenemos datos básicos
      if (ocrData.proveedor_proceso_l2 && ocrData.concepto_proceso_l2) {
        const duplicateCheck = await checkDuplicatePayment(
          ocrData.concepto_proceso_l2,
          ocrData.pagado_proceso_l2,
          ocrData.fecha_de_pago_proceso_l2,
          ocrData.proveedor_proceso_l2
        );

        ocrData.duplicates = duplicateCheck.duplicates;
        ocrData.isDuplicate = duplicateCheck.isDuplicate;
      }

      console.log('✅ Procesamiento completado:', {
        extractedFields: Object.keys(ocrData).filter(key => ocrData[key]),
        processingStats: ocrData.processing_stats,
        hasDuplicates: ocrData.isDuplicate
      });

      // Pasar datos procesados al componente padre
      onProcessed(ocrData);

    } catch (error) {
      setError('Error procesando archivo: ' + error.message);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">


      {/* Dropzone */}
      {!selectedFile && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Suelta el archivo aquí...</p>
          ) : (
            <div>
              <p className="text-gray-700 font-medium">Arrastra archivos aquí o haz clic para seleccionar</p>
              <p className="text-sm text-gray-500 mt-2">
                Soporta: JPEG, PNG, WebP, GIF, BMP, TIFF, HEIC, AVIF, SVG, ICO, WebM, PDF (máx. 25MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Archivo seleccionado */}
      {selectedFile && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded border">
                {getFileIcon(selectedFile)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)} • {getFileDescription(selectedFile)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircleIcon className="h-5 w-5" />
              <span className="text-sm">Listo para procesar</span>
            </div>
          </div>

          {/* Información del procesamiento */}
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-3">
              🚀 Procesamiento automático en servidor
            </h4>
            
            {/* Mostrar procesos específicos para este archivo */}
            <div className="space-y-2 text-sm text-gray-600">
              {getProcessingInfo(selectedFile).map((process, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{process}</span>
                </div>
              ))}
            </div>
            
            {/* Información especial para formatos específicos */}
            {needsSpecialProcessing(selectedFile) && (
              <div className="mt-3 p-2 bg-amber-50 rounded text-xs text-amber-700">
                ⚡ Este formato requiere conversión especial - se procesará automáticamente
              </div>
            )}
            
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
              ✨ Optimización automática para máxima calidad OCR y menor peso
            </div>
          </div>
        </div>
      )}

      {/* Estado de procesamiento */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <ArrowPathIcon className="h-6 w-6 text-blue-600 animate-spin" />
            <div>
              <p className="font-medium text-blue-800">Procesando archivo...</p>
              <p className="text-sm text-blue-600">{processingStep}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Botones */}
      {selectedFile && !isProcessing && (
        <div className="flex gap-4">
          <button
            onClick={handleProcess}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center space-x-2"
          >
            <CloudArrowUpIcon className="h-5 w-5" />
            <span>🚀 Procesar en Servidor</span>
          </button>
          
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            Cancelar
          </button>
        </div>
      )}


    </div>
  );
};

export default UploadForm; 