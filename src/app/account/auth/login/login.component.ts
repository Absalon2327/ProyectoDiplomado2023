import { MensajesService } from 'src/app/shared/global/mensajes.service';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { UsuarioService } from "../services/usuario.service";
import Swal from "sweetalert2";
import { ILoginUsuario } from "../interfaces/usuario";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {
  storage: Storage = window.localStorage;
  loginForm: FormGroup;
  submitted = false;
  error = "";
  returnUrl: string;

  public showPassword: boolean = false;
  public password: string = "";

  // set the currenr year
  year: number = new Date().getFullYear();

  alerts = [
    {
      id: 1,
      type: "info",
      message:
        "Ingrese su nombre de usuario y contraseña. Si es la primera vez que inicia sesión, su contraseña será el número de su DUI.",
      show: false,
    },
  ];

  // tslint:disable-next-line: max-line-length
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private modalService: NgbModal,
    private mensajesService: MensajesService
  ) { 
    this.loginForm = this.iniciarFormulario();
  }

  ngOnInit() {
    
  }

  private iniciarFormulario() {
    return this.fb.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  /**
   * Form submit
   */
  onSubmit() {
    if (this.loginForm.valid) {
      const login: ILoginUsuario = {
        nombre: this.loginForm.get("email").value,
        clave: this.loginForm.get("password").value,
      };

      login.nombre = login.nombre.toLowerCase();

      this.cargando();

      this.usuarioService.login(login).subscribe(
        (resp) => {
          if (this.loginForm.get("remember")?.value) {
            this.storage.setItem("email", this.loginForm.get("email")?.value);
          } else {
            this.storage.removeItem("email");
          }
          Swal.close();
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "success",
            text: "¡Ha iniciado sesión!",
          }).then(() => {
            const rol = JSON.parse(this.storage.getItem("usuario" || ""));
            // Aquí se realiza la redirección
            this.router.navigate(["/dashboard"]);
            this.loginForm.reset();
          });
        },
        (err) => {
          this.mensajesService.mensajesSweet("error","Error",err, "Entiendo");
        }
      );
    } else {
      this.mensajesService.mensajesToast(
        "warning",
        "Complete lo que se indican"
      );

      return Object.values(this.loginForm.controls).forEach((control) =>
        control.markAsTouched()
      );
    }
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  mostrarAyuda() {
    this.mensajesService.mensajesSweet("info", "¡Importante!", "Ingrese su nombre de usuario y contraseña. Si es la primera vez que inicia sesión, su contraseña será el número de su DUI.", "Entiendo");
  }


  esCampoValido(campo: string) {
    const validarCampo = this.loginForm.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? "is-invalid"
      : validarCampo?.touched
        ? "is-valid"
        : "";
  }

  //////   metodos para la ayuda ///////
  CambiarAlert(alert) {
    alert.show = !alert.show;
    this.modalService.dismissAll();
  }

  restaurarAlerts() {
    this.alerts.forEach((alert) => {
      alert.show = true;
    });
  }

  siMuestraAlertas() {
    return this.alerts.every((alert) => alert.show);
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
}
