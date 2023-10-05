import { SolicitudVale } from "./SolicitudVale";
import { Vale } from "./Vale";

export interface Consulta{
    idDetalleAsignacionVale:string;
    asignacionVale:string;
    valeid:String;
    vale:Vale;
    estado:number;
    fecha:Date;
    solicitudVale:SolicitudVale;
}

export interface CompraDto{
    cantidad:number;
    codigofin:number;
    fechacompra:Date;
    codigocompra:String;
    preciounitario:number;
    codigoinicio:number;
    fechavencimientovale:Date;
}

export interface ConsultaDto{
    fecha:Date;
    valor:number;
    correlativo:number;
    valeid:String;
    idasignacionvale:String;
    fechavencimiento:Date;
    iddetalleasignacionvale:String;
    solicitudvehiculoid:string;
    estadovale:number;
    cantidadvale:number;
    estadoentrada:number;
    estadosv:number;
    estadoav:number;
}

export interface ValidarVale{
    inde:number;
    cantidad:number;
    valor:number;
    valorAntes:number;
    idA:String;
    con:number;
    conv:number;
}

export interface Cantidad{
    cant:number;
    veri:number;
    conta:number;
}

export interface IConsultaDelAl{
    correlativo:number;
    valor:number;
    valeid:string;
    estadovale:number;
    cantidadvale:number;
    fechavencimiento:Date;
}

export interface Tabla{
    id:string;
    i:number;
    codi:number;
    val:number;
}

export interface In{
    idn:Date;
    in:number;
    vall:number;
}

export interface DocumetVale{
    url:string;
    codigodocumentos:string;
    fecha:Date;
    foto:string;
    tipo:string;
    comprobante:string;
    idsolicitudvale:string;
}

export interface DocumetValeId{
    idsolicitudvale:string;
    estado:number;
}
export interface DocumetSoliC{
    fecha:Date;
    codigodocumento:string;
    nombredocment:string;
    urldocument:string;
    codigosolicitudvehiculo:string;
    tipodocument:string;
}

export interface Decano{  
    nombre:string;
    apellido:string;
}

export interface LogSoliVehi{  
    actividad:string;
    estadosolive:number;
    fechalogsolive:Date;
    usuario:string;
}

export interface LogVale{  
    idlogvale:string;
    actividad:string;
    estadovale:number;
    fechalogvale:Date;
    idvale:string;
    usuario:string;
}

export interface IdCompra{  
    codigocompra:string;
}
export interface IdVale{  
    idvale:string;
    correlativo:number;
    estado:number;
    fechavencimiento:Date;
    valor:number;
    codigocompra:string;
}