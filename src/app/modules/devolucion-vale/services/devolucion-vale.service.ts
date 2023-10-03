import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IProveedor } from "../../proveedor/interfaces/proveedor.interface";
import { environment } from "src/environments/environment";
import { IUsuarioMandarDto, IVale } from "../interfaces/vale.interface";
import { MensajesService } from "src/app/shared/global/mensajes.service";
import { Observable } from "rxjs";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class DevolucionValeService {
  private baseUrl: string = environment.baseUrl;
  listProveedor: IProveedor[] = [];
  listVale: IVale[] = [];

  constructor(
    private http: HttpClient,
    private mensajesService: MensajesService
  ) {}

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
          this.mensajesService.mensajesSweet(
            "error",
            "Ups... Algo salió mal",
            "Error al cargar los proveedores"
          );
        }
      );
  }

  getValesPorCantidad(cantidad: number = 0): Promise<IVale[]> {
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

    return new Promise<IVale[]>((resolve, reject) => {
      if (cantidad != 0) {
        this.http
          .get(`${this.baseUrl}/vale/devolucioncantidad/${cantidad}`)
          .pipe(map((resp: any) => resp as IVale[]))
          .subscribe({
            next: (vale: IVale[]) => {
              loadingAlert.close();
              this.listVale = vale;
              resolve(vale); // Resuelve la promesa con los datos
            },
            error: (err) => {
              loadingAlert.close();
              this.mensajesService.mensajesSweet(
                "error",
                "Ups... Algo salió mal",
                err.error.message
              );
              reject(err);
            },
          });
      } else {
        loadingAlert.close();
        this.listVale = [];
        resolve([]);
      }
    });
  }

  getValesPorMonto(monto: number = 0): Promise<IVale[]> {
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

    return new Promise<IVale[]>((resolve, reject) => {
      if (monto != 0) {
        this.http
          .get(`${this.baseUrl}/vale/devolucionmonto/${monto}`)
          .pipe(map((resp: any) => resp as IVale[]))
          .subscribe({
            next: (vale: IVale[]) => {
              loadingAlert.close();

              if (vale.length === 0) {
                this.listVale = [];
                this.mensajesService.mensajesSweet(
                  "info",
                  "Posibles razones...",
                  "Es posible que no se tengan existencias de vales, que con el monto ingresado no se puedan obtener vales o que no haya vales disponibles (Activos)",
                  "Entiendo"
                );
              } else {
                this.listVale = vale;
              }

              resolve(vale); // Resuelve la promesa con los datos
            },
            error: (err) => {
              loadingAlert.close();
              this.mensajesService.mensajesSweet(
                "error",
                "Ups... Algo salió mal",
                err.error.message
              );
              reject(err);
            },
          });
      } else {
        loadingAlert.close();
        this.listVale = [];
        resolve([]);
      }
    });
  }

  modificar(vales: IVale[]): any {
    return this.http.put(`${this.baseUrl}/vale/actualizarValesCantidad`, vales);
  }

  modificarPorCantidad(
    vales: IVale[],
    concepto: string,
    idusuariologueado: string
  ): Observable<any> {
    const url = `${this.baseUrl}/vale/actualizarValesCantidad`;

    // Crea un objeto que coincide con la estructura de ActualizacionValesRequest
    const requestBody = {
      vales: vales,
      concepto: concepto,
      idusuariologueado: idusuariologueado,
    };

    // Realiza la solicitud HTTP con el objeto requestBody y configura el encabezado para JSON
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const options = { headers: headers };

    // Realiza la solicitud HTTP con el objeto modificado y devuelve un Observable
    return this.http.put(url, requestBody, options);
  }

  validarUsuario(usuarioMardarDto: IUsuarioMandarDto) {
    return this.http.post(
      `${this.baseUrl}/vale/validarusuario`,
      usuarioMardarDto
    );
  }
}
