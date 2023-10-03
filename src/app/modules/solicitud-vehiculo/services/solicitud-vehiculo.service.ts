import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {
  IActualizarSoliVe,
  IEstados,
  IPais,
  ISolicitudVehiculo,
  IMotorista,
  ILogSoliVe
} from "../interfaces/data.interface";
import {environment} from "../../../../environments/environment";
import {map} from "rxjs/operators";
import {IVehiculos} from "../../vehiculo/interfaces/vehiculo-interface";
import {Usuario} from "../../../account/auth/models/usuario.models";
import {ISolicitudvalep} from "../../solicitud-vale-paginacion/interface/solicitudvalep.interface";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class SolicitudVehiculoService {

  private url= environment.baseUrl;

  listSoliVehiculo : ISolicitudVehiculo [] = [];
  listSoliVehiculoRol : ISolicitudVehiculo [] = [];
  listVehiculos:string[] = [];
  listMotorista: IMotorista [] = [];
  listLogSoliVe: ILogSoliVe [] = [];
  public usuario!: Usuario;

  constructor(private http: HttpClient) { }

  get codUsuario(): string {
    return localStorage.getItem("codUsuario" || "");
  }

  getUsuarioSV(): Observable<Usuario> {
    return this.http
      .get(`${this.url}/usuario/${this.codUsuario}`)
      .pipe(
        map((usuario: any) => {
          const { codigoUsuario, nombre, nuevo, role, token, empleado } = usuario;
          return new Usuario(codigoUsuario, nombre, "", nuevo, role, token, empleado);
        })
      );
  }


  // Servicio para obtener todas las solicitudes de vehiculo

  /*getSolicitudesVehiculo(estado: number) {
    if (estado != null){
      this.http
        .get(`${this.url}/solicitudvehiculo/lista/${estado}`)
        .pipe(map((resp: any) => resp as ISolicitudVehiculo[]))
        .subscribe(
          (soliVe: ISolicitudVehiculo[]) => {
            this.listSoliVehiculo = soliVe;
          },
          (error) => {
            console.log("Error al obtener las solicitudes de vehiculo", error);
          }
        );
    }else {
      this.http
        .get(`${this.url}/solicitudvehiculo/lista`)
        .pipe(map((resp: any) => resp as ISolicitudVehiculo[]))
        .subscribe(
          (soliVe: ISolicitudVehiculo[]) => {
            this.listSoliVehiculo = soliVe;
          },
          (error) => {
            console.log("Error al obtener las solicitudes de vehiculo", error);
          }
        );
    }
  }*/

  getSolicitudesVehiculo(estado: number): Promise<ISolicitudVehiculo[]> {
    // Mostrar la alerta de Swal antes de realizar la solicitud
    Swal.fire({
      title: 'Espere un momento!',
      html: 'Se está procesando la información...',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    let requestUrl = `${this.url}/solicitudvehiculo/lista`;
    if (estado != null) {
      requestUrl = `${this.url}/solicitudvehiculo/lista/${estado}`;
    }

    return this.http
      .get(requestUrl)
      .pipe(map((resp: any) => resp as ISolicitudVehiculo[]))
      .toPromise() // Convertir el observable en una Promesa
      .then((soliVe: ISolicitudVehiculo[]) => {
        // Cierra la alerta de Swal cuando se obtienen las solicitudes
        Swal.close();
        this.listSoliVehiculo = soliVe;
        return this.listSoliVehiculo; // Devuelve las solicitudes como resultado de la Promesa
      })
      .catch((error) => {
        // Cierra la alerta de Swal en caso de error y lanza el error
        Swal.close();
        console.error('Error al obtener las solicitudes de vehículo', error);
        throw error; // Lanza el error para que el componente lo maneje
      });
  }

  // Servicio para obtener los estados
  public obtenerEstados(): Observable<any> {
    return this.http.get<IEstados>((this.url)+ '/solicitudvehiculo/estados');
  }

  obtenerVehiculos() {
    this.http
      .get(`${this.url}/vehiculo/clase`)
      .pipe(map((resp: any) => resp ))
      .subscribe(
        (vehiculo)=> {
          this.listVehiculos = vehiculo;
          console.log(this.listVehiculos);
        },
        (error) => {
          console.log("Error al obtener los vehiculos", error);
          }
        );
  }

  obtenerMotoristas() {
    this.http
      .get(`${this.url}/empleado/motoristas`)
      .pipe(map((resp: any) => resp as IMotorista[]))
      .subscribe(
        (empleados: IMotorista[]) => {
          console.log(empleados);
          this.listMotorista = empleados; // Actualiza la propiedad listEmpleados
        },
        (error) => {
          console.error("Error al obtener los empleados:", error);
        }
      );
    }

  filtroPlacasVehiculo(clase: string,fechaSalida:string,fechaEntrada:string): Observable<IVehiculos[]> {
    return this.http
      .get(`${this.url}/vehiculo/disponibilidad?claseName=${clase}&fechaSalida=${fechaSalida}&fechaEntrada=${fechaEntrada}`)
      .pipe(map((resp: any) => resp as IVehiculos[]));
  }


  public getDepa(): Observable<IPais[]>{
    return this.http.get<IPais[]>("assets/pais/ubicacionPaisSV2023.json");
  }


  registrarSoliVe(solicitudVehiculo: ISolicitudVehiculo){
    return this.http.post<ISolicitudVehiculo>( `${this.url}/solicitudvehiculo/insert`, solicitudVehiculo);
  }

  enviarPdfPasajeros(multiPart: FormData){
    console.log("docus:", multiPart);
    return this.http.post<any>(`${this.url}/documentosoli/upload`, multiPart);
  }

  updateSolicitudVehiculo(data: ISolicitudVehiculo){
    return this.http.put<ISolicitudVehiculo>( `${this.url}/solicitudvehiculo/edit/${data.codigoSolicitudVehiculo}`, data);
  }

  /*getSolicitudesRol(rol: string){
    this.http
        .get(`${this.url}/solicitudvehiculo/listado/${rol}`)
        .pipe(map((resp: any) => resp as ISolicitudVehiculo[]))
        .subscribe(
          (soliVe: ISolicitudVehiculo[]) => {
            this.listSoliVehiculoRol = soliVe;
          },
          (error) => {
            console.log("Error al obtener las solicitudes de vehiculo", error);
          }
        );
  }*/

  getSolicitudesRol(rol: string): Promise<ISolicitudVehiculo[]> {
    // Mostrar la alerta de Swal antes de realizar la solicitud
    Swal.fire({
      title: 'Espere un momento!',
      html: 'Se está procesando la información...',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    return this.http
      .get(`${this.url}/solicitudvehiculo/listado/${rol}`)
      .pipe(map((resp: any) => resp as ISolicitudVehiculo[]))
      .toPromise() // Convertir el observable en una Promesa
      .then((soliVe: ISolicitudVehiculo[]) => {
        // Cierra la alerta de Swal cuando se obtienen las solicitudes
        Swal.close();
        this.listSoliVehiculoRol = soliVe;
        return this.listSoliVehiculoRol; // Devuelve las solicitudes como resultado de la Promesa
      })
      .catch((error) => {
        // Cierra la alerta de Swal en caso de error y lanza el error
        Swal.close();
        console.error('Error al obtener las solicitudes de vehículo', error);
        throw error; // Lanza el error para que el componente lo maneje
      });
  }

  updateSolciitudVehiculo(data: IActualizarSoliVe){
    console.log("dataAc: ", data);
    return this.http.put<ISolicitudVehiculo>( `${this.url}/solicitudvehiculo/estadoupdate`, data);
  }

  registrarSolicitudVale(solicitudVale: ISolicitudvalep){
    console.log("vale",solicitudVale);
    return this.http.post<ISolicitudvalep>( `${this.url}/solicitudvale/insertar`, solicitudVale);
  }

  public obtenerDocumentPdf(nameDocu): Observable<Blob> {
    return this.http.get(`${this.url}/documentosoli/document/${nameDocu}`,
    {responseType: 'blob'});
  }

  modificarPdfPasajeros(multiPart: FormData){
    console.log("docus:", multiPart);
    return this.http.post<any>(`${this.url}/documentosoli/edit`, multiPart);
  }

  getLogSoli(codigoSoliVe: string): Promise<ILogSoliVe[]> {
    // Mostrar la alerta de Swal antes de realizar la solicitud
    Swal.fire({
      title: 'Espere un momento!',
      html: 'Se está procesando la información...',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    return this.http
      .get(`${this.url}/solicitudvehiculo/log/${codigoSoliVe}`)
      .pipe(map((resp: any) => resp as ILogSoliVe[]))
      .toPromise() // Convertir el observable en una Promesa
      .then((log: ILogSoliVe[]) => {
        // Cierra la alerta de Swal cuando se obtienen las solicitudes
        Swal.close();
        this.listLogSoliVe = log;
        return this.listLogSoliVe; // Devuelve las solicitudes como resultado de la Promesa
      })
      .catch((error) => {
        // Cierra la alerta de Swal en caso de error y lanza el error
        Swal.close();
        console.error('Error al obtener el log de la solicitud', error);
        throw error; // Lanza el error para que el componente lo maneje
      });
  }

}
