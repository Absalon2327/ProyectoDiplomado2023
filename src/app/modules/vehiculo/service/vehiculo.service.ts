import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IVehiculos } from "../interfaces/vehiculo-interface";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class VehiculoService {
  url = environment.baseUrl;
  listVehiclos:IVehiculos[]=[];

  constructor(private http: HttpClient) {}

  public gyetVehi(): Observable<IVehiculos[]> {
    return this.http
      .get<IVehiculos[]>(this.url + "/vehiculo/lista")
      .pipe(map((resp: any) => resp.content as IVehiculos[]));
  }

  getVehiculos() {
    this.http
      .get(`${this.url}/vehiculo/lista`)
      .pipe(map((resp: any) => resp.content as IVehiculos[]))
      .subscribe(
        (automovil: IVehiculos[]) => {
          this.listVehiclos = automovil; // Actualiza la propiedad listEmpleados
        },
        (error) => {
          console.error("Error al obtener las vehículos:", error);
        }
      );
  }

  public guardarVehiculo(part:FormData){
    return this.http.post(`${this.url}/vehiculo/insertar`, part);
  }

  public editarVehiculo(part:FormData){
    return this.http.put(`${this.url}/vehiculo/editar`, part);
  }

}
