'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from './auth/AuthProvider';
import { uploadDocument } from '../lib/api';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../utils/formatters';

export default function UploadForm({ onSuccess, onError }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleUpload = async () => {
    if (!uploadedFile) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      // Simular progreso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadDocument(uploadedFile, user);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Simular delay para mostrar progreso completo
      setTimeout(() => {
        onSuccess(result);
      }, 500);

    } catch (error) {
      console.error('Error en upload:', error);
      onError(error.message || 'Error al procesar el documento');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            📄 Subir Documento
          </h2>
          <p className="text-gray-600">
            Sube un PDF o imagen para procesamiento automático con OCR
          </p>
        </div>

        {/* Zona de drop */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-400 bg-primary-50'
              : uploadedFile
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          
          {uploadedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Archivo seleccionado
                </p>
                <p className="text-sm text-gray-600">
                  {uploadedFile.name} ({formatFileSize(uploadedFile.size)})
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <X className="h-4 w-4 mr-1" />
                Cambiar archivo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra y suelta un archivo aquí'}
                </p>
                <p className="text-sm text-gray-600">
                  o haz clic para seleccionar
                </p>
              </div>
              <div className="text-xs text-gray-500">
                <p>Formatos soportados: PDF, JPG, PNG</p>
                <p>Tamaño máximo: 10MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Errores de archivo */}
        {fileRejectionItems.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <h3 className="text-sm font-medium text-red-800">
                Archivos rechazados
              </h3>
            </div>
            <ul className="mt-2 text-sm text-red-700">
              {fileRejectionItems}
            </ul>
          </div>
        )}

        {/* Barra de progreso */}
        {uploading && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Procesando documento...
              </span>
              <span className="text-sm text-gray-500">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Botón de procesar */}
        {uploadedFile && !uploading && (
          <div className="mt-6">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {uploading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <File className="h-5 w-5 mr-2" />
                  Procesar Documento
                </>
              )}
            </button>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            💡 ¿Qué documentos puedo subir?
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Facturas y recibos en PDF o imagen</li>
            <li>• Documentos con texto claro y legible</li>
            <li>• Archivos de hasta 10MB de tamaño</li>
            <li>• Formatos: PDF, JPG, PNG</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 