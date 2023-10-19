import { Component, Input, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  IEstados,
  ISolicitudVehiculo,
} from "../../solicitud-vehiculo/interfaces/data.interface";
import { SolicitudVehiculoService } from "../../solicitud-vehiculo/services/solicitud-vehiculo.service";
import { UsuarioService } from "src/app/account/auth/services/usuario.service";
import { ConsultaService } from "../Service/Excel/consulta.service";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { LOGO } from "../Interfaces/logo";
import {
  DocumetSoliC,
  DocumetVale,
  DocumetValeId,
  IConsultaDelAl,
  IdVale,
  LogSoliVehi,
  LogSoliVehiID,
  LogVale,
  Tabla,
  UsuarioDto,
} from "../Interfaces/CompraVale/Consulta";
import { Usuario, Empleado } from "src/app/account/auth/models/usuario.models";
import { MensajesService } from "src/app/shared/global/mensajes.service";
import { DatePipe } from "@angular/common";
import { ICompra } from "../../compra/interfaces/compra.interface";
import { IVale } from "../../devolucion-vale/interfaces/vale.interface";
import { CompraService } from "../../compra/services/compra.service";
import Swal from "sweetalert2";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-solicitante",
  templateUrl: "./solicitante.component.html",
  styleUrls: ["./solicitante.component.scss"],
})
export class SolicitanteComponent implements OnInit {
  solicitudesVehiculo!: ISolicitudVehiculo[];
  solicitudesV!: ISolicitudVehiculo;
  selectedData: any;
  valeDelAl!: IConsultaDelAl[];
  documentSoliCard!: DocumetSoliC[];
  documentVale!: DocumetVale[];
  documentValeId: DocumetValeId[] = [];

  // migas de pan
  breadCrumbItems: Array<{}>;
  term: any; // para buscar
  p: any; // paginacion

  page: number = 0;
  size: number = 10;
  tabla: Tabla;
  usuario: Usuario;
  empleado!: Empleado;
  veri: boolean = false;
  estadoSeleccionado: any;
  estadosSoliVe: IEstados[] = [];
  fechaActual: Date = new Date();
  logSoliVe: LogSoliVehi[];
  estado: string = "";

  compras!: ICompra[];
  queryString!: string;
  compra!: ICompra;
  listVale: IVale[] = [];
  queryVale!: string;

  idVales!: IdVale[];

  constructor(
    private soliVeService: SolicitudVehiculoService,
    private modalService: NgbModal,
    private userService: UsuarioService,
    private consultaService: ConsultaService,
    private mensajesService: MensajesService,
    private datePipe: DatePipe,
    private compraService: CompraService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioActivo();
    this.userService.getUsuario();
    this.breadCrumbItems = [
      { label: "Solicitud de transporte" },
      { label: "Mis Solicitudes / Reportes", active: true },
    ]; // miga de pan
    this.getEstados();
    this.obtenerUsuarioActivo();
  }
  obtenerUsuarioActivo() {
    this.consultaService.getEmpleado().subscribe((usuario) => {
      if (
        usuario.cargo.nombreCargo == "ASISTENTE FINANCIERA" ||
        usuario.cargo.nombreCargo == "JEFE FINANCIERO" ||
        usuario.cargo.nombreCargo == "ADMINISTRADOR"
      ) {
        this.veri = false;
        this.cargarConsulta();
      } else {
        this.veri = true;
      }
    });
  }

  cargarConsulta() {
    this.consultaService.getSolicitudV().subscribe((response) => {
      this.solicitudesVehiculo = response;
    });
  }
  get usuarioActivo() {
    return this.userService.usuario;
  }

  get listSoliVeData() {
    return this.soliVeService.listSoliVehiculo;
  }

  onEstadoSeleccionado(event: any) {
    this.estadoSeleccionado = event.target.value;
    if (this.estadoSeleccionado == 0) {
      this.soliVeService.getSolicitudesVehiculo(null);
    } else {
      this.soliVeService.getSolicitudesVehiculo(this.estadoSeleccionado);
    }
  }

  getEstados() {
    this.soliVeService.obtenerEstados().subscribe((resp) => {
      this.estadosSoliVe = resp;
    });
  }

  calcularNumeroCorrelativo(index: number): number {
    if (typeof this.p === "number") {
      return (this.p - 1) * 10 + index + 1;
    } else {
      return index + 1; // Si no es numérico, solo regresamos el índice + 1
    }
  }
  /**
   * Open Large modal
   * @param largeDataModal large modal data
   */
  DocumentosSoliCard(soliVehi: ISolicitudVehiculo, largeDataModal: any) {
    this.cargarDocSoliCar(soliVehi.codigoSolicitudVehiculo);
    if (soliVehi.cantidadPersonas > 5) {
      this.modalService.open(largeDataModal, { size: "xl", centered: true });
    } else {
      this.mensajesService.mensajesSweet(
        "warning",
        "Ups... ",
        "No hay documentos para mostrar'"
      );
    }
  }
  DocumentosVale(soliVehi: ISolicitudVehiculo, largeDataModal: any) {
    this.cargarDocValeID(soliVehi.codigoSolicitudVehiculo, largeDataModal);
  }
  cargarDocSoliCar(id: string) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.consultaService.getConsultaDocumnetoSoliCa(id).subscribe(
      (response: DocumetSoliC[]) => {
        loadingAlert.close();
        const tipoBuscado = "Lista de pasajeros";
        this.documentSoliCard = response;
      },
      (err) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.mensajesService.mensajesSweet(
          "error",
          "Ups... Algo salió mal",
          err.error.message
        );
      }
    );
  }
  cargarDocValeID(id: string, largeDataModal: any) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.consultaService.getConsultaDocumnetoValeId(id).subscribe(
      (response: DocumetValeId[]) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.cargarDocVale(response[0].idsolicitudvale, largeDataModal);
      },
      (err) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.mensajesService.mensajesSweet(
          "error",
          "Ups... Algo salió mal",
          err.error.message
        );
      }
    );
  }
  cargarDocVale(id: string, largeDataModal: any) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.consultaService.getConsultaDocumnetoVale(id).subscribe(
      (response: DocumetVale[]) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.documentVale = response;
        this.modalService.open(largeDataModal, { size: "xl", centered: true });
      },
      (error) => {
        // Cerrar SweetAlert de carga en caso de error
        loadingAlert.close();

        // Manejar el error de alguna manera, como mostrar un mensaje de error
        this.mensajesService.mensajesSweet(
          "warning",
          "Ups...",
          "No hay documentos para mostrar"
        );
      }
    );
  }
  descargarver(doc: DocumetSoliC) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const tipoBuscado = "Lista de pasajeros";
    this.soliVeService.obtenerDocumentPdf(doc.nombredocment).subscribe(
      (resp: any) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        let file = new Blob([resp], { type: "application/pdf" });
        let fileUrl = URL.createObjectURL(file);
        window.open(fileUrl);
      },
      (err) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.mensajesService.mensajesSweet(
          "info",
          "?...",
          err.error.message
        );
      }
    );
  }
  descarver(doc: DocumetVale) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const nombreDocumento = doc.foto; // Reemplaza con el nombre del documento que desees descargar

    this.consultaService.descargarDocumento(nombreDocumento).subscribe(
      (data: Blob) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        // Crear un objeto URL a partir del Blob
        const url = window.URL.createObjectURL(data);

        // Crear un enlace invisible en el DOM y hacer clic en él para iniciar la descarga
        const a = document.createElement("a");
        a.href = url;
        a.download = nombreDocumento; // Nombre de archivo para la descarga
        document.body.appendChild(a);
        a.click();

        // Liberar el objeto URL
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      (error) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.mensajesService.mensajesSweet(
          "info",
          "?...",
          "Datos almacenados exitosamente.."
        );
      }
    );
  }
  generarPDFLOGsoli(soliVehi: ISolicitudVehiculo) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.consultaService
      .getLogSoliVehi(soliVehi.codigoSolicitudVehiculo)
      .subscribe(
        (response: LogSoliVehi[]) => {
          // Cerrar SweetAlert de carga en caso de error
          loadingAlert.close();
          this.obtenerIDvale(soliVehi, response);
          //   console.log(response);
        },
        (error) => {
          // Cerrar SweetAlert de carga en caso de error
          loadingAlert.close();

          // Manejar el error de alguna manera, como mostrar un mensaje de error
          this.mensajesService.mensajesSweet(
            "error",
            "Ups... Algo salió mal",
            "No hay datos para mostrar"
          );
        }
      );
  }

  obtenerIDvale(soliVehi: ISolicitudVehiculo, response: LogSoliVehi[]) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.consultaService
      .getConsultaDocumnetoValeId(soliVehi.codigoSolicitudVehiculo)
      .subscribe(
        (respon: DocumetValeId[]) => {
          // Cerrar SweetAlert de carga
          loadingAlert.close();
          this.genrarVlogVhi(soliVehi, response, respon);
        },
        (error) => {
          // Cerrar SweetAlert de carga
          loadingAlert.close();
          this.crearPDFLog(response, soliVehi, null);
        }
      );
  }

  genrarVlogVhi(
    soliVehi: ISolicitudVehiculo,
    response: LogSoliVehi[],
    respon: DocumetValeId[]
  ) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.consultaService.getLogSoliVehiID(respon[0].idsolicitudvale).subscribe(
      (res: LogSoliVehiID[]) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.crearPDFLog(response, soliVehi, res);
      },
      (error) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.crearPDFLog(response, soliVehi, null);
      }
    );

  }

  generarPdfLogVale(soliVehi: ISolicitudVehiculo, content: any) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.consultaService
      .getConsultaDocumnetoValeId(soliVehi.codigoSolicitudVehiculo)
      .subscribe(
        (response: DocumetValeId[]) => {
          // Cerrar SweetAlert de carga
          loadingAlert.close();
          this.cargarvales(response[0].idsolicitudvale, content, soliVehi);
        },
        (error) => {
          // Cerrar SweetAlert de carga en caso de error
          loadingAlert.close();

          // Manejar el error de alguna manera, como mostrar un mensaje de error
          this.mensajesService.mensajesSweet(
            "warning",
            "Ups...",
            "No hay datos para mostrar"
          );
        }
      );
    //this.compra = compra;
  }
  cargarvales(id: string, content: any, soliVehi: ISolicitudVehiculo) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.consultaService.getIdVale(id).subscribe(
      (response: IdVale[]) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.cargarCompraVale(
          response,
          response[0].codigocompra,
          content,
          soliVehi
        );
      },
      (error) => {
        // Cerrar SweetAlert de carga en caso de error
        loadingAlert.close();

        // Manejar el error de alguna manera, como mostrar un mensaje de error
        this.mensajesService.mensajesSweet(
          "warning",
          "Ups...",
          "No hay datos para mostrar"
        );
      }
    );
  }
  cargarCompraVale(
    vale: IdVale[],
    id: string,
    content: any,
    soliVehi: ISolicitudVehiculo
  ) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.consultaService.getIdCompraV(id).subscribe(
      (response: ICompra) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();

        this.compra = response;
        this.idVales = vale;
        this.solicitudesV = soliVehi;
        this.queryVale = "";
        const modalOptions = {
          centered: true,
          size: "lg", // 'lg' para modal grande, 'sm' para modal pequeño
          backdrop: "static" as "static",
          keyboard: false, // Configura backdrop como 'static'
          scrollable: true,
        };
        this.modalService.open(content, modalOptions);
      },
      (error) => {
        // Cerrar SweetAlert de carga en caso de error
        loadingAlert.close();

        // Manejar el error de alguna manera, como mostrar un mensaje de error
        this.mensajesService.mensajesSweet(
          "warning",
          "Ups... Algo salió mal",
          "No hay datos para mostrar"
        );
      }
    );
  }
  generarPDFLogVale(
    listVale: IdVale,
    compr: ICompra,
    estado: number,
    soliVehi: ISolicitudVehiculo
  ) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.consultaService.getLogVale(listVale.idvale).subscribe(
      (response: LogVale[]) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.cargarCompra(compr, listVale, estado, response, soliVehi);
      },
      (error) => {
        // Cerrar SweetAlert de carga en caso de error
        loadingAlert.close();

        // Manejar el error de alguna manera, como mostrar un mensaje de error
        this.mensajesService.mensajesSweet(
          "warning",
          "Ups... Algo salió mal",
          "No hay datos para mostrar"
        );
      }
    );
  }
  cargarCompra(
    compr: ICompra,
    vale: IdVale,
    estado: number,
    log: LogVale[],
    soliVehi: ISolicitudVehiculo
  ){
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.consultaService.getIdCompraV(vale.codigocompra).subscribe(
      (response: ICompra) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.crearPDFLogVa(response, vale, estado, log, soliVehi);
      },
      (error) => {
        // Cerrar SweetAlert de carga en caso de error
        loadingAlert.close();
        this.crearPDFLogVa(null, vale, estado, log, soliVehi);
        // Manejar el error de alguna manera, como mostrar un mensaje de error
      }
    );
  }
  crearPDFLogVa(
    compr: ICompra,
    vale: IdVale,
    estado: number,
    log: LogVale[],
    soliVehi: ISolicitudVehiculo
  ) {
    const pdfDefinicionl: any = {
      content: [],
      footer: {
        columns: [
          {
            text:
              "Fecha y hora de impresión: " +
              this.datePipe.transform(
                this.fechaActual,
                "dd/MM/yyyy HH:mm:ss a"
              ) +
              "       .",
            alignment: "right",
          },
        ],
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "black",
        },
      },
    };
    pdfDefinicionl.content.push(
      {
        style: "tableExample",
        table: {
          widths: ["auto", "*"],
          headerRows: 1,
          body: [
            [
              {
                image: LOGO, // Datos base64 de tu imagen .png
                width: 60, // Ancho de la imagen
                height: 80,
              },
              {
                text: "UNIVERSIDAD DE EL SALVADOR\nFACULTAD MULTIDISCIPLINARIA PARACENTRAL\nMOVIMIENTOS DE VALES DE COMBUSTIBLE",
                alignment: "center",
                style: "subheader",
              },
            ],
          ],
        },
        layout: "noBorders",
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Fecha de solicitud: ", bold: true },
              this.formatDate(`${soliVehi.fechaSolicitud}`),
            ],
          },
          {
            text: [
              { text: "Fecha de misión: ", bold: true },
              this.formatDate(`${soliVehi.fechaSalida}`),
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Objetivo de la misión: ", bold: true },
              soliVehi.objetivoMision,
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Lugar de la misión: ", bold: true },
              soliVehi.lugarMision,
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Lugar que visitará: ", bold: true },
              soliVehi.direccion,
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Lugar que visitará: ", bold: true },
              soliVehi.direccion,
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Vehículo: ", bold: true },
              soliVehi.vehiculo.marca +
                ", " +
                soliVehi.vehiculo.modelo +
                ", " +
                soliVehi.vehiculo.clase +
                ", " +
                soliVehi.vehiculo.tipo_gas +
                ", " +
                soliVehi.vehiculo.color +
                ", " +
                soliVehi.vehiculo.year,
            ],
          },
          {
            text: [{ text: "Placa: ", bold: true }, soliVehi.vehiculo.placa],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [{ text: "Proveedor: ", bold: true }, compr.proveedor.nombre],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Fecha de compra: ", bold: true },
              this.datePipe.transform(
                compr.fechaCompra,
                "dd/MM/yyyy HH:mm:ss a"
              ),
            ],
          },
          {
            text: [
              { text: "Fecha de vencimiento: ", bold: true },
              this.datePipe.transform(vale.fechavencimiento, "dd/MM/yyyy"),
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [{ text: "Vale: ", bold: true }, vale.correlativo],
          },
          {
            text: [{ text: "Precio unitario: $ ", bold: true }, vale.valor],
          },
          {
            text: [
              { text: "Estado del vale: ", bold: true },
              this.estadoNombre(estado),
            ],
          },
        ],
      },
      { text: "\n" },
      {
        style: "tableExample",
        table: {
          widths: ["*"],
          headerRows: 1,
          body: [
            [
              {
                text: "LISTA DE MOVIMIENTOS",
                style: "tableHeader",
                alignment: "center",
              },
            ],
            [""],
          ],
        },
        layout: "lightHorizontalLines",
      },
      { text: "\n" }
    );

    const tableRow = [];
    let j = 0;
    tableRow.push([
      { text: "N.", alignment: "center", style: "tableHeader" },
      { text: "ACTIVIDAD", alignment: "center", style: "tableHeader" },
      { text: "FECHA", alignment: "center", style: "tableHeader" },
      { text: "USUARIO", alignment: "center", style: "tableHeader" },
      { text: "ESTADO", alignment: "center", style: "tableHeader" },
    ]);

    for (const persona of log) {
      // console.log(persona.nombrePasajero);
      if (persona.estadovale == 1) {
        this.estado = "En espera por jefe";
      } else if (persona.estadovale == 2) {
        this.estado = "Aprobado por jefe";
      } else if (persona.estadovale == 3) {
        this.estado = "En espera por decano";
      } else if (persona.estadovale == 4) {
        this.estado = "Aprobada";
      } else if (persona.estadovale == 5) {
        this.estado = "Asignado";
      } else if (persona.estadovale == 6) {
        this.estado = "Revisión";
      } else if (persona.estadovale == 7) {
        this.estado = "Finalizada";
      } else if (persona.estadovale == 8) {
        this.estado = "Activo";
      } else if (persona.estadovale == 9) {
        this.estado = "Inactivo";
      } else if (persona.estadovale == 10) {
        this.estado = "Caducado";
      } else if (persona.estadovale == 11) {
        this.estado = "Consumido";
      } else if (persona.estadovale == 12) {
        this.estado = "Devuelto";
      } else if (persona.estadovale == 13) {
        this.estado = "Gasolinera";
      } else if (persona.estadovale == 14) {
        this.estado = "UES";
      } else if (persona.estadovale == 15) {
        this.estado = "Anulada";
      }

      tableRow.push([
        { text: `${j + 1}`, alignment: "center" },
        { text: `${persona.actividad}`, alignment: "center" },
        {
          text: `${this.datePipe.transform(
            persona.fechalogvale,
            "dd/MM/yyyy HH:mm:ss a"
          )}`,
          alignment: "center",
        },
        { text: `${persona.usuario}`, alignment: "center" },
        { text: `${this.estado}`, alignment: "center" },
      ]);
      j++;
    }
    pdfDefinicionl.content.push({
      style: "tableExample",
      table: {
        widths: ["auto", "auto", "auto", "auto", "auto"],
        headerRows: 1,
        body: tableRow,
      },
    });

    pdfMake.createPdf(pdfDefinicionl).open();
  }
  crearPDFLog(
    log: LogSoliVehi[],
    soliVehi: ISolicitudVehiculo,
    logv: LogSoliVehiID[]
  ) {

    const pdfDefinicionl: any = {
      content: [],
      footer: {
        columns: [
          {
            text:
              "Fecha y hora de impresión: " +
              this.datePipe.transform(
                this.fechaActual,
                "dd/MM/yyyy HH:mm:ss a"
              ) +
              "       .",
            alignment: "right",
          },
        ],
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "black",
        },
      },
    };
    pdfDefinicionl.content.push(
      {
        style: "tableExample",
        table: {
          widths: ["auto", "*"],
          headerRows: 1,
          body: [
            [
              {
                image: LOGO, // Datos base64 de tu imagen .png
                width: 60, // Ancho de la imagen
                height: 80,
              },
              {
                text: "UNIVERSIDAD DE EL SALVADOR\nFACULTAD MULTIDISCIPLINARIA PARACENTRAL\nMOVIMIENTOS SOLICITUD DE TRANSPORTE",
                alignment: "center",
                style: "subheader",
              },
            ],
          ],
        },
        layout: "noBorders",
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Fecha de solicitud: ", bold: true },
              this.formatDate(`${soliVehi.fechaSolicitud}`),
            ],
          },
          {
            text: [
              { text: "Fecha de misión: ", bold: true },
              this.formatDate(`${soliVehi.fechaSalida}`),
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Objetivo de la misión: ", bold: true },
              soliVehi.objetivoMision,
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Lugar de la misión: ", bold: true },
              soliVehi.lugarMision,
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Lugar que visitará: ", bold: true },
              soliVehi.direccion,
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Vehículo: ", bold: true },
              soliVehi.vehiculo.marca +
                ", " +
                soliVehi.vehiculo.modelo +
                ", " +
                soliVehi.vehiculo.clase +
                ", " +
                soliVehi.vehiculo.tipo_gas +
                ", " +
                soliVehi.vehiculo.color +
                ", " +
                soliVehi.vehiculo.year,
            ],
          },
          {
            text: [{ text: "Placa: ", bold: true }, soliVehi.vehiculo.placa],
          },
        ],
      },
      {
        style: "tableExample",
        table: {
          widths: ["*"],
          headerRows: 1,
          body: [
            [
              {
                text: "LISTA DE MOVIMIENTOS",
                style: "tableHeader",
                alignment: "center",
              },
            ],
            [""],
          ],
        },
        layout: "lightHorizontalLines",
      },
      { text: "\n" }
    );

    const tableRow = [];
    let j = 0;
    tableRow.push([
      { text: "N.", alignment: "center", style: "tableHeader" },
      { text: "ACTIVIDAD", alignment: "center", style: "tableHeader" },
      { text: "FECHA", alignment: "center", style: "tableHeader" },
      { text: "USUARIO", alignment: "center", style: "tableHeader" },
      { text: "CARGO", alignment: "center", style: "tableHeader" },
      { text: "ESTADO", alignment: "center", style: "tableHeader" },
    ]);
    let estado = "";
    for (const persona of log) {
      // console.log(persona.nombrePasajero);
      if (persona.estadosolive == 1) {
        this.estado = "En espera por jefe";
      } else if (persona.estadosolive == 2) {
        this.estado = "Aprobado por jefe";
      } else if (persona.estadosolive == 3) {
        this.estado = "En espera por decano";
      } else if (persona.estadosolive == 4) {
        this.estado = "Aprobada";
      } else if (persona.estadosolive == 5) {
        this.estado = "Asignado";
      } else if (persona.estadosolive == 6) {
        this.estado = "Revisión";
      } else if (persona.estadosolive == 7) {
        this.estado = "Finalizada";
      } else if (persona.estadosolive == 8) {
        this.estado = "Activo";
      } else if (persona.estadosolive == 9) {
        this.estado = "Inactivo";
      } else if (persona.estadosolive == 10) {
        this.estado = "Caducado";
      } else if (persona.estadosolive == 11) {
        this.estado = "Consumido";
      } else if (persona.estadosolive == 12) {
        this.estado = "Devuelto";
      } else if (persona.estadosolive == 13) {
        this.estado = "Gasolinera";
      } else if (persona.estadosolive == 14) {
        this.estado = "UES";
      } else if (persona.estadosolive == 15) {
        this.estado = "Anulada";
      }
 
      tableRow.push([
        { text: `${j + 1}`, alignment: "center" },
        { text: `${persona.actividad}`, alignment: "center" },
        {
          text: `${this.datePipe.transform(
            persona.fechalogsolive,
            "dd/MM/yyyy HH:mm:ss a"
          )}`,
          alignment: "center",
        },
        { text: `${persona.usuario}`, alignment: "center" },

        { text: `${persona.cargo}`, alignment: "center" },
        { text: `${this.estado}`, alignment: "center" },
      ]);
      j++;
    }
    if (logv != null) {
      for (const persona of logv) {
        // console.log(persona.nombrePasajero);
        if (persona.estadosolive == 1) {
          this.estado = "En espera por jefe";
        } else if (persona.estadosolive == 2) {
          this.estado = "Aprobado por jefe";
        } else if (persona.estadosolive == 3) {
          this.estado = "En espera por decano";
        } else if (persona.estadosolive == 4) {
          this.estado = "Aprobada";
        } else if (persona.estadosolive == 5) {
          this.estado = "Asignado";
        } else if (persona.estadosolive == 6) {
          this.estado = "Revisión";
        } else if (persona.estadosolive == 7) {
          this.estado = "Finalizada";
        } else if (persona.estadosolive == 8) {
          this.estado = "Activo";
        } else if (persona.estadosolive == 9) {
          this.estado = "Inactivo";
        } else if (persona.estadosolive == 10) {
          this.estado = "Caducado";
        } else if (persona.estadosolive == 11) {
          this.estado = "Consumido";
        } else if (persona.estadosolive == 12) {
          this.estado = "Devuelto";
        } else if (persona.estadosolive == 13) {
          this.estado = "Gasolinera";
        } else if (persona.estadosolive == 14) {
          this.estado = "UES";
        } else if (persona.estadosolive == 15) {
          this.estado = "Anulada";
        }
        console.log(this.estado);
        tableRow.push([
          { text: `${j + 1}`, alignment: "center" },
          { text: `${persona.actividad}`, alignment: "center" },
          {
            text: `${this.datePipe.transform(
              persona.fechalogsolive,
              "dd/MM/yyyy HH:mm:ss a"
            )}`,
            alignment: "center",
          },
          { text: `${persona.usuario}`, alignment: "center" },
          { text: `${persona.cargo}`, alignment: "center" },
          { text: `${this.estado}`, alignment: "center" },
        ]);
        j++;
      }
    }
    pdfDefinicionl.content.push({
      style: "tableExample",
      table: {
        widths: ["auto", "auto", "auto", "auto", "auto", "auto"],
        headerRows: 1,
        body: tableRow,
      },
    });

    pdfMake.createPdf(pdfDefinicionl).open();
  }
  async cerarPDF(
    soliVehi: ISolicitudVehiculo,
    vales: IConsultaDelAl[],
    u: UsuarioDto[]
  ) {
    // const decano = await this.consultaService.getDecano();
    // Continúa con cualquier otra lógica después de obtener el valor
    const pdfDefinicion: any = {
      content: [],
      footer: {
        columns: [
          {
            text:
              "Fecha y hora de impresión: " +
              this.datePipe.transform(
                this.fechaActual,
                "dd/MM/yyyy HH:mm:ss a"
              ) +
              "       .",
            alignment: "right",
            fontSize: 11,
          },
        ],
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "black",
        },
      },
    };
    pdfDefinicion.content.push(
      {
        style: "tableExample",
        table: {
          widths: ["auto", "*"],
          headerRows: 1,
          body: [
            [
              {
                image: LOGO, // Datos base64 de tu imagen .png
                width: 60, // Ancho de la imagen
                height: 80,
              },
              {
                text: "UNIVERSIDAD DE EL SALVADOR\nFACULTAD MULTIDISCIPLINARIA PARACENTRAL\nSOLICITUD DE TRANSPORTE",
                alignment: "center",
                style: "subheader",
              },
            ],
          ],
        },
        layout: "noBorders",
      },
      {
        style: "tableExample",
        table: {
          widths: ["*"],
          headerRows: 1,
          body: [
            [
              {
                text: "SOLICITANTE",
                style: "tableHeader",
                alignment: "center",
              },
            ],
            [""],
          ],
        },
        layout: "lightHorizontalLines",
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Fecha de Solicitud: ", bold: true, fontSize: 11 },
              { text: this.formatDate(`${soliVehi.fechaSolicitud}`), fontSize: 11 },
            ],
          },
          {
            text: [
              { text: "Fecha de Misión: ", bold: true, fontSize: 11 },
              { text: this.formatDate(`${soliVehi.fechaSalida}`),fontSize: 11 },
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Unidad solicitante: ", bold: true, fontSize: 11 },
              { text: soliVehi.unidadSolicitante,fontSize: 11 },
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Vehículo: ", bold: true,fontSize: 11 },
              { text: soliVehi.vehiculo.marca +
                ", " +
                soliVehi.vehiculo.modelo +
                ", " +
                soliVehi.vehiculo.clase +
                ", " +
                soliVehi.vehiculo.tipo_gas +
                ", " +
                soliVehi.vehiculo.color +
                ", " +
                soliVehi.vehiculo.year, fontSize: 11 },
            ],
          },
          {
            text: [{ text: "Placa: ", bold: true, fontSize: 11 }, { text: soliVehi.vehiculo.placa,fontSize: 11 },],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Objetivo de la misión: ", bold: true, fontSize: 11 },
              { text: soliVehi.objetivoMision, fontSize: 11 },
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Lugar de la misión: ", bold: true, fontSize: 11 },
              { text: soliVehi.lugarMision, fontSize: 11 },
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Lugar que visitará: ", bold: true,fontSize: 11 },
              { text: soliVehi.direccion,fontSize: 11 },
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "N. de personas que viajan: ", bold: true, fontSize: 11 },
              { text: soliVehi.cantidadPersonas, fontSize: 11 },
            ],
          },
          {
            text: [
              { text: "Hora de salida: ", bold: true, fontSize: 11 },
              { text: soliVehi.horaSalida, fontSize: 11 },
            ],
          },
          {
            text: [
              { text: "Hora de regreso: ", bold: true, fontSize: 11 },
              { text: soliVehi.horaEntrada, fontSize: 11 },
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Nombre del responsable: ", bold: true, fontSize: 11 },
              { text: soliVehi.solicitante.empleado.nombre +
                " " +
                soliVehi.solicitante.empleado.apellido, fontSize: 11 },
            ],
          },
          {
            text: [{ text: "Firma: ", bold: true, fontSize: 11 },],
          },
        ],
      },

      { text: "\n" },
      {
        columns: [
          {
            text: "LISTADO DE PASAJEROS",
            style: "tableHeader",
            alignment: "center",
          },
        ],
      },
      { text: "\n" }
    );

    const tableRow = [];
    let j = 0;
    if (soliVehi.cantidadPersonas < 6) {
      tableRow.push([
        { text: "N.", alignment: "center", style: "tableHeader" },
        { text: "NOMBRE", alignment: "center", style: "tableHeader" },
      ]);
      for (const persona of soliVehi.listaPasajeros) {
        //  console.log(persona.nombrePasajero);
        tableRow.push([
          { text: `${j + 1}`, alignment: "center", fontSize: 11 },
          { text: `${persona.nombrePasajero}`, alignment: "center", fontSize: 11 },
        ]);
        j++;
      }
      pdfDefinicion.content.push(
        {
          style: "tableExample",
          table: {
            widths: ["auto", "*"],
            headerRows: 1,
            body: tableRow,
          },
        },
        { text: "Nota: Si el número de persona es mayor a cuatro, anexar listado", fontSize: 11 },
      );
    } else {
      tableRow.push([
        { text: "", alignment: "center", style: "tableHeader" },
        { text: "", alignment: "center", style: "tableHeader" },
      ]);
      for (const persona of soliVehi.listaPasajeros) {
        //  console.log(persona.nombrePasajero);
        tableRow.push([
          { text: `${j + 1}`, alignment: "center", fontSize: 11 },
          { text: `${persona.nombrePasajero}`, alignment: "center", fontSize: 11 },
        ]);
        j++;
      }
      pdfDefinicion.content.push(
        {
          style: "tableExample",
          table: {
            widths: ["auto", "*"],
            headerRows: 1,
            body: tableRow,
          },
          layout: "noBorders",
        },
        { text: "Nota: Si el número de persona es mayor a cuatro, anexar listado", fontSize: 11 },
      );
    }

    pdfDefinicion.content.push(
      { text: "\n" },
      {
        columns: [
          {
            text: [{ text: "Sello\n", bold: true,fontSize: 11 },],
            alignment: "",
          },
        ],
      },
      {
        style: "tableExample",
        table: {
          widths: ["*"],
          headerRows: 1,
          body: [
            [
              {
                text: "AUTORIZACIÓN",
                style: "tableHeader",
                alignment: "center",
              },
            ],
            [""],
          ],
        },
        layout: "lightHorizontalLines",
      },
      {
        columns: [
          {
            text: [
              { text: "Nombre de motorista: ", bold: true, fontSize: 11 },
              { text: soliVehi.motorista?.nombre + ", " + soliVehi.motorista?.apellido,fontSize: 11 },
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Vehículo: ", bold: true, fontSize: 11 },
              { text: soliVehi.vehiculo.marca +
                ", " +
                soliVehi.vehiculo.modelo +
                ", " +
                soliVehi.vehiculo.clase +
                ", " +
                soliVehi.vehiculo.tipo_gas +
                ", " +
                soliVehi.vehiculo.color +
                ", " +
                soliVehi.vehiculo.year, fontSize: 11 },
            ],
          },
          {
            text: [{ text: "Placa: ", bold: true, fontSize: 11 }, { text: soliVehi.vehiculo.placa, fontSize: 11 },],
          },
        ],
      }
    );
    if (vales != null) {
      pdfDefinicion.content.push(
        { text: "\n" },
        {
          columns: [
            {
              text: [{ text: "N. de vales: ", bold: true, fontSize: 11 }, { text: vales.length, fontSize: 11 },],
            },
            {
              text: [{ text: "Del: ", bold: true, fontSize: 11 }, { text: vales[0].correlativo,  fontSize: 11 },],
            },
            {
              text: [
                { text: "AL: ", bold: true, fontSize: 11 },
                { text: vales[this.valeDelAl.length - 1].correlativo, fontSize: 11 },
              ],
            },
          ],
        }
      );
    } else {
      pdfDefinicion.content.push(
        { text: "\n" },
        {
          columns: [
            {
              text: [{ text: "N. de vales: ", bold: true, fontSize: 11 }, { text: "0", fontSize: 11 },],
            },
            {
              text: [{ text: "Del: ", bold: true, fontSize: 11 }, ""],
            },
            {
              text: [{ text: "AL: ", bold: true, fontSize: 11 }, ""],
            },
          ],
        }
      );
    }
    pdfDefinicion.content.push(
      { text: "\n" },
      {
        columns: [
          {
            text: [{ text: "F.", bold: true, fontSize: 11 },],
          },
          {
            text: [{ text: "Sello", bold: true, fontSize: 11 },],
          },
        ],
      },
      // {text:'\n'},
      {
        columns: [
          {
            text: [
              { text: u[0].usuario, fontSize: 11 },

              { text: "\nNombre y firma Decano", bold: true, fontSize: 11 },
            ],
          },
        ],
      },
      { text: "\n" },
      {
        columns: [
          {
            text: [
              { text: "Observaciones: ", bold: true, fontSize: 11 },
              { text: soliVehi.observaciones, fontSize: 11 },
            ],
          },
        ],
      }
    );
    pdfMake.createPdf(pdfDefinicion).open();
  }

  cargarConsultaValeDelAl(soli: ISolicitudVehiculo) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.consultaService
      .getConsultaSolicitudVDelAl(soli.codigoSolicitudVehiculo)
      .subscribe(
        (response: IConsultaDelAl[]) => {
          // Cerrar SweetAlert de carga
          loadingAlert.close();
          this.valeDelAl = response;
          this.cargarUsuarioDecano(soli, response);
        },
        (error) => {
          // Cerrar SweetAlert de carga
          loadingAlert.close();
          this.cargarUsuarioDecano(soli, null);
        }
      );
  }

  cargarUsuarioDecano(soli: ISolicitudVehiculo, response: IConsultaDelAl[]) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.consultaService
      .getConsuUsuarioDto(soli.fechaSolicitud, soli.fechaEntrada)
      .subscribe(
        (resp: UsuarioDto[]) => {
          // Cerrar SweetAlert de carga
          loadingAlert.close();
          this.cerarPDF(soli, response, resp);
        },
        (err) => {
          // Cerrar SweetAlert de carga
          loadingAlert.close();
        }
      );
  }
  formatoFecha(fecha: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    return fecha.toLocaleDateString(undefined, options);
  }
  fortablapasajeros(soliVehi1: ISolicitudVehiculo) {
    const tableRow = [];
    let j = 0;
    tableRow.push({ i: "N.", codi: "Nombre" });
    for (const persona of soliVehi1.listaPasajeros) {
      //console.log(persona.nombrePasajero);
      tableRow.push({ i: `${j + 1}`, codi: persona.nombrePasajero });
      j++;
    }
  }
  formatDate(fechaStr: string): string {
    // Dividir la cadena en partes
    const partes = fechaStr.split("-");
    if (partes.length !== 3) {
      return "Fecha inválida";
    }

    // Crear una nueva cadena con el formato deseado (dd/MM/yyyy)
    const fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`;
    return fechaFormateada;
  }
  cargarValesD(compras: ICompra, content: any) {
    // this.compra = compras;
    this.getValesPorCompra(compras);
    const modalOptions = {
      centered: true,
      size: "lg", // 'lg' para modal grande, 'sm' para modal pequeño
      backdrop: "static" as "static",
      keyboard: false, // Configura backdrop como 'static'
      scrollable: true,
    };
    this.modalService.open(content, modalOptions);
  }

  getValesPorCompra(compra: ICompra) {
    // Crear una variable para la alerta de carga
    let loadingAlert: any;
    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere",
      text: "Realizando la acción...",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
    });

    this.compraService.getValesPorCompra(compra.id).subscribe(
      (vales: IVale[]) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        // Asignar los vales a la lista
        this.listVale = vales;
      },
      (error) => {
        // Cerrar SweetAlert de carga en caso de error
        loadingAlert.close();
        // Manejar el error de alguna manera, como mostrar un mensaje de error
        this.mensajesService.mensajesSweet(
          "error",
          "Ups... Algo salió mal",
          "Error al cargar los vales"
        );
      }
    );
  }

  estadoNombre(estado: number): string {
    if (estado == 5) {
      return "Asignado";
    } else if (estado == 7) {
      return "Finalizada";
    } else if (estado == 8) {
      return "Activo";
    } else if (estado == 9) {
      return "Inactivo";
    } else if (estado == 10) {
      return "Caducado";
    } else if (estado == 11) {
      return "Consumido";
    } else if (estado == 12) {
      return "Devuelto";
    } else if (estado == 15) {
      return "Anulada";
    }
  }

  getClassOf(estado: number) {
    if (estado == 5) {
      return "badge rounded-pill bg-info";
    } else if (estado == 7) {
      return "badge rounded-pill bg-primary";
    } else if (estado == 8) {
      return "badge rounded-pill bg-success";
    } else if (estado == 9) {
      return "badge rounded-pill bg-danger";
    } else if (estado == 10) {
      return "badge rounded-pill bg-light";
    } else if (estado == 11) {
      return "badge rounded-pill bg-dark";
    } else if (estado == 12) {
      return "badge rounded-pill bg-warning";
    } else if (estado == 15) {
      return "badge rounded-pill bg-secondary";
    }
  }

  openModal(content: any, compra: ICompra) {
    //this.compra = compra;
    this.queryVale = "";
    const modalOptions = {
      centered: true,
      size: "lg", // 'lg' para modal grande, 'sm' para modal pequeño
      backdrop: "static" as "static",
      keyboard: false, // Configura backdrop como 'static'
      scrollable: true,
    };
    this.modalService.open(content, modalOptions);
  }
}
