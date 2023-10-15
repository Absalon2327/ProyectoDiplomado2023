import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioService } from 'src/app/account/auth/services/usuario.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanActivate, CanLoad {
  usuariojson: any;
  storage: Storage = window.localStorage;
  constructor(private usuarioService: UsuarioService, private router: Router) {
    //this.usuariojson = this.usuarioService.usuarioJSON;
  }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.hasRol(route)) {
      return true;
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'No tiene los permisos necesarios para acceder',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
  canLoad(route: Route): boolean {
    if (this.hasRol(route)) {
      return true;
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'No tiene los permisos necesarios para acceder a la ruta',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }

  private hasRol(route: Route | ActivatedRouteSnapshot) {
    const usuarioJson = JSON.parse(this.storage.getItem("usuario" || ""));
    const allowedRoles = route.data?.['allowedRoles'];
    //return Boolean(this.usuariojson && allowedRoles.includes(this.usuariojson.role));
    return Boolean(usuarioJson && allowedRoles.includes(usuarioJson.role))
  }
}
