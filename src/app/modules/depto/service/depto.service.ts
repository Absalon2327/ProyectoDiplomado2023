import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepto } from '../interface/depto';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeptoService {
 // url = 'http://localhost:8080/api/depto';
 private url= environment.baseUrl;

 lstDeptos : IDepto [] = [];
  constructor(private http : HttpClient) { }

  getDeptos(estado : number) : Observable<unknown[]> {

    return this.http.get<unknown[]>(`${this.url}/depto/listar/${estado}`);
  }

  getDeptosAll() : Observable<unknown[]> {

      return this.http.get<unknown[]>(`${this.url}/depto`);
  }

  getDeptosAll2():Promise<IDepto[]>{
    Swal.fire({
      title: 'Espere un momento!',
      html: 'Se está procesando la información...',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    return this.http
    .get(`${this.url}/depto`)
    .pipe(map((resp: any) => resp as IDepto[]))
    .toPromise() // Convertir el observable en una Promesa
    .then((depto: IDepto[]) => {
      // Cierra la alerta de Swal cuando se obtienen las solicitudes
      Swal.close();
      this.lstDeptos = depto;
      return this.lstDeptos; // Devuelve las solicitudes como resultado de la Promesa
    })
    .catch((error) => {
      // Cierra la alerta de Swal en caso de error y lanza el error
      Swal.close();
      console.error('Error al obtener las solicitudes de vehículo', error);
      throw error; // Lanza el error para que el componente lo maneje
    });
  }

  saveDepto(data : IDepto){
    //console.log(data.type)
    return this.http.post(`${this.url}/depto`,data);
  }

  getDeptobyId(code : any) {
    return this.http.get(`${this.url}/depto/${code}`);
  }

  editDepto(codigoDepto : string, data : IDepto){

    return this.http.put(`${this.url}/depto/${codigoDepto}`,data);
  }

  deleteCargo(code : any){
    return this.http.delete(`${this.url}/depto/${code}`);
  }

}
