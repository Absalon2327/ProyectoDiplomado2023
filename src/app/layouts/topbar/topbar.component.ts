import { Component, OnInit, Output, EventEmitter, Inject, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { UsuarioService } from 'src/app/account/auth/services/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/account/auth/models/usuario.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MensajesService } from 'src/app/shared/global/mensajes.service';
import { IEmpleado } from 'src/app/modules/empleado/interface/empleado.interface';
import { IEmail } from 'src/app/account/auth/interfaces/usuario';

@Pipe({ name: 'slice' })
export class SlicePipe implements PipeTransform {
  transform(value: string, start: number, end: number): string {
    return value.slice(start, end) + '...';
  }
}


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit {

  element;
  cookieValue;
  flagvalue;
  countryName;
  valueset;
  icono: string = 'fa fa-fw fa-bars';
  icono2: string = 'mdi mdi-chevron-down ms-1';

  empleadO!: IEmpleado;
  usuariO!: Usuario;
  //usuarioJSON: any;

  fotoEmpleado!: string;
  formUsuario !: FormGroup;
  leyenda !: string;

  alerts = [
    {
      id: 1,
      type: "info",
      message:
        "Complete los campos obligatorios (*)",
      show: false,
    },
  ];

  constructor(@Inject(DOCUMENT) private document: any, private router: Router, private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    public languageService: LanguageService,
    public translate: TranslateService,
    public _cookiesService: CookieService,
    private usuarioService: UsuarioService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private mensajesService: MensajesService) {
    //this.usuarioJSON =  this.usuarioService.usuarioJSON;
  }

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked2 = new EventEmitter();

  ngOnInit() {
    this.fotoEmpleado = this.usuarioService.empleadofoto;
    this.usuarioService.getEmpleado();
    this.usuarioService.getUsuario();
    //this.usuarioJSON =  this.usuarioService.usuarioJSON;

    //console.log(this.usuarioJSON);

    this.openMobileMenu = false;
    this.element = document.documentElement;

    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
  }


  get empleado() {
    return this.usuarioService.empleado;
  }

  get usuario() {
    return this.usuarioService.usuario;
  }

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
    if (this.icono == 'fa fa-fw fa-bars') {
      this.icono = 'fas fa-arrow-right';
    } else if (this.icono == 'fas fa-arrow-right') {
      this.icono = 'fa fa-fw fa-bars';
    }
  }

  toggleMobileMenu2(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked2.emit();
    if (this.icono2 == 'mdi mdi-chevron-down ms-1') {
      this.icono2 = 'mdi mdi-chevron-up ms-1';
    } else if (this.icono2 == 'mdi mdi-chevron-up ms-1') {
      this.icono2 = 'mdi mdi-chevron-down ms-1';
    }
  }

  /**
   * Logout the user
   */
  logout() {
    Swal.fire({
      icon: 'question',
      title: "¿Deseas cerrar la sesión?",
      showDenyButton: true,
      confirmButtonText: "Cerrar la sesión",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.logout();
      }
    });
  }

  /* Enviar email */
  Email() {
    const email: IEmail = {
      asunto: 'Cambio de credenciales',
      titulo: 'Cambio de credenciales',
      email: 'kevineliasmejia@gmail.com',
      receptor: "Estimad@ : " + 'Kevin Elias Mejia Martinez',
      mensaje: 'Para mejorar la seguridad de nuestros sistemas, estamos implementando un cambio obligatorio de contraseñas. A continuación, te proporciono las instrucciones para completar este proceso de manera sencilla y segura',
      centro: 'Utilice este codigo para continuar con el proceso :',
      codigo: '99023992',
      abajo: 'Gracias por tu atención a este importante asunto.',
    }

    this.usuarioService.SendEmail(email).subscribe(
      (resp) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2500,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });

        Toast.fire({
          icon: 'success',
          text: '¡Email enviado!'
        });
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err,
        });
      }
    );
  }

  //// metodo par abrir la modal ////
  openModal(content: any) {
    //hacer que la modal no se cierre al precionar fuera de ella -> backdrop: 'static', keyboard: false
    this.modalService.open(content, { size: 'xl', centered: true, backdrop: 'static', keyboard: false });
  }


  guardar() {

    if (this.formUsuario.valid) {


    } else {
      Swal.fire({
        position: 'center',
        title: 'Faltan datos en el formuario',
        text: 'Complete todos los campos requeridos',
        icon: 'warning',
      });
    }
  }

  registrando() {

    /* 
        this.cargoService.saveCargos(data).subscribe({
          next: (resp) => {
            this.modalService.dismissAll();
            this.formUsuario.reset();
            this.mostrar();
          },
          error: (error) => {
    
            this.mensajesService.mensajesSweet(
              'error',
              "Ups... Algo salió mal",
              error
            )
          },
          complete: () => {
    
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            });
            Toast.fire({
              icon: 'success',
              text: 'Datos Guardados con exito'
            });
    
          }
        }); */

  }

  editando() {
    /* 
        this.cargoService.editCargo(data.id, data).subscribe({
          next: (resp) => {
            this.formUsuario.reset();
            this.modalService.dismissAll();
            this.mostrar();
          },
          error: (error) => {
            this.mensajesService.mensajesSweet(
              'error',
              "Ups... Algo salió mal",
              error
            )
    
          },
          complete: () => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            });
            Toast.fire({
              icon: 'success',
              text: 'Datos Guardados con exito'
            });
          }
        }); */

  }

  esCampoValido(campo: string) {
    const validarCampo = this.formUsuario.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? 'is-invalid' : validarCampo?.touched ? 'is-valid' : '';
  }

  CambiarAlert(alert) {
    alert.show = !alert.show;
  }

  restaurarAlerts() {
    this.alerts.forEach((alert) => {
      alert.show = true;
    });
  }

  siMuestraAlertas() {
    return this.alerts.every((alert) => alert.show);
  }


  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
}
