import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/account/auth/models/usuario.models';
import { UsuarioService } from 'src/app/account/auth/services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthSecretariaGuard implements CanActivate {
  public usuario: Usuario;
  constructor(private router: Router,
    private usuarioService: UsuarioService,) {
    this.usuario = this.usuarioService.usuario;
    //console.log(this.usuario);
  }



  canActivate(): Observable<boolean> | boolean {



    if (this.usuario.role === "SECR_DECANATO") {
      return true;
    } else {
      this.router.navigateByUrl('/dashboard');
      return false;

    }

  }

  canLoad(): Observable<boolean> | boolean {

    if (this.usuario.role === "SECR_DECANATO") {
      return true;
    } else {
      this.router.navigateByUrl('/dashboard');
      return false;

    }

  }



}
