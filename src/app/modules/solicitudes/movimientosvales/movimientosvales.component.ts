import { Component, OnInit } from "@angular/core";
import { SolicitudVehiculoService } from "../../solicitud-vehiculo/services/solicitud-vehiculo.service";
import { MensajesService } from "src/app/shared/global/mensajes.service";
import { DatePipe } from "@angular/common";
import { UsuarioService } from "src/app/account/auth/services/usuario.service";
import { ConsultaService } from "../Service/Excel/consulta.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Usuario, Empleado } from "src/app/account/auth/models/usuario.models";
import {
  IEstados,
  ISolicitudVehiculo,
} from "../../solicitud-vehiculo/interfaces/data.interface";
import { ICompra } from "../../compra/interfaces/compra.interface";
import { CompraService } from "../../compra/services/compra.service";
import { IVale } from "../../devolucion-vale/interfaces/vale.interface";
import Swal from "sweetalert2";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { LOGO } from "../Interfaces/logo";
import { LogVale } from "../Interfaces/CompraVale/Consulta";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-movimientosvales",
  templateUrl: "./movimientosvales.component.html",
  styleUrls: ["./movimientosvales.component.scss"],
})
export class MovimientosvalesComponent implements OnInit {
  solicitudesVehiculo!: ISolicitudVehiculo[];
  selectedData: any;
  compras!: ICompra[];
  queryString!: string;
  compra!: ICompra;
  listVale: IVale[] = [];
  queryVale!: string;

  offset = 0;

  // term: string = '';

  // migas de pan
  breadCrumbItems: Array<{}>;
  term: any; // para buscar
  p: any; // paginacion

  page: number = 0;
  size: number = 10;
  usuario: Usuario;
  empleado!: Empleado;
  veri: boolean = false;
  estadoSeleccionado: any;
  estadosSoliVe: IEstados[] = [];
  fechaActual: Date = new Date();
  estado: string = "";

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
    // console.log('usuario ',this.usuarioActivo)
    this.userService.getUsuario();
    this.breadCrumbItems = [
      { label: "Compra" },
      { label: "Mostrar", active: true },
    ]; // miga de pan
    // this.soliVeService.getSolicitudesVehiculo(this.estadoSeleccionado);
    this.getEstados();
    this.obtenerUsuarioActivo();
    this.compraService.getCompras();
    // console.log('esta', this.solicitudesVehiculo.)
  }

  get listDatos() {
    return this.compraService.listCompra;
  }
  obtenerUsuarioActivo() {
    // Suscríbete al Observable para obtener el usuario
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

  generarPDFLogVale(listVale: IVale, compr: ICompra, estado: number) {
    this.consultaService
      .getLogVale(listVale.id)
      .subscribe((response: LogVale[]) => {
        this.crearPDFLogVa(compr, listVale, estado, response);
      });
  }

  crearPDFLogVa(compr: ICompra, vale: IVale, estado: number, log: LogVale[]) {
    const pdfDefinicionl: any = {
      content: [],
      footer: {
        columns: [
          {
            text:
              "Fecha y Hora de impresión: " +
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
              { text: "Fecha de Vencimiento: ", bold: true },
              this.datePipe.transform(vale.fechaVencimiento, "dd/MM/yyyy"),
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
            text: [{ text: "Precio Unitario: ", bold: true }, vale.valor],
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
  cargarConsulta() {
    this.consultaService.getCompraMovimientos().subscribe((response) => {
      this.compras = response;
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

  cargarValesD(compras: ICompra, content: any) {
    this.compra = compras;
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
        //  console.log(vales);
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
    this.compra = compra;
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
