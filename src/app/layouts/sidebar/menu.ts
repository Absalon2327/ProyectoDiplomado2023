import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENU PRINCIPAL',
    isTitle: true,
  },
  {
    id: 2,
    label: 'Inicio',
    icon: 'bx-home-circle',
    link: '/dashboard',
  },
  {
    id: 3,
    label: 'MODULOS',
    isTitle: true
  },
  {
    id: 6,
    label: "Empleados",
    icon: "bx-user-circle",
    role: ["ADMIN"],
    subItems: [
      {
        id: 7,
        label: "Listado",
        link: "/empleados/listar",
        role: ["ADMIN"],
        parentId: 6,
      },
      {
        id: 8,
        label: "Cargos",
        link: "/cargo/listar",
        role: ["ADMIN"],
        parentId: 6,
      },
      {
        id: 9,
        label: "Departamentos",
        link: "/depto/listar",
        role: ["ADMIN"],
        parentId: 6,
      },
    ],
  },

  {
    id: 7,
    label: "Solicitud Vehículo",
    icon: "mdi mdi-car-outline",
    role: ["ADMIN", "USER","JEFE_DEPTO","SECR_DECANATO","DECANO","ASIS_FINANCIERO","JEFE_FINANACIERO"],
    subItems: [

      {
        id: 8,
        label: "Listado",
        link: "/solicitud-vehiculo/listado",
        role: ["ADMIN","JEFE_DEPTO","SECR_DECANATO","DECANO"],
        parentId: 7,
      },
      {
        id: 10,
        label: "Mis solicitudes",
        link: "/solicitud-vehiculo/mis-solicitudes",
        role: ["ADMIN", "USER","JEFE_DEPTO","SECR_DECANATO","DECANO","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 7,
      },
    ],
  },
  {
    id: 9,
    label: "Solcitudes de Vales",
    icon: "mdi mdi-gas-station",
    role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
    subItems: [

      {
        id: 10,
        label: "Por Aprobar",
        link: "/solicitudes/solictud-aprobar",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 9,
      },
      {
        id: 11,
        label: "Mis Solicitudes",
        link: "/solicitudes/solicitudvale",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 9,
      },
    ],
  },
  {
    id: 8,
    label: "Vales",
    icon: "mdi mdi-gas-station",
    role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
    subItems: [
      {
        id: 9,
        label: "Proveedor",
        link: "/proveedor",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 8,
      },
      {
        id: 10,
        label: "Compras",
        link: "/compra",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 8,
      },
      {
        id: 111,
        label: "Ajustes de Vales",
        link: "/devolucion-vale",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 8,
      },

    ],
  },

  {
    id: 10,
    label: "Entradas y Salidas",
    icon: "dripicons-document-edit",
    role: ["ADMIN","VIGILANTE"],
    subItems: [
      {
        id: 11,
        label: "Listado",
        link: "/entrasalida/listar",
        role: ["ADMIN","VIGILANTE"],
        parent: 10,
      },
      {
        id: 12,
        label: "Documento",
        link: "/document/vale",
        role: ["ADMIN","VIGILANTE"],
        parent: 10,
      },
    ],
  },
  {
    id: 11,
    label: "Reportes",
    icon: "mdi mdi-file-document-outline",
    role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
    subItems: [
      {
        id: 12,
        label: "Consumo de Vales",
        link: "/solicitudes/solicitudv",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 11,
      },
      {
        id: 13,
        label: "Solicitud de Transporte",
        link: "/solicitudes/solicitante",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 11,
      },
    ],
  },
  {
    id: 12,
    label: "Vehiculos",
    icon: "mdi mdi-car-outline",
    role: ["ADMIN","ASIS_FINANCIERO"],
    link: "/vehiculo/listar"
  }
];


export const MENU_USER: MenuItem[] = [
  {
    id: 1,
    label: 'MENU PRINCIPAL',
    isTitle: true,
  },
  {
    id: 2,
    label: 'Inicio',
    icon: 'bx-home-circle',
    link: '/dashboard',
  },
  {
    id: 3,
    label: 'MODULOS',
    isTitle: true
  },


  {
    id: 7,
    label: "Solicitud Vehículo",
    icon: "mdi mdi-car-outline",
    role: ["ADMIN", "USER","JEFE_DEPTO","SECR_DECANATO","DECANO","ASIS_FINANCIERO","JEFE_FINANACIERO"],
    subItems: [


      {
        id: 10,
        label: "Mis solicitudes",
        link: "/solicitud-vehiculo/mis-solicitudes",
        role: ["ADMIN", "USER","JEFE_DEPTO","SECR_DECANATO","DECANO","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 7,
      },
    ],
  },

];

export const MENU_JEFE_DEPTO: MenuItem[] = [
  {
    id: 1,
    label: 'MENU PRINCIPAL',
    isTitle: true,
  },
  {
    id: 2,
    label: 'Inicio',
    icon: 'bx-home-circle',
    link: '/dashboard',
  },
  {
    id: 3,
    label: 'MODULOS',
    isTitle: true
  },


  {
    id: 7,
    label: "Solicitud Vehículo",
    icon: "mdi mdi-car-outline",
    role: ["ADMIN", "USER","JEFE_DEPTO","SECR_DECANATO","DECANO","ASIS_FINANCIERO","JEFE_FINANACIERO"],
    subItems: [

      {
        id: 8,
        label: "Listado",
        link: "/solicitud-vehiculo/listado",
        role: ["ADMIN","JEFE_DEPTO","SECR_DECANATO","DECANO"],
        parentId: 7,
      },
      {
        id: 10,
        label: "Mis solicitudes",
        link: "/solicitud-vehiculo/mis-solicitudes",
        role: ["ADMIN", "USER","JEFE_DEPTO","SECR_DECANATO","DECANO","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 7,
      },
    ],
  },

];

export const MENU_ASIS_FINAN: MenuItem[] = [
  {
    id: 1,
    label: 'MENU PRINCIPAL',
    isTitle: true,
  },
  {
    id: 2,
    label: 'Inicio',
    icon: 'bx-home-circle',
    link: '/dashboard',
  },
  {
    id: 3,
    label: 'MODULOS',
    isTitle: true
  },


  {
    id: 7,
    label: "Solicitud Vehículo",
    icon: "mdi mdi-car-outline",
    role: ["ADMIN", "USER","JEFE_DEPTO","SECR_DECANATO","DECANO","ASIS_FINANCIERO","JEFE_FINANACIERO"],
    subItems: [


      {
        id: 10,
        label: "Mis solicitudes",
        link: "/solicitud-vehiculo/mis-solicitudes",
        role: ["ADMIN", "USER","JEFE_DEPTO","SECR_DECANATO","DECANO","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 7,
      },
    ],
  },
  {
    id: 9,
    label: "Solcitudes de Vales",
    icon: "mdi mdi-gas-station",
    role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
    subItems: [


      {
        id: 11,
        label: "Mis Solicitudes",
        link: "/solicitudes/solicitudvale",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 9,
      },
    ],
  },
  {
    id: 8,
    label: "Vales",
    icon: "mdi mdi-gas-station",
    role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
    subItems: [
      {
        id: 9,
        label: "Proveedor",
        link: "/proveedor",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 8,
      },
      {
        id: 10,
        label: "Compras",
        link: "/compra",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 8,
      },
    

    ],
  },


  {
    id: 11,
    label: "Reportes",
    icon: "mdi mdi-file-document-outline",
    role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
    subItems: [
      {
        id: 12,
        label: "Consumo de Vales",
        link: "/solicitudes/solicitudv",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 11,
      },
      {
        id: 13,
        label: "Solicitud de Transporte",
        link: "/solicitudes/solicitante",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 11,
      },
    ],
  },
  {
    id: 12,
    label: "Vehiculos",
    icon: "mdi mdi-car-outline",
    role: ["ADMIN","ASIS_FINANCIERO"],
    link: "/vehiculo/listar"
  }
];

export const MENU_JEFE_FINAN: MenuItem[] = [
  {
    id: 1,
    label: 'MENU PRINCIPAL',
    isTitle: true,
  },
  {
    id: 2,
    label: 'Inicio',
    icon: 'bx-home-circle',
    link: '/dashboard',
  },
  {
    id: 3,
    label: 'MODULOS',
    isTitle: true
  },


  {
    id: 7,
    label: "Solicitud Vehículo",
    icon: "mdi mdi-car-outline",
    role: ["ADMIN", "USER","JEFE_DEPTO","SECR_DECANATO","DECANO","ASIS_FINANCIERO","JEFE_FINANACIERO"],
    subItems: [


      {
        id: 10,
        label: "Mis solicitudes",
        link: "/solicitud-vehiculo/mis-solicitudes",
        role: ["ADMIN", "USER","JEFE_DEPTO","SECR_DECANATO","DECANO","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 7,
      },
    ],
  },
  {
    id: 9,
    label: "Solcitudes de Vales",
    icon: "mdi mdi-gas-station",
    role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
    subItems: [

      {
        id: 10,
        label: "Por Aprobar",
        link: "/solicitudes/solictud-aprobar",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 9,
      },

    ],
  },
  {
    id: 8,
    label: "Vales",
    icon: "mdi mdi-gas-station",
    role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
    subItems: [

      {
        id: 111,
        label: "Ajustes de Vales",
        link: "/devolucion-vale",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 8,
      },

    ],
  },


  {
    id: 11,
    label: "Reportes",
    icon: "mdi mdi-file-document-outline",
    role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
    subItems: [
      {
        id: 12,
        label: "Consumo de Vales",
        link: "/solicitudes/solicitudv",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 11,
      },
      {
        id: 13,
        label: "Solicitud de Transporte",
        link: "/solicitudes/solicitante",
        role: ["ADMIN","ASIS_FINANCIERO","JEFE_FINANACIERO"],
        parentId: 11,
      },
    ],
  },

];

export const MENU_VIGILANTE: MenuItem[] = [
  {
    id: 1,
    label: 'MENU PRINCIPAL',
    isTitle: true,
  },
  {
    id: 2,
    label: 'Inicio',
    icon: 'bx-home-circle',
    link: '/dashboard',
  },
  {
    id: 3,
    label: 'MODULOS',
    isTitle: true
  },


  {
    id: 10,
    label: "Entradas y Salidas",
    icon: "dripicons-document-edit",
    role: ["ADMIN","VIGILANTE"],
    subItems: [
      {
        id: 11,
        label: "Listado",
        link: "/entrasalida/listar",
        role: ["ADMIN","VIGILANTE"],
        parent: 10,
      },
      {
        id: 12,
        label: "Documento",
        link: "/document/vale",
        role: ["ADMIN","VIGILANTE"],
        parent: 10,
      },
    ],
  },





];

