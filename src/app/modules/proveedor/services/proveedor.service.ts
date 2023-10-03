import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { IProveedor } from "../interfaces/proveedor.interface";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { MensajesService } from "src/app/shared/global/mensajes.service";

@Injectable({
  providedIn: "root",
})
export class ProveedorService {
  private baseUrl: string = environment.baseUrl;
  listProveedor: IProveedor[] = [];

  constructor(
    private http: HttpClient,
    private mensajesService: MensajesService
  ) {}

  getProveedorsPaginacion() {
    this.http
      .get(`${this.baseUrl}/proveedor/lista`)
      .pipe(map((resp: any) => resp.content as IProveedor[]))
      .subscribe((proveedor: IProveedor[]) => {
        this.listProveedor = proveedor;
      });
  }

  getProveedors() {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere",
      text: "Realizando la acción...",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
    });

    this.http
      .get(`${this.baseUrl}/proveedor/listasinpagina`)
      .pipe(map((resp: any) => resp as IProveedor[]))
      .subscribe(
        (proveedor: IProveedor[]) => {
          // Cerrar la alerta de carga específica
          loadingAlert.close();

          // Asignar los proveedores a la lista
          this.listProveedor = proveedor;
        },
        (error) => {
          // Cerrar la alerta de carga específica en caso de error
          loadingAlert.close();

          // Mostrar mensaje de error
          this.mensajesService.mensajesSweet(
            "error",
            "Ups... Algo salió mal",
            "Error al cargar los proveedores"
          );
        }
      );
  }

  getProveedorsById(id: string) {
    if (id != "") {
      return this.http
        .get(`${this.baseUrl}/proveedor/lista/${id}`)
        .pipe(map((resp: any) => resp as IProveedor));
    } else {
      return this.http
        .get(`${this.baseUrl}/proveedor/lista`)
        .pipe(map((resp: any) => resp as IProveedor));
    }
  }

  guardar(proveedor: IProveedor) {
    return this.http.post(`${this.baseUrl}/proveedor/insertar`, proveedor);
  }

  modificar(proveedor: IProveedor): any {
    return this.http.put(
      `${this.baseUrl}/proveedor/editar/${proveedor.id}`,
      proveedor
    );
  }

  borrar(dat: IProveedor): Observable<IProveedor> {
    return this.http.delete<IProveedor>(
      `${this.baseUrl}/proveedor/eliminar/${dat.id}`
    );
  }
}
