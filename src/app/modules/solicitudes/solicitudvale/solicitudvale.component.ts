import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ServiceService } from "../Service/service.service";
import { SolicitudVv } from "../Interfaces/SolicitudVv";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  IExistenciaVales,
  ISolicitudValeID,
} from "../Interfaces/existenciavales.interface";
import { MensajesService } from "src/app/shared/global/mensajes.service";
import Swal from "sweetalert2";
import {
  IAsignacionVale,
  IValesAsignar,
  ICodigoAsignacion,
} from "../Interfaces/asignacionvale.interface";
import { NUMBER_VALIDATE } from "src/app/constants/constants";
import { Router } from "@angular/router";
import {
  ISolcitudAprobar,
  ISolicitudValeAprobar,
} from "../Interfaces/solicitudValeAprobar.interface";

import { UsuarioService } from "src/app/account/auth/services/usuario.service";
import { title } from "process";
import { IEmail } from "src/app/account/auth/interfaces/usuario";

@Component({
  selector: "app-solicitudvale",
  templateUrl: "./solicitudvale.component.html",
  styleUrls: ["./solicitudvale.component.scss"],
})
export class SolicitudvaleComponent implements OnInit {
  items = [
    {
      solicitante: "Erik Manrique Flores",
      mision: "Objetivo 1",
      estado: "Aprobado",
      fechaDeUso: "05-07-2023",
      motorista: "Roberto Nuila Mendoza",
    },
    {
      solicitante: "Erik Manrique Flores",
      mision: "Objetivo 2",
      estado: "Por Aprobar",
      fechaDeUso: "05-07-2023",
      motorista: "Edwin Alvarado Sanchez",
    },
    {
      solicitante: "Erik Manrique Flores",
      mision: "Objetivo 3",
      estado: "En espera",
      fechaDeUso: "05-07-2023",
      motorista: "Erik Manrique Flores",
    },
  ]; // Aquí deberías tener tus datos
  //interfaz para las solicitudes de vale
  solicitudesVales: ISolicitudValeAprobar[];
  searchTerm = "";
  itemsPerPage = 5;
  currentPage = 1;

  busqueda: string = "";
  p: any;

  itemsPerPageVale = 10;
  currentPageVale = 1;
  buscarVale: string = "";
  pVales: any;

  private isNumber: string = NUMBER_VALIDATE;

  storage: Storage = window.localStorage;

  filtroEstado: number;

  solicitud: any[] = [];

  solicitudvv: SolicitudVv[] = [];

  valesAsingar!: IValesAsignar;

  asignacionVale!: IAsignacionVale;

  solcitudVale: SolicitudVv;

  codigoAsignacion: ICodigoAsignacion;

  public paramAsignacion: string = "";

  public paramSolicitudV!: string;

  datosSolicitudV: SolicitudVv[] = [];

  codigoSolicitudVehiculo: string = "";

  codigoSolicitudVale!: ISolicitudValeID;

  searchText: string = "";

  formularioSolicitudVale: FormGroup;
  formularioSolicitudValev: FormGroup;
  existenciaI!: IExistenciaVales;
  term: any; // para buscar

  breadCrumbItems: Array<{}>;
  //para pasar los estados a string
  estadoSoli = "";

  //fecha de Salida
  fechaSalida: string;

  //codigo de la oslicitud de vale
  codigoSolicitudValeAprobar: string;

  observacionesSolicitudVale: string;

  mensajeTabla: string;

  cantidadValesA: number;
  //fecha con formato
  fechaformateada = [];
  constructor(
    private modalService: NgbModal,
    private service: ServiceService,
    public fb: FormBuilder,
    private existenciaService: ServiceService,
    private mensajesService: MensajesService,
    private router: Router,
    private usuarios: UsuarioService
  ) {
    this.iniciarFormulario();
    this.usuarios.getUsuario();
  }

  private iniciarFormulario() {
    this.formularioSolicitudVale = this.fb.group({
      cantidadVales: new FormControl("", [
        Validators.required,
        Validators.pattern(this.isNumber),
      ]),

      fechaSolicitud: new FormControl("", [Validators.required]),
      fechaEntrada: new FormControl("", [Validators.required]),
      fechaSalida: new FormControl("", [Validators.required]),
      mision: new FormControl("", [Validators.required]),
      estado: new FormControl(""),
      motorista: new FormControl("", [Validators.required]),
      solicitante: new FormControl("", [Validators.required]),
      placa: new FormControl("", [Validators.required]),
      cantidadPersonas: new FormControl("", [Validators.required]),
      direccion: new FormControl("", [Validators.required]),
      unidadSolicitante: new FormControl("", [Validators.required]),
      observacionRevision: new FormControl(""),
    });
    this.cantidadValesA =
      this.formularioSolicitudVale.get("cantidadVales")?.value;
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Solicitud de Vales" },
      { label: "Mis Solicitudes", active: true },
    ]; // miga de pan
    this.service.getCliente().subscribe((data: any) => {
      this.solicitudvv = data.content;
    });
    this.obtnerExistenciaVales();
    this.getSolicitudesVale(8);
  }

  Email(asunto: string, titulo: string, mensaje: string, centro: string) {
    const correoUsuario = this.storage.getItem("correo" || "");
    const nombreUsuario = this.storage.getItem("nombre" || "");
    const codUsuario = this.storage.getItem("codUsuario" || "");

    const email: IEmail = {
      asunto: asunto,
      titulo: titulo,
      email: correoUsuario,
      receptor: "Estimad@ : " + nombreUsuario,
      mensaje: mensaje,
      centro: centro,
      codigo: codUsuario,
      abajo: "Gracias por su atención a este importante mensaje.",
    };

    this.usuarios.SendEmail(email).subscribe(
      (resp) => {
        console.log("resp: ", resp);

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

  getSolicitudesVale(estado: number) {
    let alert: any;
    alert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.service.getSolicitdValePorEstado(estado).subscribe({
      next: (data) => {
        this.solicitudesVales = data;
        this.obtenerFechaFormateada(data);
        this.asignacionEstados(estado);
        alert.close();
      },
      error: (err) => {
        this.solicitudesVales = undefined;
        this.mensajeTabla = "No hay datos para mostrar";
        alert.close();
      },
    });
  }

  //Obtniene los vales a asignar según la cantidad deseada
  valesAsignar(valesAsignarModal: any) {
    const cantidadVales =
      this.formularioSolicitudVale.get("cantidadVales")?.value;
    if (cantidadVales == 0) {
      this.mensajesService.mensajesToast(
        "warning",
        "Ingrese una cantidad válida"
      );
    } else {
      let alert: any;
      alert = Swal.fire({
        title: "Espere un momento!",
        html: "Se está procesando la información...",
        didOpen: () => {
          Swal.showLoading();
        },
      });
      this.service.getValesAignar(cantidadVales).subscribe({
        next: (response) => {
          this.valesAsingar = response;
          alert.close();
        },
      });
      this.modalService.open(valesAsignarModal, { size: "lg", centered: true });
    }
  }

  //Obtitne la existencia de los vales
  obtnerExistenciaVales() {
    this.existenciaService.getCantidadVales().subscribe({
      next: (response) => {
        this.existenciaI = response;
      },
    });
  }

  //Liquida los valos y finaliza las solicitudes
  liquidarVales(codigoSolicitudVale: ISolicitudValeAprobar) {
    this.obtenerCodigoAsignacion(codigoSolicitudVale.codigoSolicitudVale);
  }

  //Obtiene el id de la solicitud de vale
  obtenerIdSolicitudVale(codigoSolicitudVehiculo: string) {
    this.service.getIdSolicitudVale(codigoSolicitudVehiculo).subscribe({
      next: (response) => {
        this.codigoSolicitudVale = response;
        this.paramSolicitudV = this.codigoSolicitudVale.codigoSolicitudVale;
        this.obtenerCodigoAsignacion(this.paramSolicitudV);
      },
    });
  }

  //Obtiene el código de asignación
  obtenerCodigoAsignacion(codigoSolitudVale: string) {
    let timerInterval;
    Swal.fire({
      title: "Espere",
      text: "Realizando la acción...",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      timer: 1000,
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
        this.service.getCodigoAsignacion(codigoSolitudVale).subscribe({
          next: (response) => {
            this.codigoAsignacion = response;
            this.paramAsignacion = this.codigoAsignacion.codigoAsignacion;

            this.router.navigate([
              "/asignacion-vale/asignacion",
              this.paramAsignacion,
            ]);
            Swal.close();
            // Resuelve la promesa sin argumentos
          },
          error: (err) => {
            // Cerrar SweetAlert de carga
            Swal.close();
            this.mensajesService.mensajesSweet(
              "error",
              "Ups... Algo salió mal",
              err.error.message
            ); // Rechaza la promesa con el error
          },
        });
      }
    });
    return new Promise<void>((resolve, reject) => {});
  }

  obtenerFechaFormateada(data: any) {
    if (Array.isArray(data) && data.length > 0) {
      //vacio las fechas
      this.vaciarFechas();
      // Accedemos a la propiedad fechaSalida del primer elemento del arreglo
      for (let index = 0; index < data.length; index++) {
        this.fechaSalida = data[index].fechaSalida;

        const fechaf = this.service.obtenerNombreDiaYMes(this.fechaSalida);
        const anio = this.service.dividirFecha(this.fechaSalida);
        const dia = this.service.dividirFecha(this.fechaSalida);
        this.fechaformateada.push(
          fechaf.nombreDia +
            ", " +
            dia.día +
            " de " +
            fechaf.nombreMes +
            " de " +
            anio.anio
        );
      }
      // Por ejemplo, data[0].nombreSolicitante para acceder al nombre del solicitante del primer elemento
    }
  }
  vaciarFechas() {
    while (this.fechaformateada.length > 0) {
      this.fechaformateada.pop();
    }
  }

  asignacionEstados(estado: number) {
    if (estado == 1) {
      this.estadoSoli = "Por Aprobar";
    } else if (estado == 4) {
      this.estadoSoli = "Aprobada";
    } else if (estado == 5) {
      this.estadoSoli = "Asignado";
    } else if (estado == 6) {
      this.estadoSoli = "Revisión";
    } else if (estado == 7) {
      this.estadoSoli = "Finalizada";
    } else if (estado == 8) {
      this.estadoSoli = "Nueva";
    } else {
      this.estadoSoli = "Anulada";
    }
  }

  //Obtiene los datos de la solicitud de vale
  mdAsignarVales(modal: any, solici: ISolicitudValeAprobar) {
    //esto es para obtener el id de la solicitud de vale
    const estadoSolicitud = solici.estadoSolicitud;
    const codSolicitud = solici.codigoSolicitudVale;

    this.codigoSolicitudVehiculo = solici.codigoSolicitudVehiculoS;
    /* if (estadoSolicitud === 4) {
      this.codigoSolicitudVehiculo = solici.codigoSolicitudVehiculoS;
      this.obtenerIdSolicitudVale(this.codigoSolicitudVehiculo);
    } */

    this.modalService.open(modal, { size: "lg", centered: true });

    const fechaSolicitud = this.service.fechaFormatoGenerico(
      solici.fechaSolicitud
    );
    const fechaEntrada = this.service.fechaFormatoGenerico(solici.fechaEntrada);
    const fechaSalida = this.service.fechaFormatoGenerico(solici.fechaSalida);
    const mision = solici.mision;
    const motorista = solici.nombreMotorista;
    const solicitante = solici.nombreSolicitante;
    const placa = solici.placaVehiculo;
    const cantidadPersonas = solici.cantidadPersonas;
    const direccion = solici.direccionMision;
    const unidadSolicitante = solici.unidadSolicitante;
    const cantidadVales = solici.cantidadVales;
    let observacionRevision = solici.observacionesSolicitudVale;
    if (observacionRevision) {
      observacionRevision = solici.observacionesSolicitudVale;
    } else {
      observacionRevision = "";
    }

    //modal de detalle de solicitud de vehiculo
    this.codigoSolicitudValeAprobar = codSolicitud;
    this.formularioSolicitudVale.get("cantidadVales")?.setValue(cantidadVales);
    this.formularioSolicitudVale
      .get("fechaSolicitud")
      ?.setValue(String(fechaSolicitud));
    this.formularioSolicitudVale
      .get("fechaEntrada")
      ?.setValue(String(fechaEntrada));
    this.formularioSolicitudVale
      .get("fechaSalida")
      ?.setValue(String(fechaSalida));
    this.formularioSolicitudVale.get("mision")?.setValue(String(mision));
    this.formularioSolicitudVale.get("motorista")?.setValue(String(motorista));
    this.formularioSolicitudVale
      .get("solicitante")
      ?.setValue(String(solicitante));
    this.formularioSolicitudVale.get("placa")?.setValue(String(placa));
    this.formularioSolicitudVale
      .get("cantidadPersonas")
      ?.setValue(String(cantidadPersonas));
    this.formularioSolicitudVale.get("direccion")?.setValue(String(direccion));
    this.formularioSolicitudVale
      .get("unidadSolicitante")
      ?.setValue(String(unidadSolicitante));
    this.formularioSolicitudVale
      .get("observacionRevision")
      ?.setValue(String(observacionRevision));
  }

  //Guardar la asignación de vales
  async guardar() {
    if (this.formularioSolicitudVale.valid) {
      if (this.estadoSoli == "Nueva" || this.estadoSoli == "Revisión") {
        if ((await this.mensajesService.mensajeSolicitarAprobacion()) == true) {
          // solicitar aprobación
          this.solicitarAprobacion();
        }
      } else {
        if ((await this.mensajesService.mensajeAsignar()) == true) {
          // Guardar
          this.registrando();
        }
      }
    } else {
      this.mensajesService.mensajesToast(
        "warning",
        "Complete los que se indican"
      );
      return Object.values(this.formularioSolicitudVale.controls).forEach(
        (control) => control.markAsTouched()
      );
    }
  }

  //Regitra la asignación de los vales
  registrando() {
    //const usuariosObj = this.usuarios.getUsuario();
    const usuarioJson = JSON.parse(this.storage.getItem("usuario" || ""));
    const empleado =
      usuarioJson.empleado.nombre + " " + usuarioJson.empleado.apellido;
    const cargo = usuarioJson.empleado.cargo.nombreCargo;
    //Asignaré los campos necesario para guardar la asignación
    const cantidadVales =
      this.formularioSolicitudVale.get("cantidadVales")?.value;

    const estadoAsignacion = 8;
    new Date().toLocaleDateString();
    const fechaAsignacion = this.obtenerFechaConFormato();

    const asignarVales: IAsignacionVale = {
      estadoAsignacion: estadoAsignacion,
      fechaAsignacion: fechaAsignacion,
      solicitudVale: this.codigoSolicitudValeAprobar,
      cantidadVales: cantidadVales,
    };

    Swal.fire({
      title: "Espere",
      text: "Realizando la acción...",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
    });
    return new Promise<void>((resolve, reject) => {
      this.service
        .insertar(asignarVales, usuarioJson.codigoUsuario, empleado, cargo)
        .subscribe({
          next: (resp: any) => {
            // Cerrar SweetAlert de carga
            Swal.close();
            this.mostrar();
            this.modalService.dismissAll();
            this.limpiarCampos();
            this.mensajesService.mensajesToast("success", "Vales Asignados");
            resolve(); // Resuelve la promesa sin argumentos
          },
          error: (err) => {
            // Cerrar SweetAlert de carga
            Swal.close();
            this.mensajesService.mensajesSweet(
              "error",
              "Ups... Algo salió mal",
              err.error.message
            );
            reject(err); // Rechaza la promesa con el error
          },
        });
    });
  }

  async solicitarAprobacion() {
    const usuarioLogueado = JSON.parse(this.storage.getItem("usuario" || ""));
    const empleado =
      usuarioLogueado.empleado.nombre + " " + usuarioLogueado.empleado.apellido;
    const cargo = usuarioLogueado.empleado.cargo.nombreCargo;
    //Asignaré los campos necesario para modificar la asignación
    const cantidadVales =
      this.formularioSolicitudVale.get("cantidadVales")?.value;
    this.observacionesSolicitudVale = this.formularioSolicitudVale.get(
      "observacionRevision"
    )?.value;
    const codigoSolicitud = this.paramSolicitudV;
    const estadoSolicitud = 1;
    new Date().toLocaleDateString();
    const fechaAsignacion = this.obtenerFechaConFormato();

    if (cantidadVales > 0) {
      console.log("cantidadVales: ", cantidadVales);

      const solicitud: ISolcitudAprobar = {
        codigoSolicitudVale: this.codigoSolicitudValeAprobar,
        cantidadVales: cantidadVales,
        estadoSolicitudVale: estadoSolicitud,
        observaciones: this.observacionesSolicitudVale,
      };
      let alert: any;
      alert = Swal.fire({
        title: "Espere",
        text: "Realizando la acción...",
        icon: "info",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: false,
        showConfirmButton: false,
      });
      return new Promise<void>((resolve, reject) => {
        this.service.solicitarAprobacion(solicitud, empleado, cargo).subscribe({
          next: (resp: any) => {
            // Cerrar SweetAlert de carga

            this.getSolicitudesVale(8);
            this.modalService.dismissAll();
            this.limpiarCampos();
            this.mensajesService.mensajesToast(
              "success",
              "Enviada para Aprobar"
            );
            this.Email(
              "Solicitar aprobación para la asignación de vales",
              "Solicitud de Vale",
              "Se ha enviado una solicitud de vale para su aprobación",
              "Solicitud de Vale"
            );
            resolve(); // Resuelve la promesa sin argumentos
            alert.close();
          },
          error: (err) => {
            // Cerrar SweetAlert de carga

            this.mensajesService.mensajesSweet(
              "error",
              "Ups... Algo salió mal",
              err.error.message
            );
            reject(err); // Rechaza la promesa con el error
            alert.close();
          },
        });
      });
    } else {
      this.mensajesService.mensajesToast(
        "warning",
        "Debe solicitar al menos un vale"
      );
    }
  }
  limpiarCampos() {
    this.formularioSolicitudVale.reset();
  }

  filtrar(event: any) {
    this.filtroEstado = event;
    this.getSolicitudesVale(this.filtroEstado);
  }

  mostrar() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }
  get paginatedItems() {
    if (!this.searchText) {
      return this.items;
    } else {
      return this.items.filter(
        (item) =>
          item.solicitante
            .toLowerCase()
            .includes(this.searchText.toLowerCase()) ||
          item.mision.toString().includes(this.searchText) ||
          item.estado.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }
  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.solicitudvv
    );
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data: Blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(data, "datos.xlsx");
  }
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.modalService.open(content);
  }

  /**
   * Open center modal
   * @param centerDataModal center modal data
   */
  centerModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { centered: true });
  }

  /**
   * Open scroll modal
   * @param scrollDataModal scroll modal data
   */
  scrollModal(scrollDataModal: any) {
    this.modalService.open(scrollDataModal, { scrollable: true });
  }

  get pageNumbers() {
    return Array(Math.ceil(this.filteredItems.length / this.itemsPerPage))
      .fill(0)
      .map((x, i) => i + 1);
  }

  get filteredItems() {
    return this.items.filter((item) =>
      item.solicitante.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  obtenerFechaConFormato(): string {
    const fecha = new Date();

    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // +1 porque enero es 0
    const día = fecha.getDate().toString().padStart(2, "0");

    const fechaFormateada = `${año}-${mes}-${día}`;

    return fechaFormateada;
  }

  esCampoValido(campo: string) {
    const validarCampo = this.formularioSolicitudVale.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? "is-invalid"
      : validarCampo?.touched
      ? "is-valid"
      : "";
  }
}
