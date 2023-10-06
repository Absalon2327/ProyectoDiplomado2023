import { Injectable } from '@angular/core';
import { ISolicitudVehiculo } from '../../solicitud-vehiculo/interfaces/data.interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private urlbase= environment.baseUrl;
  private url= environment.baseUrl;
  listSoliVehiculo : ISolicitudVehiculo [] = [];


  listSoliVehiculo2 : ISolicitudVehiculo [] = [];
  listSoliVehiculo3 : ISolicitudVehiculo [] = [];
  listSoliVehiculoRol : ISolicitudVehiculo [] = [];



  constructor(private http:HttpClient) { }

  getSolicitudV(){
    return this.http.get<ISolicitudVehiculo[]>(this.urlbase+'/solicitudvehiculo/todas');
  }

  getSolicitudesVehiculo1(estado: number): Promise<ISolicitudVehiculo[]> {
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

  getSolicitudesVehiculo2(estado: number): Promise<ISolicitudVehiculo[]> {
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
        this.listSoliVehiculo2 = soliVe;
        return this.listSoliVehiculo2; // Devuelve las solicitudes como resultado de la Promesa
      })
      .catch((error) => {
        // Cierra la alerta de Swal en caso de error y lanza el error
        Swal.close();
        console.error('Error al obtener las solicitudes de vehículo', error);
        throw error; // Lanza el error para que el componente lo maneje
      });
  }

  getSolicitudesVehiculo3(estado: number): Promise<ISolicitudVehiculo[]> {
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
        this.listSoliVehiculo3 = soliVe;
        return this.listSoliVehiculo3; // Devuelve las solicitudes como resultado de la Promesa
      })
      .catch((error) => {
        // Cierra la alerta de Swal en caso de error y lanza el error
        Swal.close();
        console.error('Error al obtener las solicitudes de vehículo', error);
        throw error; // Lanza el error para que el componente lo maneje
      });
  }

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
}
