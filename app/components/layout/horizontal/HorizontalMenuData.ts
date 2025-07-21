import { uniqueId } from 'lodash';

const HorizontalMenuData = [
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: "solar:layers-line-duotone",
    href: '/dashboard',
    children: [
      {
        id: uniqueId(),
        title: "Resumen",
        icon: 'solar:chart-2-broken',
        href: "/dashboard",
      },
      {
        id: uniqueId(),
        title: "Analytics",
        icon: 'solar:chart-line-duotone',
        href: "/dashboard?tab=analytics",
      },
      {
        id: uniqueId(),
        title: "Reportes",
        icon: 'solar:document-line-duotone',
        href: "/dashboard?tab=reports",
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Pagos',
    icon: 'solar:card-line-duotone',
    href: '/payments',
    children: [
      {
        id: uniqueId(),
        title: "Todos los Pagos",
        icon: 'solar:card-line-duotone',
        href: "/payments",
      },
      {
        id: uniqueId(),
        title: "Pagos Pendientes",
        icon: 'solar:clock-circle-line-duotone',
        href: "/payments?status=pending",
      },
      {
        id: uniqueId(),
        title: "Pagos Exitosos",
        icon: 'solar:check-circle-line-duotone',
        href: "/payments?status=success",
      },
      {
        id: uniqueId(),
        title: "Pagos Fallidos",
        icon: 'solar:close-circle-line-duotone',
        href: "/payments?status=failed",
      },
      {
        id: uniqueId(),
        title: "Nuevo Pago",
        icon: 'solar:add-circle-line-duotone',
        href: "/payments/new",
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Campañas',
    icon: 'solar:megaphone-line-duotone',
    href: '/campaigns',
    children: [
      {
        id: uniqueId(),
        title: "Todas las Campañas",
        icon: 'solar:widget-line-duotone',
        href: "/campaigns",
      },
      {
        id: uniqueId(),
        title: "Campañas Activas",
        icon: 'solar:play-circle-line-duotone',
        href: "/campaigns?status=active",
      },
      {
        id: uniqueId(),
        title: "Campañas Pausadas",
        icon: 'solar:pause-circle-line-duotone',
        href: "/campaigns?status=paused",
      },
      {
        id: uniqueId(),
        title: "Nueva Campaña",
        icon: 'solar:add-circle-line-duotone',
        href: "/campaigns/new",
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Clientes',
    icon: 'solar:users-group-line-duotone',
    href: '/customers',
    children: [
      {
        id: uniqueId(),
        title: "Todos los Clientes",
        icon: 'solar:users-group-line-duotone',
        href: "/customers",
      },
      {
        id: uniqueId(),
        title: "Clientes Activos",
        icon: 'solar:user-check-line-duotone',
        href: "/customers?status=active",
      },
      {
        id: uniqueId(),
        title: "Nuevo Cliente",
        icon: 'solar:user-plus-line-duotone',
        href: "/customers/new",
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Reportes',
    icon: 'solar:document-line-duotone',
    href: '/reports',
    children: [
      {
        id: uniqueId(),
        title: "Reporte de Ventas",
        icon: 'solar:chart-line-duotone',
        href: "/reports/sales",
      },
      {
        id: uniqueId(),
        title: "Reporte de Pagos",
        icon: 'solar:card-line-duotone',
        href: "/reports/payments",
      },
      {
        id: uniqueId(),
        title: "Reporte de Campañas",
        icon: 'solar:megaphone-line-duotone',
        href: "/reports/campaigns",
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Configuración',
    icon: 'solar:settings-line-duotone',
    href: '/settings',
    children: [
      {
        id: uniqueId(),
        title: "Perfil de Usuario",
        icon: 'solar:user-line-duotone',
        href: "/settings/profile",
      },
      {
        id: uniqueId(),
        title: "Configuración de Cuenta",
        icon: 'solar:settings-line-duotone',
        href: "/settings/account",
      },
      {
        id: uniqueId(),
        title: "Configuración de Pagos",
        icon: 'solar:card-line-duotone',
        href: "/settings/payments",
      },
      {
        id: uniqueId(),
        title: "Notificaciones",
        icon: 'solar:bell-line-duotone',
        href: "/settings/notifications",
      },
    ],
  },
];

export default HorizontalMenuData; 