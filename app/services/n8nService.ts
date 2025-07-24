// app/services/n8nService.ts
// Servicio para comunicación con n8n webhooks

interface N8nConfig {
  baseUrl: string;
  webhooks: {
    processDocument: string;
    confirmSave: string;
    manualEntry: string;
  };
}

interface ProcessingResult {
  success: boolean;
  data?: any;
  error?: string;
  processingStats?: {
    ocrTime?: number;
    conversionTime?: number;
    totalTime?: number;
  };
  duplicates?: any[];
  isDuplicate?: boolean;
}

interface SaveData {
  fechaPago: string;
  proveedor: string;
  concepto: string;
  moneda: string;
  importe: number;
  notas?: string;
  userId?: string;
  projectId?: string;
}

class N8nService {
  private config: N8nConfig;

  constructor() {
    // Configuración desde variables de entorno
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_N8N_BASE_URL || 'http://localhost:5678',
      webhooks: {
        processDocument: process.env.NEXT_PUBLIC_N8N_WEBHOOK_PROCESS_DOCUMENT || '/webhook/process-document',
        confirmSave: process.env.NEXT_PUBLIC_N8N_WEBHOOK_CONFIRM_SAVE || '/webhook/confirm-save',
        manualEntry: process.env.NEXT_PUBLIC_N8N_WEBHOOK_MANUAL_ENTRY || '/webhook/manual-entry',
      }
    };
  }

  /**
   * Procesa un documento con OCR usando n8n
   */
  async processDocument(file: File): Promise<ProcessingResult> {
    try {
      console.log('🚀 Iniciando procesamiento de documento en n8n:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', file);
      formData.append('timestamp', new Date().toISOString());
      formData.append('userId', this.getUserId() || 'anonymous');

      // Realizar petición a n8n
      const response = await fetch(`${this.config.baseUrl}${this.config.webhooks.processDocument}`, {
        method: 'POST',
        body: formData,
        headers: {
          // No incluir Content-Type para FormData
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('✅ Documento procesado exitosamente:', {
        extractedFields: Object.keys(result || {}).filter(key => result[key] && typeof result[key] === 'string'),
        processingTime: result.processingStats?.totalTime,
        hasDuplicates: result.isDuplicate
      });

      return {
        success: true,
        data: result, // Devolver el resultado completo, no solo result.data
        processingStats: result.processingStats,
        duplicates: result.duplicates,
        isDuplicate: result.isDuplicate
      };

    } catch (error) {
      console.error('❌ Error procesando documento:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Confirma y guarda los datos procesados por OCR
   */
  async confirmSave(ocrData: any, manualData?: SaveData): Promise<ProcessingResult> {
    try {
      console.log('💾 Confirmando guardado de datos:', {
        hasOcrData: !!ocrData,
        hasManualData: !!manualData
      });

      const payload = {
        ocrData,
        manualData,
        userId: this.getUserId(),
        timestamp: new Date().toISOString(),
        source: 'ocr_confirmation'
      };

      const response = await fetch(`${this.config.baseUrl}${this.config.webhooks.confirmSave}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('✅ Datos guardados exitosamente:', {
        recordId: result.recordId,
        savedAt: result.savedAt
      });

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('❌ Error guardando datos:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Guarda datos de entrada manual
   */
  async saveManualEntry(data: SaveData): Promise<ProcessingResult> {
    try {
      console.log('📝 Guardando entrada manual:', {
        proveedor: data.proveedor,
        importe: data.importe,
        fechaPago: data.fechaPago
      });

      const payload = {
        ...data,
        userId: this.getUserId(),
        timestamp: new Date().toISOString(),
        source: 'manual_entry'
      };

      const response = await fetch(`${this.config.baseUrl}${this.config.webhooks.manualEntry}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('✅ Entrada manual guardada exitosamente:', {
        recordId: result.recordId,
        savedAt: result.savedAt
      });

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('❌ Error guardando entrada manual:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Verifica el estado de conexión con n8n
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error verificando conexión con n8n:', error);
      return false;
    }
  }

  /**
   * Obtiene el ID del usuario actual (desde localStorage o contexto)
   */
  private getUserId(): string | null {
    if (typeof window !== 'undefined') {
      // Intentar obtener desde localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          return user.id || user.email || null;
        } catch (error) {
          console.warn('Error parsing user data from localStorage:', error);
        }
      }
    }
    return null;
  }

  /**
   * Obtiene estadísticas de procesamiento
   */
  getProcessingStats(): any {
    if (typeof window !== 'undefined') {
      const stats = localStorage.getItem('n8n_processing_stats');
      if (stats) {
        try {
          return JSON.parse(stats);
        } catch (error) {
          console.warn('Error parsing processing stats:', error);
        }
      }
    }
    return null;
  }

  /**
   * Guarda estadísticas de procesamiento
   */
  saveProcessingStats(stats: any): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('n8n_processing_stats', JSON.stringify({
          ...stats,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.warn('Error saving processing stats:', error);
      }
    }
  }
}

// Exportar instancia singleton
export const n8nService = new N8nService();

// Exportar tipos para uso en otros archivos
export type { ProcessingResult, SaveData, N8nConfig };

// Hook personalizado para usar el servicio en componentes React
import { useState, useCallback } from 'react';

export const useN8NService = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);

  const processDocument = useCallback(async (
    file: File, 
    userEmail: string, 
    userId: string | number
  ): Promise<any | null> => {
    setIsProcessing(true);
    setProcessingMessage('Subiendo archivo...');
    setProcessingProgress(20);

    try {
      setProcessingMessage('Procesando con OCR...');
      setProcessingProgress(50);

      const result = await n8nService.processDocument(file);
      
      setProcessingMessage('Procesamiento completado');
      setProcessingProgress(100);

      // Breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingMessage('');
        setProcessingProgress(0);
      }, 1000);

      return result;

    } catch (error) {
      setProcessingMessage(error instanceof Error ? error.message : 'Error desconocido');
      setProcessingProgress(0);
      
      // Limpiar mensaje de error después de un tiempo
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingMessage('');
      }, 5000);

      return null;
    }
  }, []);

  const savePayment = useCallback(async (
    paymentData: any, 
    isManual: boolean = false
  ): Promise<any | null> => {
    setIsProcessing(true);
    setProcessingMessage('Guardando pago...');
    setProcessingProgress(50);

    try {
      const result = isManual 
        ? await n8nService.saveManualEntry(paymentData)
        : await n8nService.confirmSave(paymentData);
      
      setProcessingMessage('Pago guardado exitosamente');
      setProcessingProgress(100);

      setTimeout(() => {
        setIsProcessing(false);
        setProcessingMessage('');
        setProcessingProgress(0);
      }, 1000);

      return result;

    } catch (error) {
      setProcessingMessage(error instanceof Error ? error.message : 'Error desconocido');
      setProcessingProgress(0);
      
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingMessage('');
      }, 5000);

      return null;
    }
  }, []);

  const resetState = useCallback(() => {
    setIsProcessing(false);
    setProcessingMessage('');
    setProcessingProgress(0);
  }, []);

  return {
    // Estados
    isProcessing,
    processingMessage,
    processingProgress,
    
    // Métodos
    processDocument,
    savePayment,
    resetState,
    
    // Servicio directo para casos avanzados
    service: n8nService
  };
}; 