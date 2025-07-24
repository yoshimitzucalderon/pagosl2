"use client";
import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useN8NService } from '@/app/services/n8nService';

interface UploadFormProps {
  onProcessed: (data: any) => void;
  onCancel: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onProcessed, onCancel }) => {
  const { user } = useAuth();
  const { processDocument, isProcessing, processingMessage, processingProgress } = useN8NService();
  
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuración desde variables de entorno
  const maxFileSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '26214400'); // 25MB
  const acceptedTypes = process.env.NEXT_PUBLIC_ACCEPTED_FILE_TYPES || '.pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.heic,.heif';

  // Validar tipo y tamaño de archivo
  const validateFile = (selectedFile: File): string | null => {
    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/heic',
      'image/heif'
    ];

    if (!validTypes.includes(selectedFile.type)) {
      return 'Tipo de archivo no soportado. Use PDF o imágenes (JPG, PNG, etc.)';
    }

    if (selectedFile.size > maxFileSize) {
      return `El archivo es muy grande. Máximo ${Math.round(maxFileSize / 1024 / 1024)}MB.`;
    }

    return null;
  };

  // Manejar eventos de drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    console.log('Archivo seleccionado:', selectedFile.name, selectedFile.type, selectedFile.size);
    setError('');
    
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);
    console.log('Archivo válido, establecido en estado');
  };

  const processFile = async () => {
    if (!file || !user) {
      console.log('No hay archivo o usuario:', { file: !!file, user: !!user });
      return;
    }

    try {
      console.log('Iniciando procesamiento del archivo:', file.name);
      const result = await processDocument(file, user.email, user.id?.toString() || '1');
      
      if (result && result.success) {
        console.log('Resultado del procesamiento:', result);
        // Agregar metadatos adicionales
        const enrichedData = {
          ...result.data, // Usar result.data que contiene los datos extraídos
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          upload_timestamp: new Date().toISOString()
        };

        console.log('📤 Enviando datos enriquecidos al componente padre:', enrichedData);
        onProcessed(enrichedData);
      } else {
        console.error('❌ Error en el procesamiento:', result);
        setError('Error en el procesamiento del documento');
      }

    } catch (error) {
      console.error('Error procesando archivo:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const resetForm = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <Image className="w-8 h-8 text-blue-500" />;
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = () => {
    if (error) return 'border-red-500 bg-red-50';
    if (processingMessage?.includes('✅')) return 'border-green-500 bg-green-50';
    if (isProcessing) return 'border-blue-500 bg-blue-50';
    if (file) return 'border-green-500 bg-green-50';
    if (dragActive) return 'border-blue-500 bg-blue-50';
    return 'border-gray-300 bg-gray-50 hover:bg-gray-100';
  };

  return (
    <div className="space-y-4">
      {/* Área de upload */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${getStatusColor()}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          accept={acceptedTypes}
          disabled={isProcessing}
        />

        {!file ? (
          <div className="space-y-4">
            <Upload className="w-16 h-16 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Soporta: PDF, JPG, PNG, GIF, BMP, WebP, HEIC (máx. {Math.round(maxFileSize / 1024 / 1024)}MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              {getFileIcon(file)}
              <div className="text-left">
                <p className="font-medium text-gray-700">{file.name}</p>
                <p className="text-sm text-gray-500">{getFileSize(file.size)}</p>
              </div>
            </div>
            
            {/* Barra de progreso */}
            {isProcessing && processingProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-blue-600">{processingMessage}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Mensaje de éxito */}
            {!isProcessing && processingMessage && !error && (
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600">{processingMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="mt-4 flex items-center justify-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isProcessing}
        >
          <X className="w-4 h-4 inline mr-2" />
          Limpiar
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isProcessing}
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={processFile}
          disabled={!file || isProcessing || !!error}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            !file || isProcessing || !!error
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
              Procesando...
            </>
          ) : (
            'Procesar con OCR'
          )}
        </button>
      </div>

      {/* Información adicional */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• El procesamiento OCR extrae automáticamente datos de facturas y documentos de pago</p>
        <p>• Los datos extraídos aparecerán en el formulario para su revisión y edición</p>
        <p>• Asegúrate de que el documento tenga buena calidad para mejores resultados</p>
        <p>• El sistema detecta automáticamente proyectos basado en el contenido del documento</p>
      </div>
    </div>
  );
};

export default UploadForm; 