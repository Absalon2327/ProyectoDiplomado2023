import { ICargo, IDepto, IEmpleado } from "src/app/modules/empleado/interface/empleado.interface";

export class Usuario {
  constructor(
    public codigoUsuario: string,
    public nombre: string,
    public clave?: string, // no necesariamente se tendra el pss aqui
    public nuevo?: string,
    public role?: string,
    public token?: string,
    public empleado?: IEmpleado,
  ) {}
}

export class DataCards {
  constructor(
    public vales: string,
    public misiones: string,
    public misioneshoy: string,
    public misionesmes: string,
    public motoristas: string,
  ) {}
}


export class Empleado{
  constructor(
    public codigoEmpleado: string,
    public dui: string,
    public nombre: string,
    public apellido: string,
    public telefono: string,
    public licencia: string,
    public tipolicencia: string,
    public fechalicencia: Date,
    public estado: number,
    public jefe: boolean,
    public correo: string,
    public nombrefoto: string,
    public urlfoto: string,
    public cargo: ICargo,
    public departamento: IDepto
  ){}
}
