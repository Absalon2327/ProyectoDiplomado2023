import {IVehiculos} from "../../vehiculo/interfaces/vehiculo-interface";

export interface ISolicitudVehiculo {
  codigoSolicitudVehiculo: string;
  fechaSolicitud: Date;
  fechaSalida: Date;
  unidadSolicitante: string;
  vehiculo: IVehiculos;
  objetivoMision: string;
  lugarMision: string;
  direccion: string;
  horaEntrada: Date;
  horaSalida: Date;
  cantidadPersonas: number;
  listaPasajeros: IPasajero[];
  solicitante:ISolicitante;
  nombreJefeDepto: string;
  fechaEntrada: Date;
  estado: number;
  estadoString: string;
  motorista: IMotorista;
  listDocumentos: IDocumento[];
  observaciones:string;
}

interface ISolicitante {
  codigoUsuario: string;
  clave: string;
  nombre: string;
  nuevo: boolean;
  empleado: IEmpleado;
}

interface IEmpleado {
  codigoEmpleado: string;
  dui: string;
  nombre: string;
  apellido: string;
  telefono: string;
  licencia: string;
  tipo_licencia: string;
  fecha_licencia: Date;
  estado: number;
  jefe: boolean;
  correo: string;
  nombrefoto: string;
  urlfoto: string;
  cargo: ICargo;
  departamento: IDepartamento;
}


interface ICargo {
  id: string;
  nombreCargo: string;
  descripcion: string;
  estado: number;
}

interface IDepartamento {
  codigoDepto ?: string;
  nombre :      string;
  descripcion : string;
  tipo :        string;
  estado :      number;
}

export interface IPasajero {
  id: string;
  nombrePasajero: string;
}

export interface IMotorista {
  codigoEmpleado: string,
    dui: string;
    nombre: string;
    apellido: string;
    telefono: string;
    licencia: string;
    tipolicencia: string;
    fechalicencia: Date;
    estado: number;
    jefe: boolean;
    correo: string;
    nombrefoto: string;
    urlfoto: string;
    cargo: ICargo;
    departamento: IDepartamento;
}

export interface IDocumento {
  codigoDocumento: string;
  nombreDocumento: string;
  urlDocumento:string;
  fecha:string;
  tipoDocumento:string;
  SolicitudVehiculo:string;
}

export interface IEstados {
  codigoEstado: number,
  nombreEstado: string
}

export interface IPais {
  codigo: string;
  nam: string;
  na2: string;
}

export interface IDocumentoSoliVe {
  nombreDocumento: String;
  urlDocumento: String;
  codigoSolicitudVehiculo: {
    codigoSolicitudVehiculo: String;
  }
}
export interface IActualizarSoliVe{
  codigoSolicitudVehiculo: string;
  estado: number;
}

export interface  ILogSoliVe {
    "idLogSoliVe": string,
    "estadoLogSolive": number,
    "estadoString": string,
    "fechaLogSoliVe": Date,//"2023-09-29 10:25:00"
    "actividad": string,
    "usuario": string,
    "cargo": string,
    "soliVe": string,
    "soliVale": string
}
