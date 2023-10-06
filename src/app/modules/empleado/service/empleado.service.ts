import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICargo, IDepto, IEmpleado, IEmpleadoTabala } from '../interface/empleado.interface';
import { environment } from 'src/environments/environment';
import { map } from "rxjs/operators";
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private baseUrl: string = environment.baseUrl;

  listDepartamentos: IDepto[] = [];
  listEmpleados: IEmpleado[] = [];
  listCargos: ICargo[] = [];

  constructor(private http: HttpClient) { }

  //Obtener empleados para la tabla
  getEmpleados() {
      this.http
        .get(`${this.baseUrl}/empleado/lista`)
        .pipe(map((resp: any) => resp.content as IEmpleado[]))
        .subscribe(
          (empleados: IEmpleado[]) => {
            this.listEmpleados = empleados; // Actualiza la propiedad listEmpleados
            Swal.close();
          },
          (error) => {
            console.error("Error al obtener los empleados:", error);
            Swal.close();
          }
        );
  }

  getCargos() {
    this.http
      .get(`${this.baseUrl}/cargo`)
      .pipe(map((resp: any) => resp as ICargo[]))
      .subscribe(
        (cargos: ICargo[]) => {
          this.listCargos = cargos;
        },
        (error) => {
          console.error("Error al obtener los cargos:", error);
        }
      );
  }

  getDepartamentos() {
    this.http
      .get(`${this.baseUrl}/depto`)
      .pipe(map((resp: any) => resp as IDepto[]))
      .subscribe(
        (departamentos: IDepto[]) => {
          this.listDepartamentos = departamentos;
        },
        (error) => {
          console.error("Error al obtener los departamentos:", error);
        }
      );
  }

/*   getEstadoNombre(nombre: string): Observable<Object> {
    return this.http.get(`${this.baseUrl}/estados/PorID/${nombre}`);
  } */

  public postEmpleado(empleado: IEmpleado): Observable<Object> {
    return this.http.post(`${this.baseUrl}/empleado/insertar`, empleado);
  }

  public postEmpleadoImagen(empleado: IEmpleado, file: File): Observable<Object> {
    const formData: FormData = new FormData();
    formData.append('imagen', file);
    formData.append('empleado', JSON.stringify(empleado));
    return this.http.post(`${this.baseUrl}/empleado/insertarconImagen`, formData);
  }

  public putEmpleado(empleado: IEmpleado): any {
    return this.http.put(`${this.baseUrl}/empleado/editar/${empleado.codigoEmpleado}`, empleado);
  }

  public putEmpleadoImagen(empleado: IEmpleado, file: File): Observable<Object> {
    const formData: FormData = new FormData();
    formData.append('imagen', file);
    formData.append('empleado', JSON.stringify(empleado));
    return this.http.put(`${this.baseUrl}/empleado/editarconImagen/${empleado.codigoEmpleado}`, formData);
  }

}
