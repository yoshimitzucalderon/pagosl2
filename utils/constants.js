// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'Sistema de Gestión de Pagos',
  version: '1.0.0',
  timezone: 'America/Tijuana',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFileTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
  maxFiles: 1
};

// Configuración de n8n
export const N8N_CONFIG = {
  baseUrl: 'https://n8n.ycm360.com',
  authUser: 'admin',
  authPassword: 'admin123',
  endpoints: {
    upload: '/webhook/upload-document',
    manual: '/webhook/manual-entry',
    confirm: '/webhook/confirm-save',
    test: '/webhook/test'
  }
};

// Configuración de Supabase
export const SUPABASE_CONFIG = {
  url: 'https://bmcscxzddfyttjdudkeh.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtY3NjeHpkZGZ5dHRqZHVka2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0OTU1NTYsImV4cCI6MjA2NjA3MTU1Nn0.Lk55d_BURUc9VXvpQIAJtZeGr9S2nQSi51PYerIbgmI',
  tables: {
    payments: 'erp_pagado_proceso_l2',
    projects: 'proyectos_master',
    users: 'auth.users'
  }
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'administrador',
  EDITOR: 'editor',
  VIEWER: 'visor'
};

// Departamentos
export const DEPARTMENTS = {
  REAL_ESTATE: 'Desarrollo inmobiliario',
  ADMIN: 'Administración'
};

// Monedas
export const CURRENCIES = {
  MXN: 'MXN',
  USD: 'USD'
};

// Estados de pago
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  PROCESSING: 'processing'
};

// Formas de pago
export const PAYMENT_METHODS = [
  'Efectivo',
  'Transferencia',
  'Cheque',
  'Tarjeta Crédito',
  'Tarjeta Débito',
  'PayPal',
  'Otro'
];

// Mensajes de error
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
  FILE_TOO_LARGE: 'El archivo es demasiado grande. Máximo 10MB.',
  INVALID_FILE_TYPE: 'Tipo de archivo no válido. Solo PDF, JPG, PNG.',
  DUPLICATE_PAYMENT: 'Ya existe un pago similar. Verifica los datos.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Inicia sesión nuevamente.'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  PAYMENT_CREATED: 'Pago registrado exitosamente.',
  PAYMENT_UPDATED: 'Pago actualizado exitosamente.',
  PAYMENT_DELETED: 'Pago eliminado exitosamente.',
  FILE_UPLOADED: 'Archivo subido exitosamente.',
  LOGIN_SUCCESS: 'Inicio de sesión exitoso.',
  LOGOUT_SUCCESS: 'Sesión cerrada exitosamente.',
  REGISTER_SUCCESS: 'Cuenta creada exitosamente.'
};

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  AUTH_CALLBACK: '/auth/callback',
  DASHBOARD: '/dashboard',
  PAYMENTS: '/payments',
  SETTINGS: '/settings'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  PAGE_SIZE_OPTIONS: [10, 20, 50]
};

// Configuración de filtros
export const FILTERS = {
  DATE_RANGE: {
    LAST_7_DAYS: 'last_7_days',
    LAST_30_DAYS: 'last_30_days',
    LAST_90_DAYS: 'last_90_days',
    THIS_MONTH: 'this_month',
    LAST_MONTH: 'last_month',
    THIS_YEAR: 'this_year',
    CUSTOM: 'custom'
  },
  AMOUNT_RANGE: {
    ALL: 'all',
    SMALL: 'small', // < $1,000
    MEDIUM: 'medium', // $1,000 - $10,000
    LARGE: 'large' // > $10,000
  }
};

// Configuración de notificaciones
export const NOTIFICATIONS = {
  AUTO_HIDE_DELAY: 5000, // 5 segundos
  POSITIONS: {
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left'
  },
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  }
};

// Configuración de validación
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_CONCEPT_LENGTH: 3,
  MAX_CONCEPT_LENGTH: 500,
  MIN_PROVIDER_LENGTH: 2,
  MAX_PROVIDER_LENGTH: 200,
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999999.99
};

// Configuración de exportación
export const EXPORT_CONFIG = {
  FORMATS: {
    CSV: 'csv',
    EXCEL: 'xlsx',
    PDF: 'pdf'
  },
  MAX_RECORDS: 1000,
  DEFAULT_FORMAT: 'csv'
};

// Configuración de auditoría
export const AUDIT_CONFIG = {
  TRACK_CHANGES: true,
  LOG_ACTIONS: true,
  RETENTION_DAYS: 365
};

// Configuración de seguridad
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
  PASSWORD_EXPIRY_DAYS: 90
}; 