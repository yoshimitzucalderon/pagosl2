// utils/imageValidation.js - SOLO validación, sin procesamiento - TODOS LOS FORMATOS
export function validateImageFile(file) {
  const validTypes = [
    // Formatos básicos
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 
    'image/gif', 'image/bmp', 'image/tiff', 'image/tif',
    // Formatos iPhone/móviles
    'image/heic', 'image/heif',  
    // Formatos modernos
    'image/avif', 'image/jxl', 'image/svg+xml',
    // Formatos legacy
    'image/x-icon', 'image/vnd.microsoft.icon', 'image/ico',
    'image/x-ms-bmp', 'image/x-bmp',
    // Videos/animaciones
    'image/webm', 'video/webm',
    // Documentos
    'application/pdf'
  ];
  
  const validExtensions = [
    // Básicos
    '.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', 
    // TIFF variants
    '.tiff', '.tif',
    // iPhone
    '.heic', '.heif',
    // Modernos
    '.avif', '.jxl', '.svg',
    // Legacy
    '.ico', '.icon',
    // Videos/animaciones
    '.webm',
    // Documentos
    '.pdf'
  ];
  
  const maxSize = 25 * 1024 * 1024; // Aumentar a 25MB para TIFFs grandes

  // Verificar por MIME type Y extensión
  const hasValidMimeType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext => 
    file.name?.toLowerCase().endsWith(ext)
  );

  if (!hasValidMimeType && !hasValidExtension) {
    throw new Error(`Tipo de archivo no válido: ${file.type || 'desconocido'}. 
    Formatos soportados: JPEG, PNG, WebP, GIF, BMP, TIFF, HEIC, AVIF, SVG, ICO, WebM, PDF`);
  }

  if (file.size > maxSize) {
    throw new Error('El archivo es demasiado grande. Máximo 25MB');
  }

  return true;
}

// Detectar tipo de archivo para iconos (expandido)
export function getFileType(file) {
  if (file.type === 'application/pdf') return 'pdf';
  if (isHeicFile(file)) return 'heic';
  if (isTiffFile(file)) return 'tiff';
  if (isGifFile(file)) return 'gif';
  if (isSvgFile(file)) return 'svg';
  if (isAvifFile(file)) return 'avif';
  if (isWebmFile(file)) return 'webm';
  if (file.type?.startsWith('image/')) return 'image';
  return 'unknown';
}

// Detectar HEIC
export function isHeicFile(file) {
  return file.type === 'image/heic' || 
         file.type === 'image/heif' ||
         file.name?.toLowerCase().endsWith('.heic') ||
         file.name?.toLowerCase().endsWith('.heif');
}

// Detectar TIFF
export function isTiffFile(file) {
  return file.type === 'image/tiff' || 
         file.type === 'image/tif' ||
         file.name?.toLowerCase().endsWith('.tiff') ||
         file.name?.toLowerCase().endsWith('.tif');
}

// Detectar GIF
export function isGifFile(file) {
  return file.type === 'image/gif' ||
         file.name?.toLowerCase().endsWith('.gif');
}

// Detectar SVG
export function isSvgFile(file) {
  return file.type === 'image/svg+xml' ||
         file.name?.toLowerCase().endsWith('.svg');
}

// Detectar AVIF
export function isAvifFile(file) {
  return file.type === 'image/avif' ||
         file.name?.toLowerCase().endsWith('.avif');
}

// Detectar WebM
export function isWebmFile(file) {
  return file.type === 'image/webm' || 
         file.type === 'video/webm' ||
         file.name?.toLowerCase().endsWith('.webm');
}

// Formatear tamaño de archivo
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Detectar si es documento (para mostrar info al usuario)
export function detectDocumentType(file) {
  if (!file.name) return false;
  
  const documentKeywords = [
    'factura', 'invoice', 'recibo', 'receipt', 
    'comprobante', 'documento', 'doc', 'ticket',
    'boleta', 'nota', 'contrato', 'contract',
    'scan', 'escaneo', 'copia'
  ];
  
  const lowerFileName = file.name.toLowerCase();
  return documentKeywords.some(keyword => lowerFileName.includes(keyword));
}

// Obtener descripción del formato
export function getFormatDescription(file) {
  const type = getFileType(file);
  const isDoc = detectDocumentType(file);
  
  const descriptions = {
    'pdf': '📄 Documento PDF',
    'heic': '📱 Imagen iPhone (HEIC)',
    'tiff': '🖼️ Imagen TIFF (alta calidad)',
    'gif': '🎬 Imagen animada (GIF)',
    'svg': '🎨 Gráfico vectorial (SVG)',
    'avif': '🆕 Imagen moderna (AVIF)',
    'webm': '🎥 Video/imagen WebM',
    'image': isDoc ? '📄 Imagen de documento' : '📷 Imagen'
  };
  
  return descriptions[type] || '📁 Archivo';
}

// Verificar si el formato necesita conversión especial
export function needsSpecialProcessing(file) {
  return isHeicFile(file) || 
         isTiffFile(file) || 
         isSvgFile(file) || 
         isAvifFile(file) ||
         isWebmFile(file);
}

// Obtener información de procesamiento esperado
export function getProcessingInfo(file) {
  const processes = [];
  
  if (isHeicFile(file)) {
    processes.push('Conversión HEIC → JPEG');
  }
  
  if (isTiffFile(file)) {
    processes.push('Conversión TIFF → JPEG');
  }
  
  if (isSvgFile(file)) {
    processes.push('Rasterización SVG → JPEG');
  }
  
  if (isAvifFile(file)) {
    processes.push('Conversión AVIF → JPEG');
  }
  
  if (isWebmFile(file)) {
    processes.push('Extracción de frame → JPEG');
  }
  
  if (file.size > 2 * 1024 * 1024) {
    processes.push('Compresión inteligente');
  }
  
  processes.push('Optimización para OCR');
  
  return processes;
}