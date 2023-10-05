import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ICompra } from "../interfaces/compra.interface";
import { Observable } from "rxjs";
import { IProveedor } from "../../proveedor/interfaces/proveedor.interface";
import { IVale } from "../../devolucion-vale/interfaces/vale.interface";

@Injectable({
  providedIn: "root",
})
export class CompraService {
  private baseUrl: string = environment.baseUrl;
  listCompra: ICompra[] = [];
  listProveedor: IProveedor[] = [];

  constructor(private http: HttpClient) {}

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
    this.http
      .get(`${this.baseUrl}/compra/listasinpagina`)
      .pipe(map((resp: any) => resp as ICompra[]))
      .subscribe((compras: ICompra[]) => {
        this.listCompra = compras;
      });
  }

  getProveedor() {
    this.http
      .get(`${this.baseUrl}/proveedor/listasinpagina`)
      .pipe(map((resp: any) => resp as IProveedor[]))
      .subscribe((proveedor: IProveedor[]) => {
        this.listProveedor = proveedor;
      });
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
