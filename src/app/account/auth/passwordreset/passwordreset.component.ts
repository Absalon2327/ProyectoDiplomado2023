import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { UsuarioService } from '../services/usuario.service';
import Swal from 'sweetalert2';
import { IEmail, IRespass } from '../interfaces/usuario';
import { MensajesService } from 'src/app/shared/global/mensajes.service';
import { EMAIL_VALIDATE_UES } from 'src/app/constants/constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})

/**
 * Reset-password component
 */
export class PasswordresetComponent implements OnInit {

  resetForm: FormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;
  arroba: boolean = false;

  code: boolean = false;
  resetpass: boolean = false;
  anothermethod: boolean = false;

  msjclave!: string;
  seguridad!: string;
  msjclaveconfir!: string;
  confirma!: string;
  media!: boolean;
  public showPassword: boolean = false;
  public password: string = "";
  public showPassword2: boolean = false;
  codigo!: string;
  private isEmail: string = EMAIL_VALIDATE_UES;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(
    private fb: FormBuilder,
    private mensajesService: MensajesService,
    private usuarioService: UsuarioService,
    private router: Router,
  ) {
    this.resetForm = this.iniciarFormulario();
  }


  alerts = [
    {
      id: 1,
      type: "info",
      message: "El correo electronico sera funcional solo cuando se encuentre en la base de datos y sea el correcto.",
      show: false,
    },
  ];

  ngOnInit() {

  }

  private iniciarFormulario() {
    return this.fb.group({
      correo: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      dui: ['', [Validators.required]],
      clave: [''],
    });
  }

  /**
   * On submit form
   */
  onSubmit() {
    if (this.resetForm.valid && !this.code && !this.resetpass && this.anothermethod) {

      this.resetpassCD();

    } else if (this.code) {
      this.submitCode();
    } else if (!this.anothermethod) {
      if (this.resetForm.get('correo').valid) {
        this.resetpassEmail();
      } else {
        this.mensajesService.mensajesToast(
          "warning",
          "Complete lo que se indican"
        );
      }
    } else {

      if (this.confirma == "confirmada" && this.media) {
        this.resetpassword();

      } else {
        this.mensajesService.mensajesToast(
          "warning",
          "Complete lo que se indican"
        );
        return Object.values(this.resetForm.controls).forEach((control) =>
          control.markAsTouched()
        );
      }

    }
  }

  resetpassCD() {
    const rest: IRespass = {
      correo: this.resetForm.get('correo').value,
      dui: this.resetForm.get('dui').value,
      codigo: '',
    }

    this.usuarioService.resetpass(rest).subscribe(
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
          text: '¡Se ha confirmado!'
        }).then(() => {
          this.alerts.map((alert) => {
            alert.message = "La clave debe incluir letras mayúsculas y minúsculas, tener más de 5 caracteres y contener caracteres especiales como '!@#$%^&'.";
          });

          this.resetpass = true;
          this.code = false;
          this.anothermethod = true;
          this.usuarioService.getUsuario();
        })
      },
      (err) => {
        
        this.mensajesService.mensajesSweet("error", "Error", err, "Entiendo");
        this.code = false;
      }
    );
  }

  resetpassEmail() {
    this.cargando();

    const rest: IRespass = {
      correo: this.resetForm.get('correo').value,
      dui: '',
      codigo: this.generarCodigoAleatorio(),
    }

    this.codigo = rest.codigo; //salvamos el codigo

    this.usuarioService.resetpassEmail(rest).subscribe(
      (resp) => {
        this.Email();
      },
      (err) => {
        Swal.close();
        this.mensajesService.mensajesSweet("error", "Error", err, "Entiendo");
        this.code = false;
      }
    );
  }

  generarCodigoAleatorio() {
    // Genera un número aleatorio entre 0 y 99999 (5 dígitos)
    const codigo = Math.floor(Math.random() * 100000);
    // Convierte el número en una cadena de texto
    const codigoTexto = codigo.toString();
    // Asegura que el código tenga exactamente 5 dígitos, agregando ceros a la izquierda si es necesario
    const codigoCompleto = codigoTexto.padStart(5, '0');
    return codigoCompleto;
  }

  focusNext(event: any, nextInputId: string) {
    const input = document.getElementById(nextInputId) as HTMLInputElement;
    if (event.target.value.length === 1) {
      input.focus();
    }
  }

  submitCode() {
    const code = this.obtenerCodigo();

    if (code.length === 5) {
      // Aquí puedes enviar el código a tu servidor o realizar la acción deseada.
      this.usuarioService.confirmarcode(code).subscribe(
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
            text: '¡Código confirmado!'
          }).then(() => {
            this.alerts.map((alert) => {
              alert.message = "La clave debe incluir letras mayúsculas y minúsculas, tener más de 5 caracteres y contener caracteres especiales como '!@#$%^&'.";
            });
            this.resetpass = true;
            this.code = false;
            this.anothermethod = true;
            this.usuarioService.getUsuario();
          })
        },
        (err) => {   
          this.mensajesService.mensajesSweet("error", "Error", "El codigo no coincide", "Entiendo");
          this.limpiarCampos();
          this.resetpass = false;
        }
      );
    } else {
      this.mensajesService.mensajesSweet("error", "Error", "Por favor, complete el código de 5 dígitos.", "Entiendo");
    }
  }

  resetpassword() {
    const clave = this.resetForm.get("clave").value;

    const usuario = this.usuarioService.usuario;
    usuario.clave = clave;

    this.usuarioService.Credenciales(usuario).subscribe(
      (resp: any) => {
        if (resp) {
          if (this.usuarioService.validarToken()) {
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 2000,
              //timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: "success",
              text: "Modificación exitosa",
            }).then(() => {
              this.router.navigate(['/dashboard']);
              this.resetForm.reset();
            });
          }
        }
      },
      (err: any) => {
        this.mensajesService.mensajesSweet("error", "Error", err.error.message, "Entiendo");;
      }
    );
  }

  obtenerCodigo() {
    let codigo = '';
    for (let i = 1; i <= 5; i++) {
      const input = document.getElementById('digit' + i) as HTMLInputElement;
      codigo += input.value;
    }
    return codigo;
  }

  limpiarCampos() {
    for (let i = 1; i <= 5; i++) {
      const input = document.getElementById('digit' + i) as HTMLInputElement;
      input.value = '';
    }
  }


  SeguridadClave(event: any) {
    const clave = event.target.value;

    this.seguridad = this.evaluarSeguridadClave(clave);
    if (this.seguridad === "alta") {
      this.msjclave = "Seguridad alta";
    } else if (this.seguridad === "media") {
      this.msjclave = "Seguridad media";
    } else {
      this.msjclave = "La clave es poco segura";
    }
  }

  VerificarClaves(event: any) {
    const clave = this.resetForm.get('clave').value;

    const valorConfirClave = event.target.value;

    if (clave === valorConfirClave) {
      this.msjclaveconfir = "Clave confirmada";
      this.confirma = "confirmada";
    } else {
      this.msjclaveconfir = "Las claves no coinciden";
      this.confirma = "errorclave";
    }
  }

  evaluarSeguridadClave(clave: string): "baja" | "media" | "alta" {
    if (clave.length < 5) {
      this.media = false;
      return "baja";
    }
    if (/^[a-zA-Z]+$/.test(clave)) {
      this.media = true;
      return "media";
    }
    if (
      /[0-9]/.test(clave) &&
      /[A-Z]/.test(clave) &&
      /[!@#$%^&*]/.test(clave)
    ) {
      this.media = true;
      return "alta";
    }
    this.media = true;
    return "media";
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public togglePasswordVisibility2(): void {
    this.showPassword2 = !this.showPassword2;
  }

  Email() {
    const email: IEmail = {
      asunto: 'Cambio de credenciales',
      titulo: 'Cambio de credenciales',
      email: this.usuarioService.correo,
      receptor: "Estimad@ : " + this.usuarioService.nombre,
      mensaje: 'Su cuenta está en proceso de actualización de credenciales. Por motivos de seguridad, hemos enviado un código de verificación que le permitirá completar el proceso de actualización de sus credenciales.',
      centro: 'Utilice este codigo para continuar con el proceso :',
      codigo: this.codigo,
      abajo: 'Gracias por su atención a este importante mensaje.',
    }

    this.usuarioService.SendEmail(email).subscribe(
      (resp) => {
        Swal.close();
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
          text: '¡Se ha confirmado!'
        }).then(() => {
          this.code = true;
          this.alerts.map((alert) => {
            alert.message = "Ingrese el codigo que se ha enviado a su correo.";
          });
        })
      },
      (err) => {
        
        this.mensajesService.mensajesSweet("error", "Error", err, "Entiendo");
      }
    );
  }

  //// metodo para validar el campo si es valido o no ////
  esCampoValido(campo: string) {
    const validarCampo = this.resetForm.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? 'is-invalid' : validarCampo?.touched ? 'is-valid' : '';
  }

  Anothermethod() {
    this.anothermethod = !this.anothermethod;
    this.alerts.map((alert) => {
      alert.message = "Debe ingresar correo institucional y DUI";
    });
  }

  cargando() {
    Swal.fire({
      title: 'Espere un momento!',
      html: 'Se está procesando la petición...',
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  //////   metodos para la autocompletar el correo ///////
  autocompletarCorreo(event: any) {
    const usuario = this.resetForm.value.correo;
    const clave = event.target.value;
    const ultimoCaracter = clave.slice(-1); // Obtener el último carácter

    if (usuario && ultimoCaracter === '@' && !this.arroba) {
      this.arroba = !this.arroba;
      this.resetForm.get('correo').setValue(`${usuario}ues.edu.sv`);
    } else if (usuario && ultimoCaracter === '@' && this.arroba) {
      this.arroba = !this.arroba;
    }
  }

  mostrarAyuda() {
    let mensaje;

    this.alerts.map((alert) => {
      mensaje = alert.message;
    });

    this.mensajesService.mensajesSweet("info", "¡Importante!", mensaje, "Entiendo");
  }
}


