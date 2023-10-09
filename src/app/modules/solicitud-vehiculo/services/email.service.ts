import {inject, Injectable} from '@angular/core';
import {IEmail} from "../interfaces/data.interface";
import {Observable, throwError} from "rxjs";
import {Usuario} from "../../../account/auth/models/usuario.models";
import {catchError, map, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private http = inject(HttpClient);
  private url: string = environment.baseUrl;
  usuario!: Usuario;
  correoJefeDepto: string;
  constructor() { }

  get codUsuario(): string {
    return localStorage.getItem("codUsuario" || "");
  }

  getUsuarioSV(): Observable<Usuario> {
    return this.http
      .get(`${this.url}/usuario/${this.codUsuario}`)
      .pipe(
        map((usuario: any) => {
          const { codigoUsuario, nombre, nuevo, role, token, empleado } = usuario;
          return new Usuario(codigoUsuario, nombre, "", nuevo, role, token, empleado);
        })
      );
  }

  obtenerUsuarioActivo(){
    // Suscríbete al Observable para obtener el usuario
    this.getUsuarioSV().subscribe((usuario: Usuario) => {
      this.usuario = usuario;
    });
  }

  /*correo*/
  notificarEmail(email: IEmail) {
    console.log("data a enviar al backend" , email);
    this.enviarNotificacionCorreo(email).subscribe(
      (resp) => {
      },
      (err) => {
        console.log("Error al enviar el correo de notificación" +err);
      }
    );
  }

  enviarNotificacionCorreo(body: IEmail) {
    return this.http.post(`${this.url}/correo/enviarmail`, body).pipe(
      tap((resp: any) => {
      }),
      catchError(err => {
        return throwError(err.error.message);
      })
    );
  }

  getCorreoJefeDepto(depto: string): Observable<{ correo: string, nombreCompleto: string }> {
    return this.http.get<{ correo: string, nombreCompleto: string }>(`${this.url}/solicitudvehiculo/obtenerjefe/${depto}`);
  }

  getSolicitante(id: string): Observable<{ correo: string, nombreCompleto: string }>{
    return this.http.get<{ correo: string, nombreCompleto: string }>
          (`${this.url}/solicitudvehiculo/obtenersolicitante/${id}`);
  }

  getEmailNameRol(rol: string): Observable<{ correo: string, nombreCompleto: string }>{
    return this.http.get<{ correo: string, nombreCompleto: string }>
    (`${this.url}/solicitudvehiculo/obtenercrol/${rol}`);
  }
}
