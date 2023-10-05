import { Injectable } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  IAsignacionDetalle,
  IValesADevolver,
  ILiquidacion,
  IAnularMision,
  IAsignacionValeSolicitud,
} from "../interfaces/asignacion.interface";
import { environment } from "src/environments/environment";

import { IDocumentosvale } from "../interface/IDocumentosvale";
import { BehaviorSubject, Observable, Subject, of, throwError } from "rxjs";
import Swal, { SweetAlertIcon } from "sweetalert2";
import {
  catchError,
  debounceTime,
  delay,
  map,
  switchMap,
  tap,
} from "rxjs/operators";
import { SolicitudVale } from "../interface/IsolicitudvaleDocument";
import {
  ISolcitudAprobar,
  ISolicitudValeAprobar,
  IValesAsignarPage,
  SearchResult,
} from "../../solicitudes/Interfaces/solicitudValeAprobar.interface";
import { SortDirection } from "src/app/pages/crypto/orders/orders-sortable.directive";

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}
/**
 * Sort the table data
 * @param vales Table field value
 * @param column Fetch the column
 * @param direction Sort direction Ascending or Descending
 */
function sort(
  vales: IValesAsignarPage[],
  column: string,
  direction: string
): IValesAsignarPage[] {
  if (direction === "") {
    return vales;
  } else {
    return [...vales].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === "asc" ? res : -res;
    });
  }
}
/**
 * Table Data Match with Search input
 * @param vales Table field value fetch
 * @param term Search the value
 */
function matches(vales: IValesAsignarPage, term: string) {
  return (
    vales.correlativoVale ||
    vales.fechaVencimiento ||
    vales.idVale ||
    vales.valorVale
  );
}

@Injectable({
  providedIn: "root",
})
export class DetalleService {


  // tslint:disable-next-line: variable-name
  private _loading$ = new BehaviorSubject<boolean>(true);
  // tslint:disable-next-line: variable-name
  private _search$ = new Subject<void>();
  // tslint:disable-next-line: variable-name
  private _vales$ = new BehaviorSubject<IValesAsignarPage[]>([]);
  // tslint:disable-next-line: variable-name
  private _total$ = new BehaviorSubject<number>(0);

  // tslint:disable-next-line: variable-name
  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: "",
    sortColumn: "",
    sortDirection: "",
    startIndex: 1,
    endIndex: 10,
    totalRecords: 0,
  };

  listDeMisiones: SolicitudVale[] = [];
  valesAsignar: IValesAsignarPage[] = [];
  private burl: string = environment.baseUrl;
  private baseUrl: string = environment.baseUrl;
  private requestOptions: any;

  constructor(
    private http: HttpClient,
  ) {
    /* // Recupera el token de acceso desde el local storage
    const token = localStorage.getItem("token");

    // Crea un objeto HttpHeaders para agregar el token de acceso en el encabezado 'Authorization'
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Configura las opciones de la solicitud HTTP con los encabezados personalizados
    this.requestOptions = {
      headers: headers,
    }; */

    /*************************************************************** */
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._vales$.next(result.vales);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  /**
   * Returns the value
   */
  get vales$() {
    return this._vales$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }
  get startIndex() {
    return this._state.startIndex;
  }
  get endIndex() {
    return this._state.endIndex;
  }
  get totalRecords() {
    return this._state.totalRecords;
  }

  /**
   * set the value
   */
  // tslint:disable-next-line: adjacent-overload-signatures
  set page(page: number) {
    this._set({ page });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  // tslint:disable-next-line: adjacent-overload-signatures
  set startIndex(startIndex: number) {
    this._set({ startIndex });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  set endIndex(endIndex: number) {
    this._set({ endIndex });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  set totalRecords(totalRecords: number) {
    this._set({ totalRecords });
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: string) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    // 1. sort
    let vales = sort(this.valesAsignar, sortColumn, sortDirection);

    // 2. filter
    vales = vales.filter((table) => matches(table, searchTerm));
    const total = vales.length;

    // 3. paginate
    this.totalRecords = vales.length;
    this._state.startIndex = (page - 1) * this.pageSize;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    vales = vales.slice(this._state.startIndex, this._state.endIndex);

    return of({ vales, total });
  }

  getValesAsignar(cantVales: number) {
    return this.http
      .get(`${this.baseUrl}/asignacionvale/listarvalesasignar/${cantVales}`)
      .pipe(map((resp: any) => resp as IValesAsignarPage[]))
      .subscribe((valesA: IValesAsignarPage[]) => {
        this.valesAsignar = valesA;
      });
  }
  getVales(cantVales: number): Observable<IValesAsignarPage[]> {
    return this.http.get<IValesAsignarPage[]>(
      `${this.baseUrl}/asignacionvale/listarvalesasignar/${cantVales}`
    );
  }

  getMisiones() {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const requestOptions = {
      headers: headers,
    };

    this.http
      .get(`${this.baseUrl}/solicitudvale/listasinpagina`, requestOptions)

      .pipe(map((resp: any) => resp as SolicitudVale[]))
      .subscribe(
        (lista: SolicitudVale[]) => {
          console.log(lista);
          this.listDeMisiones = lista;
          console.log(lista);
        },
        (error) => {
          console.error("Error al obtener las misiones:", error);
        }
      );
  }

  ObtenerLista(id: string) {
    return this.http.get<IDocumentosvale[]>(`${this.baseUrl}/document/${id}`);
  }

  public NuevosDatos(
    document: IDocumentosvale,
    file: File
  ): Observable<Object> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const requestOptions = {
      headers: headers,
    };
    const formData: FormData = new FormData();
    formData.append("imagen", file);
    formData.append("document", JSON.stringify(document));
    return this.http.post(
      `${this.burl}/document/insertar`,
      formData,
      requestOptions
    );
  }

  getDetalleAsignacionVale(codigoAsignacion: string) {
    return this.http.get<IAsignacionDetalle>(
      `${this.baseUrl}/asignacionvale/listar/${codigoAsignacion}`
    );
  }
  getAsignacionValeSolicitudVale(codigoAsignacion: string) {
    return this.http.get<IAsignacionValeSolicitud>(
      `${this.baseUrl}/asignacionvale/ver/${codigoAsignacion}`
    );
  }

  devolverVales(valesParaDevolucion: IValesADevolver, usuario: string) {
    console.log("interfaz: ", valesParaDevolucion);

    const data = {
      valeDevuelto: valesParaDevolucion,
      usuario: usuario,
    };
    return this.http.post(`${this.baseUrl}/asignacionvale/devolver`, data);
  }

  liquidarVales(valesParaLiquidar: ILiquidacion, usuario: string, empleado: string, cargo: string) {
    const data = {
      valesLiquidados: valesParaLiquidar,
      usuario: usuario,
      empleado: empleado,
      cargo: cargo
    };
    return this.http.post(`${this.baseUrl}/asignacionvale/liquidar`, data);
  }

  //anula la mision
  anularMision(misionAnulada: IAnularMision, usuario: string, empleado: string, cargo: string) {
    const data = {
      misionAnulada: misionAnulada,
      usuario: usuario,
      empleado: empleado,
      cargo: cargo
    };
    return this.http.post(`${this.baseUrl}/asignacionvale/anular`, data);
  }

  getSolicitudVale(codigo: string) {
    return this.http.get<ISolicitudValeAprobar>(
      `${this.baseUrl}/asignacionvale/listarsolicitudvalecodigo/${codigo}`
    );
  }

  async mensajesConfirmarDevolucion(
    icono: SweetAlertIcon = "warning",
    title: string = "¿Está seguro de devolver?",
    label: string = "Algunos datos no se podrán revertir, digite: ",
    palabraClave: string = "devolver"
  ) {
    let estado = false;
    const palabra = palabraClave;

    const { value: valorPalabra } = await Swal.fire({
      icon: icono,
      title: title,
      input: "text",
      inputLabel: label + palabraClave,
      inputValue: "",
      showCancelButton: true,
      confirmButtonColor: "#972727",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#2c3136",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "¡Tiene que escribir algo!";
        }
        if (value != palabra) {
          return "¡No coincide!";
        }
      },
    });

    if (valorPalabra) {
      estado = true;
    }

    return estado;
  }
  async mensajesConfirmarLiquidacion(
    icono: SweetAlertIcon = "warning",
    title: string = "¿Está seguro de liquidar?",
    label: string = "Algunos datos no se podrán revertir, digite: ",
    palabraClave: string = "liquidar"
  ) {
    let estado = false;
    const palabra = palabraClave;

    const { value: valorPalabra } = await Swal.fire({
      icon: icono,
      title: title,
      input: "text",
      inputLabel: label + palabraClave,
      inputValue: "",
      showCancelButton: true,
      confirmButtonColor: "#972727",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#2c3136",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "¡Tiene que escribir algo!";
        }
        if (value != palabra) {
          return "¡No coincide!";
        }
      },
    });

    if (valorPalabra) {
      estado = true;
    }

    return estado;
  }

  async mensajesConfirmarAnular(
    icono: SweetAlertIcon = "warning",
    title: string = "¿Está seguro de Anular?",
    label: string = "Algunos datos no se podrán revertir, digite: ",
    palabraClave: string = "anular"
  ) {
    let estado = false;
    const palabra = palabraClave;

    const { value: valorPalabra } = await Swal.fire({
      icon: icono,
      title: title,
      input: "text",
      inputLabel: label + palabraClave,
      inputValue: "",
      showCancelButton: true,
      confirmButtonColor: "#972727",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#2c3136",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "¡Tiene que escribir algo!";
        }
        if (value != palabra) {
          return "¡No coincide!";
        }
      },
    });

    if (valorPalabra) {
      estado = true;
    }

    return estado;
  }
}
