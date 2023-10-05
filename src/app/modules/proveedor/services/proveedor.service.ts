import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { IProveedor } from "../interfaces/proveedor.interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProveedorService {
  private baseUrl: string = environment.baseUrl;
  listProveedor: IProveedor[] = [];

  constructor(private http: HttpClient) {}

  getProveedorsPaginacion() {
    this.http
      .get(`${this.baseUrl}/proveedor/lista`)
      .pipe(map((resp: any) => resp.content as IProveedor[]))
      .subscribe((proveedor: IProveedor[]) => {
        this.listProveedor = proveedor;
      });
  }

  getProveedors() {
    this.http
      .get(`${this.baseUrl}/proveedor/listasinpagina`)
      .pipe(map((resp: any) => resp as IProveedor[]))
      .subscribe((proveedor: IProveedor[]) => {
        this.listProveedor = proveedor;
      });
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
