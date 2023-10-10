import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepto } from '../interface/depto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeptoService {
 // url = 'http://localhost:8080/api/depto';
 private url= environment.baseUrl;

  constructor(private http : HttpClient) { }

  getDeptos(estado : number) : Observable<unknown[]> {

    return this.http.get<unknown[]>(`${this.url}/depto/listar/${estado}`);
  }

  getDeptosAll() : Observable<unknown[]> {

      return this.http.get<unknown[]>(`${this.url}/depto`);
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
