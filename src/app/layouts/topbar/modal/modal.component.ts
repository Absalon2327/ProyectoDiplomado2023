import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UsuarioService } from "src/app/account/auth/services/usuario.service";
import { NAME_VALIDATE } from "src/app/constants/constants";
import { DetalleService } from "src/app/modules/asignacion-vales/services/detalle.service";
import { EmpleadoService } from "src/app/modules/empleado/service/empleado.service";
import { MensajesService } from "src/app/shared/global/mensajes.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
  formEmpleado!: FormGroup;
  formUsuario!: FormGroup;
  formSendGrid!: FormGroup;

  @Input() nuevo!: boolean;
  @Input() leyenda!: string;
  @Input() user!: string;
  @Input() home: boolean = false;
  public imgTemp: string | ArrayBuffer = null;
  private file!: File;
  imagen: string = "no hay";
  fotoEmpleado!: string;
  private isText: string = NAME_VALIDATE;
  msjclave!: string;
  seguridad!: string;
  msjclaveconfir!: string;
  confirma!: string;
  media!: boolean;
  public showPassword: boolean = false;
  public password: string = "";
  public showPassword2: boolean = false;

  @ViewChild('content') content;

  alerts = [
    {
      id: 1,
      type: "info",
      message:
        "Complete los campos obligatorios (*); la imagen no es obligatoria",
      show: false,
    },
  ];

  alerts2 = [
    {
      id: 1,
      type: "info",
      message:
        "Por favor, complete todos los campos obligatorios (*). Asegúrese de que las claves coincidan y tengan un nivel de seguridad medio. La clave debe incluir letras mayúsculas y minúsculas, tener más de 5 caracteres y contener caracteres especiales como '!@#$%^&'",
      show: false,
    },
  ];


  alerts3 = [
    {
      id: 1,
      type: "warning",
      message:
        "Las credenciales solo deben ser modificadas en caso de fallo o si son distintas. La plantilla debe conservar las mismas variables para asegurar el envío correcto de correos electrónicos. Es crucial tener en cuenta que una vez alteradas las credenciales actuales, no será posible recuperarlas. Si llegara a modificar las credenciales de la API de SendGrid con información no válida, el envío de correos quedará inoperativo; en este caso, deberá ingresar credenciales válidas a través de la Interfaz de la API SendGrid.",
      show: false,
    },
  ];

  alerts4 = [
    {
      id: 1,
      type: "info",
      message:
        "Este enlace está destinado exclusivamente para el uso de la Aplicación Web Misiones Decanato en apoyo al material audiovisual. Por favor, absténgase de compartir este enlace a través de cualquier otro medio.",
      show: false,
    },
  ];


  constructor(
    private usuarioService: UsuarioService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private empleadoService: EmpleadoService,
    private mensajesService: MensajesService,
    private service: DetalleService
  ) {
    this.formEmpleado = this.iniciarFormularioE();
    this.formUsuario = this.iniciarFormularioU();
    this.formSendGrid = this.iniciarFormularioS();
  }

  ngOnInit() {
    this.fotoEmpleado = this.usuarioService.empleadofoto;
    this.usuarioService.getEmpleado();
    this.usuarioService.getUsuario();
    this.usuarioService.getSendGrid();

    if (this.leyenda == "Credenciales") {
      this.restaurarAlerts2();
    }

    if (this.leyenda == "SendGrid") {
      this.restaurarAlerts3();
    }

    if (this.leyenda == "Ayuda") {
      this.restaurarAlerts4();
    }

  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.nuevo) {
        this.leyenda = "Credenciales";
        this.openModalN();
      }
    }, 2000);
  }

  private iniciarFormularioE() {
    return this.fb.group({
      codigoEmpleado: [""],
      dui: [""],
      nombre: ["", [Validators.required, Validators.pattern(this.isText)]],
      apellido: ["", [Validators.required, Validators.pattern(this.isText)]],
      telefono: ["", [Validators.required, Validators.pattern(/^[267]\d{7}$/)]],
      licencia: [""],
      tipolicencia: [""],
      fechalicencia: [""],
      jefe: [""],
      estado: [""],
      nombrefoto: [""],
      urlfoto: [""],
      correo: [""],
      cargo: [""],
      departamento: [""],
    });
  }

  private iniciarFormularioU() {
    return this.fb.group({
      codigoUsuario: [""],
      empleado: [""],
      nombre: [""],
      nuevo: [""],
      token: [""],
      clave: ["", [Validators.required]],
    });
  }

  private iniciarFormularioS() {
    return this.fb.group({
      codigoSendgrid: [""],
      keysendgrid: ["", [Validators.required, Validators.minLength(30)]],
      keyplantilla: ["", [Validators.required, Validators.minLength(30)]],
    });
  }
  

  ///// metodo que extrae la informacion de la imagen /////
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.file = (target.files as FileList)[0];
    this.imagen = "seleccioanda";
    this.preVisualizarImagen(event);
  }

  ///// metodo para previsualizar la imagen /////
  preVisualizarImagen(event: any) {
    this.file = event.target.files[0];
    //cambia a imagen previa
    if (!this.file) {
      this.imgTemp = null;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  get empleado() {
    return this.usuarioService.empleado;
  }

  get sendgrid() {
    return this.usuarioService.sendgrid;
  }

  guardar() {
    if (this.formEmpleado.valid || this.formUsuario.valid || this.formSendGrid.valid) {
      if (this.leyenda == "Datos") {
        this.cargando();
        this.registrandoE();
      } else if (this.leyenda == "Credenciales") {
        if (this.confirma == "confirmada" && this.media) {
          this.cargando();
          this.registrandoU();
        } else {
          
          this.mensajesService.mensajesSweet("warning", "Faltan parametros de seguridad", "Las claves deben coincidir y tener seguridad media como minimo", "Entiendo");
        }
      } else {
        this.registrandoS();
      }
    } else {
      this.mensajesService.mensajesToast(
        "warning",
        "Complete lo que se indican"
      );

      if (this.leyenda == "Datos") {
        return Object.values(this.formEmpleado.controls).forEach((control) =>
          control.markAsTouched()
        );
      } else if (this.leyenda == "Credenciales") {
        return Object.values(this.formUsuario.controls).forEach((control) =>
          control.markAsTouched()
        );
      } else {
        return Object.values(this.formSendGrid.controls).forEach((control) =>
          control.markAsTouched()
        );
      }

    }
  }

  registrandoE() {
    this.EstructurandoFormE();
    const empleado = this.formEmpleado.value;

    if (this.imagen === "no hay") {
      this.empleadoService.putEmpleado(empleado).subscribe(
        (resp: any) => {
          if (resp) {
            Swal.close();
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
                // Aquí se realiza la redirección
                this.formEmpleado.reset();
                this.recargar();
                this.modalService.dismissAll();
                window.location.reload();
              });
            }
          }
        },
        (err: any) => {
          Swal.close();
          this.mensajesService.mensajesSweet(
            "error",
            "Ups... Algo salió mal",
            err.error.message
          );
        }
      );
    } else {
      this.empleadoService.putEmpleadoImagen(empleado, this.file).subscribe(
        (resp: any) => {
          if (resp) {
            Swal.close();
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
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
              // Aquí se realiza la redirección
              this.formEmpleado.reset();
              this.recargar();
              this.modalService.dismissAll();
              window.location.reload();
            });
          }
        },
        (err: string) => {
          Swal.close();
          this.mensajesService.mensajesSweet(
            "error",
            "Ups... Algo salió mal",
            err
          );
        }
      );
    }
  }

  EstructurandoFormE() {
    const nombre = this.formEmpleado.get("nombre").value;
    const apellido = this.formEmpleado.get("apellido").value;
    const telefono = this.formEmpleado.get("telefono").value;

    const objeto = this.usuarioService.empleado;
    objeto.nombre = nombre;
    objeto.telefono = telefono;
    objeto.apellido = apellido;

    this.formEmpleado.patchValue(objeto);
    this.formEmpleado.patchValue({
      cargo: objeto.cargo.id,
    });
    this.formEmpleado.patchValue({
      departamento: objeto.departamento.codigoDepto,
    });
  }

  registrandoU() {
    this.EstructurandoFormU();
    const usuario = this.formUsuario.value;

    //console.log(usuario);
    this.usuarioService.Credenciales(usuario).subscribe(
      (resp: any) => {
        if (resp) {
          Swal.close();
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
              this.formEmpleado.reset();
              this.recargar();
              this.modalService.dismissAll();
            });
          }
        }
      },
      (err: any) => {
        Swal.close();
        this.mensajesService.mensajesSweet("error", "Error", err.error.message, "Entiendo");;
      }
    );
  }

  EstructurandoFormU() {
    const clave = this.formUsuario.get("clave").value;

    const objeto = this.usuarioService.usuario;
    objeto.clave = clave;
    this.formUsuario.patchValue(objeto);
  }

  async registrandoS() {
    if ((await this.service.mensajesConfirmarModificacionKeysSendgrid()) == true) {
      this.EstructurandoFormS();
       const datos = this.formSendGrid.value;
   
       //console.log(datos);
       this.usuarioService.Sendgrid(datos).subscribe(
         (resp: any) => {
           if (resp) {
             Swal.close();
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
                 this.formSendGrid.reset();
                 this.recargar();
                 this.modalService.dismissAll();
               });
             }
           }
         },
         (err: any) => {
           Swal.close();
           this.mensajesService.mensajesSweet("error", "Error", err.error.message, "Entiendo");;
         }
       );
    }
  }

  EstructurandoFormS() {
    const keysendgrid = this.formSendGrid.get("keysendgrid").value;
    const keyplantilla = this.formSendGrid.get("keyplantilla").value;

    const objeto = this.usuarioService.sendgrid;
    objeto.keysendgrid = keysendgrid;
    objeto.keyplantilla = keyplantilla;
    this.formSendGrid.patchValue(objeto);
  }

  esCampoValido(campo: string) {
    const validarCampo = this.formEmpleado.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? "is-invalid"
      : validarCampo?.touched
        ? "is-valid"
        : "";
  }

  esCampoValidoU(campo: string) {
    const validarCampo = this.formUsuario.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? "is-invalid"
      : validarCampo?.touched
        ? "is-valid"
        : "";
  }

  esCampoValidoS(campo: string) {
    const validarCampo = this.formSendGrid.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? "is-invalid"
      : validarCampo?.touched
        ? "is-valid"
        : "";
  }

  ///// Metodo para recargar la pagina /////
  recargar() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }

  openModalN() {
    this.modalService.open(this.content, { size: "", backdrop: "static" });
  }

  openModal(content: any) {
    this.modalService.open(content, { size: "", backdrop: "static" });
  }

  //// para la alerta de Datos de Empleado
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

  //// para la alerta de Credenciales
  CambiarAlert2(alert2) {
    alert2.show = !alert2.show;
  }

  restaurarAlerts2() {
    this.alerts2.forEach((alert2) => {
      alert2.show = true;
    });
  }

  siMuestraAlertas2() {
    return this.alerts2.every((alert2) => alert2.show);
  }

  //// para la alerta de SendGrid  
  CambiarAlert3(alert3) {
    alert3.show = !alert3.show;
  }

  restaurarAlerts3() {
    this.alerts3.forEach((alert3) => {
      alert3.show = true;
    });
  }

  siMuestraAlertas3() {
    return this.alerts3.every((alert3) => alert3.show);
  }


    //// para la alerta de Ayuda  
  CambiarAlert4(alerts4) {
    alerts4.show = !alerts4.show;
  }

  restaurarAlerts4() {
    this.alerts4.forEach((alerts4) => {
      alerts4.show = true;
    });
  }

  siMuestraAlertas4() {
    return this.alerts4.every((alerts4) => alerts4.show);
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
    const clave = this.formUsuario.get("clave").value;

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


  public eliminarkeysendgrid(): void {
    this.formSendGrid.get('keysendgrid').setValue('');
  }

  public eliminarkeyplantilla(): void {
    this.formSendGrid.get('keyplantilla').setValue('');
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

  AcercaDe() {
    this.usuarioService.logoutAcercaDe();
  }
}
