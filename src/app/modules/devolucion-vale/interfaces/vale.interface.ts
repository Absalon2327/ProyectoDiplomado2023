import { ICompra } from "../../compra/interfaces/compra.interface";
import { IEmpleado } from "../../empleado/interface/empleado.interface";

export interface IVale {
  id:                 string;
  valor:              number;
  compra:             ICompra;
  fechaVencimiento:   string;
  correlativo:        number;
  estado:             number;
}

export interface IUsuarioMandarDto {
  nombre: string;
  clave: string;
}

export interface IUsuarioRespuestaDto {
  codigoUsuario: string;
  empleado: IEmpleado;
}
