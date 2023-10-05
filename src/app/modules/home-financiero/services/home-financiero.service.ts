import { Injectable } from '@angular/core';
import { ICompra } from '../../compra/interfaces/compra.interface';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeFinancieroService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }


  getListarPorRangoDeFechas(fechaInicial: string, fechaFinal: string): Observable<ICompra[]> {
    // Crear un objeto HttpParams para agregar los parámetros en la solicitud
    const params = new HttpParams()
      .set('fechaInicial', fechaInicial)
      .set('fechaFinal', fechaFinal);

    return this.http
      .get(`${this.baseUrl}/compra/listarPorRangoDeFechas`, { params })
      .pipe(map((resp: any) => resp as ICompra[]));
  }

  getCantidadValesPorEstado(estado: number): Observable<number> {
    return this.http
      .get(`${this.baseUrl}/vale/cantidadvalesporestado/${estado}`)
      .pipe(map((resp: any) => resp as number));
  }

  getCantidadSolicitudesPorEstado(estado: number): Observable<number> {
    return this.http
      .get(`${this.baseUrl}/asignacionvale/solicivaleEstado/${estado}`)
      .pipe(map((resp: any) => resp as number));
  }
}
