import { Component, Input, OnInit } from "@angular/core";

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {
  EntradaSalidaI,
  IEntradaSalida,
  SolitudVehiculoI,
} from "../../interface/EntSalinterface";
import { Router } from "@angular/router";
import { ListaentradasalidaService } from "../../service/listaentradasalida.service";
import { MensajesService } from "src/app/shared/global/mensajes.service";
import { IsolicitudVehiculo } from "../../interface/VehiculoEntradasalida";
import { ISolicitudvalep } from "src/app/modules/solicitud-vale-paginacion/interface/solicitudvalep.interface";
import { IEmail } from "src/app/account/auth/interfaces/usuario";
import { UsuarioService } from "src/app/account/auth/services/usuario.service";
import { ICorreos } from "src/app/modules/solicitudes/Interfaces/correos.interface";

import { ServiceService } from "src/app/modules/solicitudes/Service/service.service";


@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
  @Input() leyenda!: string;
  @Input() leyendas!: string;
  @Input() titulo!: string;
  @Input() entradasalidaOd!: IEntradaSalida;

  // @Input() salidaentradaOd!: boolean;
  @Input() objetivoMision: IsolicitudVehiculo;
  @Input() controllerdata: boolean;

  //objetivoMision="";
  fechaSalida = "";

  formBuilder!: FormGroup;
  entradasalidas: IEntradaSalida[] = []; //para almacenar los resultados
  //entrasal:IEntradaSalida;

  solicitudvale: ISolicitudvalep;
  horaActual: string;
  fechaActual: string;
  modoEdicion = false;
  kilomet: IEntradaSalida;
  correos!: ICorreos[];

  /////esto para enviar el objetivo a la modal
  //objetivoMision: IsolicitudVehiculo;
  kilometrajeAnterior: number = 0;
  alerts = [
    {
      id: 9,
      type: "info",
      message:
        " Por favor, asegúrese de completar todos los campos obligatorios (*) y de cumplir con los formatos correspondientes. Además, le recomendamos prestar atención a los mensajes de alerta",
      show: false,
    },
  ];

  constructor(
    private modalService: NgbModal,
    private mensajesService: MensajesService,
    private fb: FormBuilder,
    private router: Router,
    private listaentradasalidaservice: ListaentradasalidaService,
    private usuarios: UsuarioService,
    private service: ServiceService

  ) {}

  ngOnInit(): void {
    this.formBuilder = this.Iniciarformulario();
    if (!this.fechaActual) {
      this.fechaActual = this.getCurrentDate();
    }

    if (!this.horaActual) {
      this.horaActual = this.getCurrentTime();
    }
    this.listaentradasalidaservice.getMisiones();
    this.obtenerCorreos();


    
  }
  combustible: string[]=[
    "Un tanque",
    "Mas de tres cuarto de tanque",
    "Tres cuarto de tanque",
    "Menos de tres cuarto de tanque",
    "Mas de medio tanque",
    "Medio tanque",
    "Menos de medio tanque",
    "Mas de un cuarto de tanque",
    "Un cuarto de tanque",
    "Menos de un cuarto de tanque"
  ];

  // Función para obtener la fecha actual en formato "yyyy-MM-dd"
  getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  // Función para obtener la hora actual en formato "hh:mm"
  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  private Iniciarformulario(): FormGroup {
    return this.fb.group({
      id: [""],
      fecha: ["", [Validators.required]],
      hora: ["", [Validators.required]],
      kilometraje: ["", [Validators.required]],
      combustible: ["", [Validators.required]],
      solicitudvehiculo: ["", [Validators.required]],
    });
  }
  //funcion para obtener la fecha actual.
  getToday(): Date {
    return new Date();
  }
  // Validador personalizado para la fecha
  maxDateValidator() {
    return (control) => {
      const selectedDate = new Date(control.value);
      const today = this.getToday();

      if (selectedDate <= today) {
        return { max: true };
      }

      return null;
    };
  }

  OnlyNumbersAllowed(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    const inputValue = event.target.value;
    const dotIndex = inputValue.indexOf(".");

    // Permitir números del 0 al 9
    if (charCode >= 48 && charCode <= 57) {
      // Verificar si ya existe un punto decimal en el campo
      if (dotIndex !== -1) {
        // Obtener la parte decimal después del punto
        const decimalPart = inputValue.substr(dotIndex + 1);
        // Permitir máximo dos decimales
        if (decimalPart.length >= 2) {
          return false;
        }
      }
      return true;
    } else if (charCode === 46 && dotIndex === -1) {
      // Permitir un único punto decimal si no existe uno ya en el campo
      return true;
    } else {
      return false;
    }
  }

  openModal(content: any) {
    this.modalService.open(content, { size: "lx", centered: true });
  }
  editando() {
    const ent = this.formBuilder.value;
    this.listaentradasalidaservice.putEmpleado(ent).subscribe(
      (resp: any) => {
        if (resp) {
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
          });

          this.formBuilder.reset();
          this.recargar();
          this.modalService.dismissAll();
        }
      },
      (err: any) => {
        this.mensajesService.mensajesSweet(
          "error",
          "Ups... Algo salió mal",
          err
        );
        this.obtenerLista();
        this.recargar();
      }
    );
  }

  guardar() {
    if (this.formBuilder.valid) {
      if (this.entradasalidaOd != null) {
        //this.editando();
      } else {
        this.registrando();
      }
    } else {
      Swal.fire({
        position: "center",
        title: "Faltan datos en el formuario",
        text: "submit disparado, formulario no valido",
        icon: "warning",
      });
    }
  }
  registrando() {
    const listando = this.formBuilder.value;
    if (!this.controllerdata) {
      const entsali: EntradaSalidaI = new EntradaSalidaI(
        listando.tipo,
        listando.fecha,
        listando.hora,
        listando.combustible,
        listando.kilometraje,
        1,
        listando.solicitudvehiculo
      );
      this.listaentradasalidaservice.NuevosDatos(entsali).subscribe(
        (resp: any) => {
          if (resp) {
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
              text: "Almacenamiento exitoso",
            });
            this.formBuilder.reset();
            this.recargar();
            this.modalService.dismissAll();
          }
        },
        (err: any) => {
          this.mensajesService.mensajesSweet(
            "error",
            "Ups... Algo salió mal",
            err
          );
          this.obtenerLista();
          this.recargar();
        }
      );
    } else {
      const entsali: EntradaSalidaI = new EntradaSalidaI(
        listando.tipo,
        listando.fecha,
        listando.hora,
        listando.combustible,
        listando.kilometraje,
        2,
        listando.solicitudvehiculo
      );
      const modificando: SolitudVehiculoI = new SolitudVehiculoI(
        listando.solicitudvehiculo,
        listando.fecha
      );

      this.listaentradasalidaservice
        .extrayendokilometraje(listando.solicitudvehiculo)
        .subscribe({
          next: (value) => {
            this.kilomet = value;
            var kilometrajeString1 = this.kilomet.kilometraje;
            var kilometrajeEntero = parseInt(kilometrajeString1, 10);
            var kilometrajeString2 = listando.kilometraje;
            var kilometrajeEntero2 = parseInt(kilometrajeString2, 10);
            if (kilometrajeEntero2 > kilometrajeEntero) {
              this.listaentradasalidaservice
                .NuevosDatos(entsali)
                .subscribe((resp: any) => {
                  this.listaentradasalidaservice
                    .modificandoFecha(modificando)
                    .subscribe(
                      (res: any) => {
                        if (res) {
                          const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 3000,
                            //timerProgressBar: true,
                            didOpen: (toast) => {
                              toast.addEventListener(
                                "mouseenter",
                                Swal.stopTimer
                              );
                              toast.addEventListener(
                                "mouseleave",
                                Swal.resumeTimer
                              );
                            },
                          });
                           // Inicia mensaje dirigido hacia el correo institucional
                           /*this.EmailE(
                            "!Aviso importante!",
                            "Se ha detectado un registro de entrada",
                            "EL Auto detectado ha completado con su mision: " +
                              this.objetivoMision.objetivoMision,
                            "Se solicita continuar con los procesos para poder liquidar"
                          ); */// Termina mensaje dirigido hacia el correo institucional
                          Toast.fire({
                            icon: "success",
                            text: "Almacenamiento exitoso",
                          });

                          this.formBuilder.reset();
                          this.recargar();
                          this.modalService.dismissAll();
                         
                        }
                      },
                      (err: any) => {
                        this.mensajesService.mensajesSweet(
                          "error",
                          "Ups... Algo salió mal",
                          err
                        );
                        this.obtenerLista();
                        this.recargar();
                      }
                    );
                });
            } else {
              Swal.fire({
                position: "center",
                title: "Error",
                text: "El kilometraje debe ser mayor al de salida",
                icon: "warning",
              });
            }
          },
        });
    }
  }

  recargar() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }

  private obtenerLista() {
    //para poder mostrar e la tabla
    this.listaentradasalidaservice.ObtenerLista.subscribe(
      (resp: IEntradaSalida[]) => {
        this.entradasalidas = resp;
      }
    );
  }
  esCampoValido(campo: string) {
    const validarCampo = this.formBuilder.get(campo);
    /*if(campo=="solicitudvehiculo"){
      return 'is-valid';
    }*/
    return !validarCampo?.valid && validarCampo?.touched
      ? "is-invalid"
      : validarCampo?.touched
      ? "is-valid"
      : "";
  }
  get Listamisiones() {
    return this.listaentradasalidaservice.listDeMisiones;
  }

  //metodos para la alerta
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

  EmailE(asunto: string, titulo: string, mensaje: string, centro: string) {
    const nombre = this.correos[0].nombre;
    const correo = this.correos[0].correo;

    const email: IEmail = {
      asunto: asunto,
      titulo: titulo,
      email: correo,
      receptor: "Estimad@ : " + nombre,
      mensaje: mensaje,
      centro: centro,
      codigo: "",
      abajo: "Gracias por su atención a este importante mensaje.",
    };

    this.usuarios.SendEmail(email).subscribe(
      (resp) => {

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
          text: "¡Se ha enviando un mensaje al correo institucional!",
        }).then(() => {});
      },
      (err) => {
        Swal.fire({
          icon: "error",
          title: "Algo salió mal",
          text: err,
        });
      }
    );
  }
  obtenerCorreos() {
    this.service.getCorreosFinanciero().subscribe({
      next: (data) => {
        this.correos = data;
      },
    });
  }
}
