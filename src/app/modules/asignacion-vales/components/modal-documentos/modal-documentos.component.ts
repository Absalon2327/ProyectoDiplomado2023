import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  IDocumentosvale,
  valeDocumentosI,
} from "../../interface/IDocumentosvale";
import Swal from "sweetalert2";
import { DetalleService } from "../../services/detalle.service";
import { MensajesService } from "src/app/shared/global/mensajes.service";
import { IAsignacionValeSolicitud } from "../../interfaces/asignacion.interface";

@Component({
  selector: "app-modal-documentos",
  templateUrl: "./modal-documentos.component.html",
  styleUrls: ["./modal-documentos.component.scss"],
})
export class ModalDocumentosComponent implements OnInit {
  @Input() leyenda!: string;
  @Input() titulo!: string;
  @Input() codigoAsignacion: string = "";
  @Input() mision: string = "";
  formBuilder!: FormGroup;
  @Input() documentovaleOd!: IDocumentosvale;
  imagen: string = "no hay";
  private file!: File;
  asignacionSolicitud: IAsignacionValeSolicitud;
  idSolicitud: string;
  entradasalidas: IDocumentosvale[] = [];
  estadoEntrada!: number;
  sizeDocs: number;
  fechaMax: string;
  select = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private detalleservice: DetalleService,
    private mensajesService: MensajesService
  ) {}

  ngOnInit(): void {
    this.formBuilder = this.Iniciarformulario();
    this.ObtenerSolicitudValeById(this.codigoAsignacion);
    this.fechaMax = new Date().toISOString().split("T")[0];
    console.log("fechaMax: ", this.fechaMax);

  }

  guardar() {
    if (this.formBuilder.valid) {
      if (this.documentovaleOd != null) {
        //this.editando();
      } else {
        this.registrando();
      }
    } else {
      Swal.fire({
        position: "center",
        title: "Faltan datos en el formuario",
        text: "formulario no valido",
        icon: "warning",
      });
    }
  }

  ObtenerSolicitudValeById(codigoA: string /* , content: any */) {
    this.detalleservice.getAsignacionValeSolicitudVale(codigoA).subscribe({
      next: (data) => {
        this.asignacionSolicitud = data;
        this.idSolicitud =
          this.asignacionSolicitud.solicitudVale.idSolicitudVale;

        console.log("idSolicitud: ", this.idSolicitud);
        this.obtenerSolicitud(this.idSolicitud /* , content */);
        this.obtenerLista(this.idSolicitud /* , content */);
      },
    });
  }

  registrando() {
    //obtiene los valores del formulario
    this.formBuilder.patchValue({
      solicitudvale: this.asignacionSolicitud.solicitudVale.idSolicitudVale,
    });
    const datotipo = this.formBuilder.get("tipo").value;
    console.log("value del select: ", datotipo);

    const listando = this.formBuilder.value;
    if (this.entradasalidas.length < 2) {
      if (this.entradasalidas.length == 0) {
        this.detalleservice.NuevosDatos(listando, this.file).subscribe(
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

              //reinicia el formulario
              this.formBuilder.reset();
              //this.recargar();
              this.modalService.dismissAll();
              this.recargar();
            }
          },
          (err: any) => {
            this.mensajesService.mensajesSweet(
              "error",
              "Ups... Algo salió mal",
              err
            );
          }
        );
      } else {
        if (this.entradasalidas[0].tipo != datotipo) {
          this.detalleservice.NuevosDatos(listando, this.file).subscribe(
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
                //reinicia el formulario
                this.formBuilder.reset();
                //this.recargar();
                this.modalService.dismissAll();
                this.recargar();
              }
            },
            (err: any) => {
              this.mensajesService.mensajesSweet(
                "error",
                "Ups... Algo salió mal",
                err
              );
            }
          );
        } else {
          Swal.fire({
            position: "center",
            title: "Debe seleccionar otro tipo de comprobante",
            text: "Dato no valido",
            icon: "warning",
          });
        }
      }
    } else {
      Swal.fire({
        position: "center",
        title: "Datos completos de comprobante",
        text: "Registros completos",
        icon: "warning",
      });
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.file = (target.files as FileList)[0];
    //this.imagen = 'seleccioanda';
    //this.preVisualizarImagen(event);
  }

  recargar() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }
  openModal(content: any) {
    //this.ObtenerSolicitudValeById(this.codigoAsignacion, content);
  }

  validaciones(content: any) {
    if (this.estadoEntrada == 2) {
      if (this.sizeDocs == 2) {
        this.mensajesService.mensajesToast(
          "info",
          "Ya se registraron todos los documentos"
        );
      } else {
        if (this.entradasalidas.length == 0) {
          console.log("entro al if");

          this.select = [
            {
              value: "Comprobante de recibido",
              option: "Comprobante de recibido",
            },
            {
              value: "facturación de consumo de vales",
              option: "facturación de consumo de vales",
            },
          ];
        } else {
          for (let index = 0; index < this.entradasalidas.length; index++) {
            const element = this.entradasalidas[index].tipo;
            if (element == "Comprobante de recibido") {
              this.select = [
                {
                  value: "facturación de consumo de vales",
                  option: "facturación de consumo de vales",
                },
              ];
            } else if (element == "facturación de consumo de vales") {
              this.select = [
                {
                  value: "Comprobante de recibido",
                  option: "Comprobante de recibido",
                },
              ];
            } else if (element == "") {
            }
          }
        }
        this.modalService.open(content, { size: "lx", centered: true });
      }
    } else {
      this.mensajesService.mensajesToast(
        "warning",
        "Vehículo no ha regresado de la misión"
      );
    }
  }

  esCampoValido(campo: string) {
    const validarCampo = this.formBuilder.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? "is-invalid"
      : validarCampo?.touched
      ? "is-valid"
      : "";
  }
  private Iniciarformulario(): FormGroup {
    return this.fb.group({
      id: [""],
      tipo: ["", [Validators.required]],
      fecha: ["", [Validators.required, this.maxDateValidator()]],
      comprobante: ["", [Validators.required]],
      foto: ["", [Validators.required]],
      url: [""],
      solicitudvale: [""],
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

      if (selectedDate > today) {
        return { maxDate: true };
      }

      return null;
    };
  }

  get Listamisiones() {
    return this.detalleservice.listDeMisiones;
  }
  obtenerSolicitud(id: string /* , content: any */) {
    console.log("idSoli: ", id);

    this.detalleservice.getSolicitudVale(id).subscribe({
      next: (data) => {
        this.estadoEntrada = data[0].estadoEntradaSolicitudVale;
        console.log("estadoEntrada: ", this.estadoEntrada);
        // this.validaciones(content);
      },
    });
  }
  obtenerLista(id: string /* , content: any */) {
    //para poder mostrar e la tabla
    console.log("id: ", id);

    this.detalleservice.ObtenerLista(id).subscribe(
      (resp: IDocumentosvale[]) => {
        this.entradasalidas = resp;
        console.log("entradasalida: ", this.entradasalidas);

        this.sizeDocs = resp.length;
        //this.validaciones(content);
      },
      (error) => {
        // Manejar errores aquí
      }
    );
  }
}
