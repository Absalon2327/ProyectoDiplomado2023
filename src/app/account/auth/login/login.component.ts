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
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["decanato@ues.edu.sv", [Validators.required]],
      password: ["12345678", [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
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
            if (
              rol.role == "ASIS_FINANCIERO" ||
              rol.role == "JEFE_FINANACIERO" ||
              rol.role == "ADMIN"
            ) {
              this.router.navigate(["/home-financiero"]);
            } else if (rol.role == "VIGILANTE" || rol.role == "ADMIN") {
              this.router.navigate(["/entrasalida/listar"]);
            } else {
              this.router.navigate(["/dashboard"]);
            }
            this.loginForm.reset();
          });
        },
        (err) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err,
          });
        }
      );
    }
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  //// metodo par abrir la modal ////
  openModal(content: any) {
    //hacer que la modal no se cierre al precionar fuera de ella -> backdrop: 'static', keyboard: false
    this.modalService.open(content, {
      size: "",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
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
    let timerInterval;
    Swal.fire({
      title: "Espere un momento!",
      html: "Se esta procesando la solicitud.",
      timer: 5000,

      didOpen: () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {
          const content = Swal.getHtmlContainer();
          if (content) {
            const b = content.querySelector("b");
            if (b) {
              b.textContent = Swal.getTimerLeft() + "";
            }
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
  }
}
