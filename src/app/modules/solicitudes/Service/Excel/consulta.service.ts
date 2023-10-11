import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompraDto, Consulta, ConsultaDto, Decano, DocumetSoliC, DocumetVale, DocumetValeId, IConsultaDelAl, IdVale, LogSoliVehi, LogSoliVehiID, LogVale, UsuarioDto } from '../../Interfaces/CompraVale/Consulta';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IConsultaExcelTabla, IConsultaExcelTablaC, IConsultaExcelTablaCompraDto, IConsultaExcelTablaDto, ITablaConsulta, ITablaConsultaC, ITablaConsultaCompraDto, ITablaConsultaDto } from '../../Interfaces/CompraVale/excel';
import { ICompra } from 'src/app/modules/compra/interfaces/compra.interface';
import { environment } from "src/environments/environment";
import { IVale } from 'src/app/modules/devolucion-vale/interfaces/vale.interface';
import { Vale } from '../../Interfaces/CompraVale/Vale';
import { Compra } from '../../Interfaces/CompraVale/Compra';
import { ISolicitudVehiculo } from 'src/app/modules/solicitud-vehiculo/interfaces/data.interface';
import { Usuario, Empleado } from 'src/app/account/auth/models/usuario.models';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  listCompra: ICompra[] = [];
  listVales: IConsultaDelAl[] =  [];
  private urlbase= environment.baseUrl;
  storage: Storage = window.localStorage;
  public empleado!: Empleado;
  vale: IConsultaDelAl[] = [];

  constructor(private http:HttpClient) { }
  //url = 'http://localhost:8080/api/consulta'
  //private baseUrl: string = environment.baseUrl;
  getCliente(){
    return this.http.get<Consulta>(this.urlbase+'/consulta/listaconsulta');
  }

  getConsultaValeDto(fechaI:Date, fechaF:Date){
    return this.http.get<Consulta>(this.urlbase+'/consulta/listarconsultadto?fechaI='+fechaI+'&fechaF='+fechaF);
  }

  getConsultaCompraValeDto(fechaI:Date, fechaF:Date){
    return this.http.get<Consulta>(this.urlbase+'/consulta/listarcompradto?fechaI='+fechaI+'&fechaF='+fechaF);
  }

  getConsultaValeGDto(fechaI:Date, fechaF:Date): Observable<IConsultaExcelTablaDto>{
    return this.http.get<ConsultaDto[]>(this.urlbase+'/consulta/listarconsultadto?fechaI='+fechaI+'&fechaF='+fechaF)
     .pipe(map((resp)=> {
      resp.length = 2000;
      const dataExcel: IConsultaExcelTablaDto ={
        tablaConsultaConsulta: this.getConsultaTablaConsulta(resp)
      };
      return dataExcel;
     })
     );
  }
  private getConsultaTablaConsulta(response: ConsultaDto[]): ITablaConsultaDto[]{
    return response.map((item:ConsultaDto) =>({
      valor:item.valor,
      fecha:item.fecha,
      correlativo:item.correlativo,
      estadosv:item.estadosv,
      estadoentrada:item.estadoentrada,
      estadoav:item.estadoav,
      cantidadvale:item.cantidadvale,
      estadovale:item.estadovale,
      fechavencimiento:item.fechavencimiento,
      iddetalleasignacionvale:item.iddetalleasignacionvale,
      idasignacionvale:item.idasignacionvale,
      valeid:item.valeid,
      solicitudvehiculoid:item.solicitudvehiculoid,
    }));
  }

  getConsultaCompraValeGDto(fechaI:Date, fechaF:Date): Observable<IConsultaExcelTablaCompraDto>{
    return this.http.get<CompraDto[]>(this.urlbase+'/consulta/listarcompradto?fechaI='+fechaI+'&fechaF='+fechaF)
    .pipe(map((resp)=> {
     resp.length = 2000;
     const dataExcel: IConsultaExcelTablaCompraDto ={
       tablaConsultaCompra: this.getConsultaTablaCompra(resp)
     };
     return dataExcel;
    })
    );
  }

  private getConsultaTablaCompra(response: CompraDto[]): ITablaConsultaCompraDto[]{
    return response.map((item:CompraDto) =>({
      cantidad:item.cantidad,
    codigofin:item.codigofin,
    fechacompra:item.fechacompra,
    codigocompra:item.codigocompra,
    preciounitario:item.preciounitario,
    codigoinicio:item.codigoinicio,
    fechavencimientovale:item.fechavencimientovale,
    }));
  }
  getCompras() {
    this.http
      .get(`${this.urlbase}/compra/listasinpagina`)
      .pipe(map((resp: any) => resp as ICompra[]))
      .subscribe((compras: ICompra[]) => {
        this.listCompra = compras;
      });
  }
  getCompraC(): Observable<IConsultaExcelTablaC>{
     return this.http.get<Compra[]>(this.urlbase+'/compra/listasinpagina?orderBy=fecha_compra:asc')
     .pipe(map((resp)=> {
      resp.length = 2000;
      const dataExcel: IConsultaExcelTablaC ={
        tablaConsultaC: this.getConsultaTablaC(resp)
      };
      return dataExcel;
     })
     );
  }
  private getConsultaTablaC(response: Compra[]): ITablaConsultaC[]{
    return response.map((item:Compra) =>({
      id:item.id,
      cantidad:item.cantidad,
      codInicio:item.codInicio,
      codFin:item.codFin,
      fechaCompra:item.fechaCompra,
      fechaVencimiento:item.fechaVencimiento,
      precioUnitario:item.precioUnitario
    }));
  }

  getConsultaExporExcel(): Observable<IConsultaExcelTabla>{
    return this.http.get<Consulta[]>(this.urlbase+'/consulta/listaconsulta')
    .pipe(map((resp) => {
    resp.length = 2000;
    //console.log(resp);
    const dataExcel: IConsultaExcelTabla ={
      tablaConsulta: this.getConsultaTabla(resp)
       };
      return dataExcel;
      })
    );
  }

  private getConsultaTabla(response: Consulta[]): ITablaConsulta[]{
    return response.map((item:Consulta) =>({
      codigoVale: item.vale.correlativo,
      entradasCant:item.vale.compra.cantidad,
      entradasPU:item.vale.compra.precioUnitario,
      entradasTotal:item.estado,
      solidasCant:item.solicitudVale.cantidadVale,
      salidasPU:item.vale.compra.precioUnitario,
      salidadTotal:item.estado,
      ExistCant:item.solicitudVale.cantidadVale,
      ExistPU:item.vale.compra.precioUnitario,
      ExistTotal:item.estado,
      fecha:item.fecha,
      estado:item.vale.estado,
      fechacompra:item.vale.compra.fechaCompra,
      precio:item.vale.compra.precioUnitario,
      cantidad:item.vale.compra.cantidad,
      idcompra:item.vale.compra.id,
    }));
  }
  getSolicitudV(){
    return this.http.get<ISolicitudVehiculo[]>(this.urlbase+'/solicitudvehiculo/todas');
  }

  getConsultaSolicitudVDelAl(id:string){
    return this.http.get<IConsultaDelAl[]>(this.urlbase+'/consulta/listarvalesdelal/'+id);
  }

  async getConsultaSolicitudVDelAl1(id: string): Promise<number> {
    try {
      const compras = await this.http
        .get(`${this.urlbase}/consulta/listarvalesdelal/${id}`)
        .toPromise();
  
      const valor = (compras as Array<{}>).length;
      return valor;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  getConsultaDocumnetoSoliCa(id:string){
    return this.http.get<DocumetSoliC[]>(this.urlbase+'/consulta/listardocs/'+id);
  }
  getConsultaDocumnetoValeId(id:string){
    return this.http.get<DocumetValeId[]>(this.urlbase+'/consulta/listardocv/'+id);
  }
  getConsultaDocumnetoVale(id:string){
    return this.http.get<DocumetVale[]>(this.urlbase+'/consulta/listardocvid/'+id);
  }

  get codEmpleado(): string {
    return this.storage.getItem("codEmpleado" || "");
  }

  getEmpleado(): Observable<Empleado> {
    return this.http
      .get(`${this.urlbase}/empleado/${this.codEmpleado}`)
      .pipe(
        tap((empleado: any) => {
          const { codigoEmpleado, dui, nombre, apellido, telefono, licencia, tipolicencia, fechalicencia, estado, jefe, correo, nombrefoto, urlfoto, cargo, departamento } = empleado;
          const usuarioObj = new Empleado(codigoEmpleado, dui, nombre, apellido, telefono, licencia, tipolicencia, fechalicencia, estado, jefe, correo, nombrefoto, urlfoto, cargo, departamento);
         // console.log(usuarioObj);
          return usuarioObj;
        })
      );

  }

  public descargarDocumento(nombreDocumento): Observable<Blob> {
    return this.http.get(`${this.urlbase}/document/descarga/${nombreDocumento}`, 
    { responseType: 'blob' });
  }

  async getDecano(): Promise<string> {
    try {
      const compras = await this.http
        .get(`${this.urlbase}/consulta/decano`)
        .toPromise();
  
      const decanos = compras as Decano[];
      
      if (decanos.length > 0) {
        // Concatenar el nombre y apellido del primer Decano
        const primerDecano = decanos[0];
        const nombreApellido = `${primerDecano.nombre} ${primerDecano.apellido}`;
        return nombreApellido;
      } else {
        throw new Error('No se encontraron decanos.');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  getConsultaDecano(){
    return this.http.get<Decano[]>(this.urlbase+'/consulta/decano');
  }

  getLogSoliVehi(id:string){
    return this.http.get<LogSoliVehi[]>(this.urlbase+'/consulta/logsolivhe/'+id);
  }

  getLogSoliVehiID(id:string){
    return this.http.get<LogSoliVehiID[]>(this.urlbase+'/consulta/logsolivheid/'+id);
  }

  getCompraMovimientos(){
    return this.http.get<ICompra[]>(this.urlbase+'/compra/listasinpagina');
  }
  
  getLogVale(id:string){
    return this.http.get<LogVale[]>(this.urlbase+'/consulta/logvale/'+id);
  }

  getIdVale(id:string){
    return this.http.get<IdVale[]>(this.urlbase+'/consulta/idvale/'+id);
  }
  
  getIdCompraV(id:string){
    return this.http.get<ICompra>(this.urlbase+'/compra/lista/'+id);
  }

  getConsuUsuarioDto(fechaI:Date, fechaF:Date){
    return this.http.get<UsuarioDto[]>(this.urlbase+'/consulta/usuario?fechaI='+fechaI+'&fechaF='+fechaF);
  }
}
