import { Injectable, NgZone, inject } from '@angular/core';
import { DataCards, Empleado, Usuario } from '../models/usuario.models';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { IEmail, ILoginUsuario, IRegistroUsuario, IRespass } from '../interfaces/usuario';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  storage: Storage = window.localStorage;
  public usuario!: Usuario;
  public empleado!: Empleado;
  public cards!: DataCards;
  private http = inject(HttpClient);
  private baseUrl: string = environment.baseUrl;

  constructor(
    private router: Router,
    private ngZone: NgZone
  ) { }

  /* Creacion de usuario */
  /*   crearUsuario(forData: IRegistroUsuario) {
      console.log();
      return this.http.post(`${this.baseUrl}/usuarios`, forData).pipe(
        tap((resp: any) => {
          this.guardarLocalSotrage('token', resp.token);
          this.usuario = resp.usuario;
        })
      );
    } */

  /* Para autentificar la entrada */
  login(forData: ILoginUsuario) {
    const body = {
      nombre: forData.nombre,
      clave: forData.clave
    };

    return this.http.post(`${this.baseUrl}/usuario/auth/login`, body).pipe(
      tap((resp: any) => {
        const { codigoUsuario, nombre, nuevo, role, token, empleado } = resp.usuario;
        this.usuario = new Usuario(codigoUsuario, nombre, "", nuevo, role, token, empleado);
        this.guardarLocalSotrage('token', resp.token);
        this.guardarLocalSotrage('codEmpleado', resp.usuario.empleado.codigoEmpleado);
        this.guardarLocalSotrage('empleadoFoto', resp.usuario.empleado.nombrefoto);
        this.guardarLocalSotrage('codUsuario', resp.usuario.codigoUsuario);
        let usuarioJSON = { "role": resp.usuario.role, "codigoUsuario": resp.usuario.codigoUsuario, "empleado": resp.usuario.empleado }
        this.guardarLocalSotrage('usuario', JSON.stringify(usuarioJSON));

      }),
      catchError(err => {
        return throwError(err.error.message);
      })
    );
  }

  getCards() {
    this.http
      .get(`${this.baseUrl}/usuario/datacards`)
      .pipe(map((resp: any) => resp as any))
      .subscribe(
        (datacards: any) => {
          this.cards = datacards; // guarda cards
          const { vales, misiones, misioneshoy, misionesmes } = datacards;
          this.cards = new DataCards(vales, misiones, misioneshoy, misionesmes);
        },
        (error) => {
          console.error("Error al obtener las cards:", error);
        }
      );
  }

  resetpass(rest: IRespass) {
    return this.http.post(`${this.baseUrl}/usuario/resetpass`, rest).pipe(
      tap((resp: any) => {
        const { codigoUsuario } = resp;
        this.guardarLocalSotrage('codUsuario', codigoUsuario);
      }),
      catchError(err => {
        return throwError(err.error.message);
      })
    );
  }

  resetpassEmail(rest: IRespass) {
    return this.http.post(`${this.baseUrl}/usuario/resetpassEmail`, rest).pipe(
      tap((resp: any) => {
        const { codigoUsuario, codigo, empleado } = resp;
        this.guardarLocalSotrage('codUsuario', codigoUsuario);
        this.guardarLocalSotrage('restcodigo', codigo);
        this.guardarLocalSotrage('correo', empleado.correo);
        this.guardarLocalSotrage('nombre', empleado.nombre + empleado.apellido);
      }),
      catchError(err => {
        return throwError(err.error.message);
      })
    );
  }

  confirmarcode(code: string) {
    return this.http.get(`${this.baseUrl}/usuario/resetpass/confirmarcode/${code}`).pipe(
      tap((resp: any) => {
        const { codigoUsuario } = resp;
        this.guardarLocalSotrage('codUsuario', codigoUsuario);
      }),
      catchError(err => {
        return throwError(err.error.message);
      })
    );
  }


  /* Para guardar en el local storage del navegador */
  guardarLocalSotrage(tipo: string, contenido: string) {
    this.storage.setItem(tipo, contenido);
  }


  /* Para obtener el token del localstorage */
  get token(): string {
    return this.storage.getItem("token" || "");
  }

  get codUsuario(): string {
    return this.storage.getItem("codUsuario" || "");
  }

  get codEmpleado(): string {
    return this.storage.getItem("codEmpleado" || "");
  }

  get usuarioJSON(): string {
    return JSON.parse(this.storage.getItem("usuario" || ""));
  }

  get restcodigo(): string {
    return this.storage.getItem("restcodigo" || "");
  }

  get correo(): string {
    return this.storage.getItem("correo" || "");
  }

  get nombre(): string {
    return this.storage.getItem("nombre" || "");
  }

  get empleadofoto(): string {
    return this.storage.getItem("empleadoFoto" || "");
  }

  getUsuario() {
    this.http
      .get(`${this.baseUrl}/usuario/${this.codUsuario}`)
      .pipe(tap((resp: any) => resp as any))
      .subscribe(
        (usuario: any) => {
          const { codigoUsuario, nombre, clave, nuevo, role, token, empleado } = usuario;
          this.usuario = new Usuario(codigoUsuario, nombre, "", nuevo, role, token, empleado);
        },
        (error) => {
          console.error("Error al obtener los usuario:", error);
        }
      );
  }


  getEmpleado() {
    this.http
      .get(`${this.baseUrl}/empleado/${this.codEmpleado}`)
      .pipe(map((resp: any) => resp as any))
      .subscribe(
        (empleado: any) => {
          this.empleado = empleado; // guarda Empleado
          const { codigoEmpleado, dui, nombre, apellido, telefono, licencia, tipolicencia, fechalicencia, estado, jefe, correo, nombrefoto, urlfoto, cargo, departamento } = empleado;
          this.empleado = new Empleado(codigoEmpleado, dui, nombre, apellido, telefono, licencia, tipolicencia, fechalicencia, estado, jefe, correo, nombrefoto, urlfoto, cargo, departamento);
        },
        (error) => {
          console.error("Error al obtener los empleado:", error);
        }
      );
  }


  public Credenciales(usuario: Usuario): any {
    return this.http.put(`${this.baseUrl}/usuario/credenciales`, usuario);
  }


  logout() {
    this.storage.clear();
    this.ngZone.run(() => {
      this.router.navigateByUrl('/account/login');
    });
  }

  SendEmail(body: IEmail) {
    return this.http.post(`${this.baseUrl}/correo/enviarmail`, body).pipe(
      tap((resp: any) => {
        console.log(resp);
      }),
      catchError(err => {
        return throwError(err.error.message);
      })
    );
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/usuario/auth/renew`, {
      headers: {
        'x-token': this.token,
      },
    }).pipe(
      map((resp: any) => {
        this.guardarLocalSotrage('token', resp.token);
        this.guardarLocalSotrage('codEmpleado', resp.empleado.codigoEmpleado);
        this.guardarLocalSotrage('empleadoFoto', resp.empleado.nombrefoto);
        this.guardarLocalSotrage('codUsuario', resp.codigoUsuario);
        return true;
      }),
      catchError((err) => {
        // Token caducado, muestra un mensaje de error en la consola
        this.logout();
        return of(false);
      })
    );
  }

  /* get rol(): "ADMIN_ROLE" | "USER_ROLE" | string {
    //return this.usuario.role;
  } */

}
