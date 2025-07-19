// Formatear moneda MXN
export const formatCurrencyMXN = (amount) => {
  if (!amount && amount !== 0) return '$0.00';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Formatear moneda USD
export const formatCurrencyUSD = (amount) => {
  if (!amount && amount !== 0) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Formatear fecha
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

// Formatear fecha y hora
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Formatear fecha para input type="date"
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Obtener fecha actual en formato para input
export const getCurrentDateForInput = () => {
  return new Date().toISOString().split('T')[0];
};

// Formatear número con separadores de miles
export const formatNumber = (number) => {
  if (!number && number !== 0) return '0';
  return new Intl.NumberFormat('es-MX').format(number);
};

// Formatear porcentaje
export const formatPercentage = (value) => {
  if (!value && value !== 0) return '0%';
  return `${(value * 100).toFixed(2)}%`;
};

// Truncar texto largo
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalizar primera letra
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Formatear nombre completo
export const formatFullName = (firstName, lastName) => {
  const first = capitalize(firstName || '');
  const last = capitalize(lastName || '');
  return `${first} ${last}`.trim();
};

// Formatear rol para mostrar
export const formatRole = (role) => {
  const roleMap = {
    'administrador': 'Administrador',
    'editor': 'Editor',
    'visor': 'Visor'
  };
  return roleMap[role] || role;
};

// Formatear departamento para mostrar
export const formatDepartment = (department) => {
  const deptMap = {
    'Desarrollo inmobiliario': 'Desarrollo Inmobiliario',
    'Administración': 'Administración'
  };
  return deptMap[department] || department;
};

// Formatear estado de pago
export const formatPaymentStatus = (status) => {
  const statusMap = {
    'pending': 'Pendiente',
    'completed': 'Completado',
    'cancelled': 'Cancelado',
    'processing': 'Procesando'
  };
  return statusMap[status] || status;
};

// Obtener color por rol
export const getRoleColor = (role) => {
  const colorMap = {
    'administrador': 'bg-red-100 text-red-800',
    'editor': 'bg-blue-100 text-blue-800',
    'visor': 'bg-gray-100 text-gray-800'
  };
  return colorMap[role] || 'bg-gray-100 text-gray-800';
};

// Obtener color por departamento
export const getDepartmentColor = (department) => {
  const colorMap = {
    'Desarrollo inmobiliario': 'bg-green-100 text-green-800',
    'Administración': 'bg-purple-100 text-purple-800'
  };
  return colorMap[department] || 'bg-gray-100 text-gray-800';
};

// Formatear tamaño de archivo
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validar formato de email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar formato de URL
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Generar ID único
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Obtener tiempo transcurrido
export const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Hace un momento';
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
  
  return formatDate(dateString);
}; 