import { z } from 'zod';

// Schema para autenticación
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Password debe tener al menos 6 caracteres')
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Password debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  department: z.enum(['Desarrollo inmobiliario', 'Administración']).default('Administración'),
  role: z.enum(['administrador', 'editor', 'visor']).default('visor')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

// Schema principal para erp_pagado_proceso_l2 (campos obligatorios)
export const paymentBaseSchema = z.object({
  proveedor_proceso_l2: z.string().min(2, 'Proveedor es requerido'),
  concepto_proceso_l2: z.string().min(3, 'Concepto es requerido'),
  pagado_proceso_l2: z.number().positive('Monto debe ser mayor a 0'),
  fecha_de_pago_proceso_l2: z.string().min(1, 'Fecha es requerida'),
});

// Schema extendido para formulario manual (campos opcionales)
export const paymentExtendedSchema = paymentBaseSchema.extend({
  concepto: z.string().optional(),
  moneda: z.enum(['MXN', 'USD']).default('MXN'),
  pagado_con_iva_mn: z.number().positive().optional(),
  forma_de_pago_mn: z.string().optional(),
  fecha_de_pago_mn: z.string().optional(),
  pagado_con_iva_usd: z.number().positive().optional(),
  forma_de_pago_usd: z.string().optional(),
  fecha_de_pago_usd: z.string().optional(),
  tc_pagado: z.number().positive().optional(),
  link_anexos: z.string().url().optional().or(z.literal('')),
  proyecto: z.string().optional(), // Vendrá de dropdown Supabase
  proveedor: z.string().optional(),
  cc_no: z.string().optional(),
  no_contrato_ot_odc: z.string().optional(),
  contrato_id_logico: z.string().uuid().optional()
});

// Schema para confirmación de datos procesados por OCR
export const confirmationSchema = z.object({
  // Campos principales (editables)
  proveedor_proceso_l2: z.string().min(2, 'Proveedor es requerido'),
  concepto_proceso_l2: z.string().min(3, 'Concepto es requerido'),
  pagado_proceso_l2: z.number().positive('Monto debe ser mayor a 0'),
  fecha_de_pago_proceso_l2: z.string().min(1, 'Fecha es requerida'),
  
  // Campos adicionales detectados por OCR (opcionales)
  concepto: z.string().optional(),
  moneda: z.enum(['MXN', 'USD']).optional(),
  proyecto: z.string().optional(), // Dropdown desde Supabase
  proveedor: z.string().optional(),
  
  // Metadatos del procesamiento
  archivo_url: z.string().optional(),
  confidence_score: z.number().optional(),
  ocr_version: z.string().optional()
});

// Schema para verificación de duplicados
export const duplicateCheckSchema = z.object({
  proveedor_proceso_l2: z.string(),
  concepto_proceso_l2: z.string(),
  pagado_proceso_l2: z.number(),
  fecha_de_pago_proceso_l2: z.string(),
  tolerance: z.number().default(0.01) // Tolerancia para montos similares
});

// Opciones para departamentos
export const departamentosOptions = [
  { value: 'Desarrollo inmobiliario', label: 'Desarrollo Inmobiliario' },
  { value: 'Administración', label: 'Administración' }
];

// Opciones para roles de usuario
export const rolesOptions = [
  { value: 'administrador', label: 'Administrador', description: 'Acceso completo: crear, editar, eliminar y configurar' },
  { value: 'editor', label: 'Editor', description: 'Crear y editar registros de pago' },
  { value: 'visor', label: 'Visor', description: 'Solo visualizar registros existentes' }
];

// Opciones para formas de pago
export const formasPagoOptions = [
  'Efectivo',
  'Transferencia',
  'Cheque',
  'Tarjeta Crédito',
  'Tarjeta Débito',
  'PayPal',
  'Otro'
];

// Opciones para monedas
export const monedasOptions = [
  { value: 'MXN', label: 'Peso Mexicano (MXN)' },
  { value: 'USD', label: 'Dólar Americano (USD)' }
];

// Validadores de permisos por rol
export const canCreatePayments = (userRole) => {
  return ['administrador', 'editor'].includes(userRole);
};

export const canEditPayments = (userRole, isOwner = false) => {
  if (userRole === 'administrador') return true;
  if (userRole === 'editor' && isOwner) return true;
  return false;
};

export const canDeletePayments = (userRole) => {
  return userRole === 'administrador';
};

export const canViewAllPayments = (userRole) => {
  return userRole === 'administrador';
};

export const canExportData = (userRole) => {
  return ['administrador', 'editor'].includes(userRole);
};

// Helper para limpiar datos antes de enviar
export const cleanPaymentData = (data) => {
  const cleaned = { ...data };
  
  // Remover campos vacíos
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  // Formatear números
  if (cleaned.pagado_proceso_l2) {
    cleaned.pagado_proceso_l2 = parseFloat(cleaned.pagado_proceso_l2);
  }
  if (cleaned.pagado_con_iva_mn) {
    cleaned.pagado_con_iva_mn = parseFloat(cleaned.pagado_con_iva_mn);
  }
  if (cleaned.pagado_con_iva_usd) {
    cleaned.pagado_con_iva_usd = parseFloat(cleaned.pagado_con_iva_usd);
  }
  if (cleaned.tc_pagado) {
    cleaned.tc_pagado = parseFloat(cleaned.tc_pagado);
  }
  
  return cleaned;
}; 