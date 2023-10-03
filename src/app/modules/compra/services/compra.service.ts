import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ICompra } from "../interfaces/compra.interface";
import { Observable } from "rxjs";
import { IProveedor } from "../../proveedor/interfaces/proveedor.interface";
import { IVale } from "../../devolucion-vale/interfaces/vale.interface";
import Swal from "sweetalert2";
import { MensajesService } from "src/app/shared/global/mensajes.service";

@Injectable({
  providedIn: "root",
})
export class CompraService {
  private baseUrl: string = environment.baseUrl;
  listCompra: ICompra[] = [];
  listProveedor: IProveedor[] = [];

  constructor(
    private http: HttpClient,
    private mensajesService: MensajesService
  ) {}

  getComprasConPaginacion() {
    this.http
      .get(`${this.baseUrl}/compra/lista`)
      .pipe(map((resp: any) => resp.content as ICompra[]))
      .subscribe((compras: ICompra[]) => {
        this.listCompra = compras; // Actualiza la propiedad listCompra
      });
  }

  getValesPorCompra(idCompra: string): Observable<IVale[]> {
    return this.http
      .get(`${this.baseUrl}/vale/valesporcompra/${idCompra}`)
      .pipe(map((resp: any) => resp as IVale[]));
  }

  getCompras() {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;
    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere",
      text: "Cargando compras...",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
    });

    this.http
      .get(`${this.baseUrl}/compra/listasinpagina`)
      .pipe(map((resp: any) => resp as ICompra[]))
      .subscribe(
        (compras: ICompra[]) => {
          // Cerrar SweetAlert de carga
          loadingAlert.close();

          // Asignar las compras a la lista
          this.listCompra = compras;
        },
        (error) => {
          // Cerrar SweetAlert de carga en caso de error
          loadingAlert.close();

          // Manejar el error de alguna manera, como mostrar un mensaje de error
          this.mensajesService.mensajesSweet(
            "error",
            "Ups... Algo salió mal",
            "Error al cargar las compras"
          );
        }
      );
  }

  getProveedor() {
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
          // Cerrar SweetAlert de carga
          loadingAlert.close();

          // Asignar los proveedores a la lista
          this.listProveedor = proveedor;
        },
        (error) => {
          // Cerrar SweetAlert de carga en caso de error
          loadingAlert.close();

          // Manejar el error de alguna manera, como mostrar un mensaje de error
          this.mensajesService.mensajesSweet(
            "error",
            "Ups... Algo salió mal",
            "Error al cargar los proveedores"
          );
        }
      );
  }

  guardar(compra: ICompra, idusuariologueado: string) {
    const data = {
      compra: compra,
      idusuariologueado: idusuariologueado,
    };
    return this.http.post(`${this.baseUrl}/compra/insertar`, data);
  }

  modificar(compra: ICompra): any {
    return this.http.put(`${this.baseUrl}/compra/editar/${compra.id}`, compra);
  }

  borrar(dat: ICompra): Observable<ICompra> {
    return this.http.delete<ICompra>(
      `${this.baseUrl}/compra/eliminar/${dat.id}`
    );
  }
}
