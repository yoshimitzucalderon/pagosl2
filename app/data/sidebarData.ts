export interface ChildItem {
  id: string;
  name: string;
  url: string;
  icon?: string;
  color?: string;
  children?: ChildItem[];
}

export const sidebarData: ChildItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    url: "/dashboard",
    icon: "solar:home-2-line-duotone",
    color: "text-primary",
  },
  {
    id: "pagos",
    name: "Pagos",
    url: "/pagos",
    icon: "solar:card-2-line-duotone",
    color: "text-success",
    children: [
      {
        id: "nuevo-pago",
        name: "Nuevo Pago",
        url: "/pagos/nuevo",
        icon: "solar:add-circle-line-duotone",
        color: "text-success",
      },
      {
        id: "historial-pagos",
        name: "Historial",
        url: "/pagos/historial",
        icon: "solar:clock-circle-line-duotone",
        color: "text-info",
      },
      {
        id: "reportes-pagos",
        name: "Reportes",
        url: "/pagos/reportes",
        icon: "solar:chart-2-line-duotone",
        color: "text-warning",
      },
    ],
  },
  {
    id: "clientes",
    name: "Clientes",
    url: "/clientes",
    icon: "solar:users-group-rounded-line-duotone",
    color: "text-info",
    children: [
      {
        id: "nuevo-cliente",
        name: "Nuevo Cliente",
        url: "/clientes/nuevo",
        icon: "solar:user-plus-line-duotone",
        color: "text-info",
      },
      {
        id: "lista-clientes",
        name: "Lista de Clientes",
        url: "/clientes/lista",
        icon: "solar:users-group-two-rounded-line-duotone",
        color: "text-info",
      },
    ],
  },
  {
    id: "campanas",
    name: "Campañas",
    url: "/campanas",
    icon: "solar:megaphone-line-duotone",
    color: "text-warning",
    children: [
      {
        id: "nueva-campana",
        name: "Nueva Campaña",
        url: "/campanas/nueva",
        icon: "solar:add-square-line-duotone",
        color: "text-warning",
      },
      {
        id: "gestionar-campanas",
        name: "Gestionar",
        url: "/campanas/gestionar",
        icon: "solar:settings-line-duotone",
        color: "text-warning",
      },
    ],
  },
  {
    id: "reportes",
    name: "Reportes",
    url: "/reportes",
    icon: "solar:chart-line-duotone",
    color: "text-secondary",
    children: [
      {
        id: "reporte-ventas",
        name: "Ventas",
        url: "/reportes/ventas",
        icon: "solar:trending-up-line-duotone",
        color: "text-success",
      },
      {
        id: "reporte-clientes",
        name: "Clientes",
        url: "/reportes/clientes",
        icon: "solar:users-group-rounded-line-duotone",
        color: "text-info",
      },
      {
        id: "reporte-campanas",
        name: "Campañas",
        url: "/reportes/campanas",
        icon: "solar:megaphone-line-duotone",
        color: "text-warning",
      },
    ],
  },
  {
    id: "configuracion",
    name: "Configuración",
    url: "/configuracion",
    icon: "solar:settings-line-duotone",
    color: "text-dark",
    children: [
      {
        id: "perfil",
        name: "Mi Perfil",
        url: "/configuracion/perfil",
        icon: "solar:user-line-duotone",
        color: "text-primary",
      },
      {
        id: "empresa",
        name: "Empresa",
        url: "/configuracion/empresa",
        icon: "solar:building-line-duotone",
        color: "text-secondary",
      },
      {
        id: "usuarios",
        name: "Usuarios",
        url: "/configuracion/usuarios",
        icon: "solar:users-group-two-rounded-line-duotone",
        color: "text-info",
      },
    ],
  },
]; 