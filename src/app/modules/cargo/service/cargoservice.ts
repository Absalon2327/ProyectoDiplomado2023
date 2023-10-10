import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  private url= environment.baseUrl;

 // url = 'http://localhost:8080/api/cargo';

  constructor(private http : HttpClient) { }

  getCargos(estado : number) : Observable<unknown[]> {

    return this.http.get<unknown[]>(`${this.url}/cargo/listar/${estado}`);
  }

  getCargosAll(){
    return this.http.get<unknown[]>(`${this.url}/cargo`);
  }

  saveCargos(data : any){
    //console.log(data.type)
    return this.http.post(`${this.url}/cargo`,data);
  }

  getCargobyId(code : any) {
    return this.http.get(`${this.url}/cargo/${code}`);
  }

  editCargo(id: string, data : unknown){

    return this.http.put(`${this.url}/cargo/${id}`,data);
  }

  deleteCargo(code : any){
    return this.http.delete(`${this.url}/cargo/${code}`);
  }

}
