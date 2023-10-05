import { MensajesService } from "src/app/shared/global/mensajes.service";
import { DatePipe } from "@angular/common";
import { HomeFinancieroService } from "./../../services/home-financiero.service";
import { Component, OnInit } from "@angular/core";
import { Empleado } from "src/app/account/auth/models/usuario.models";
import { ICompra } from "src/app/modules/compra/interfaces/compra.interface";
import Swal from "sweetalert2";

@Component({
  selector: "app-mostrar",
  templateUrl: "./mostrar.component.html",
  styleUrls: ["./mostrar.component.scss"],
})
export class MostrarComponent implements OnInit {
  storage: Storage = window.localStorage;

  listCompra: ICompra[] = [];
  cantidaGenerada: number;
  montoGenerado: number;

  fechaInicio?: string;
  fechaFin?: string;

  texto?: string;

  valesActivos: number;
  ValesAsignados: number;
  soliNuevas: number;
  soliPorAprobar: number;

  //grafica Compra
  chartData: any[] = [];

  constructor(
    private homeFinancieroService: HomeFinancieroService,
    private datePipe: DatePipe,
    private mensajesService: MensajesService
  ) {}

  ngOnInit(): void {
    this.cargarComprasPorRangoDeFechas();
    this.getcatidadValesPorEstado();
    this.getcatidadSolicitudesPorEstado();
    this.texto = "Este Mes";
  }

  formatDate(date: string): string {
    const fecha = new Date(date);
    return this.datePipe.transform(fecha, "dd/MM/yyyy") || "";
  }

  formatDateCompleto(date: string): string {
    const fecha = new Date(date);
    return this.datePipe.transform(fecha, "dd/MM/yy HH:mm") || "";
  }

  get empleado(): Empleado | null {
    const usuarioString = this.storage.getItem("usuario");
    if (usuarioString) {
      const usuarioObj = JSON.parse(usuarioString);
      return usuarioObj.empleado;
    }
    return null;
  }

  get fotoempleado(): string | null {
    const foto = this.storage.getItem("empleadoFoto");
    if (foto) {
      return foto;
    }
    return "./../../../assets/images/Default-Avatar.png";
  }

  mostrarEsteMes() {
    this.cargarComprasPorRangoDeFechas();
    this.texto = "Este Mes";
  }

  cargarComprasPorRangoDeFechas(
    fechaInicial: string = "",
    fechaFinal: string = ""
  ) {
    // Define las fechas que deseas consultar
    this.homeFinancieroService
      .getListarPorRangoDeFechas(fechaInicial, fechaFinal)
      .subscribe((compras: ICompra[]) => {
        this.listCompra = compras;
        this.graficar();
        this.montoGenerado = this.cantidaGenerada = 0;
        this.listCompra.forEach((x) => {
          this.montoGenerado += x.totalCompra;
        });
        this.cantidaGenerada = this.listCompra.length;
      });
  }

  async mostrarIntervaloFechas() {
    const { value: formValues, dismiss } = await Swal.fire({
      title: "Selecciona un intervalo de fechas",
      confirmButtonColor: "#972727",
      confirmButtonText: "Generar",
      html:
        '<input type="date" id="swal-input1" class="swal2-input">' +
        '<input type="date" id="swal-input2" class="swal2-input">',
      focusConfirm: false,
      preConfirm: () => {
        const fechaInicio = (<HTMLInputElement>(
          document.querySelector("#swal-input1")
        )).value;
        const fechaFin = (<HTMLInputElement>(
          document.querySelector("#swal-input2")
        )).value;

        return [fechaInicio, fechaFin];
      },
    });
    if (
      dismiss === Swal.DismissReason.esc ||
      dismiss === Swal.DismissReason.close ||
      dismiss === Swal.DismissReason.backdrop
    ) {
      // El usuario cerró la ventana modal sin confirmar los valores
      return;
    }
    if (
      formValues &&
      formValues[0] &&
      formValues[1] &&
      formValues[0] < formValues[1]
    ) {
      this.fechaInicio = formValues[0];
      this.fechaFin = formValues[1];
      this.cargarComprasPorRangoDeFechas(this.fechaInicio, this.fechaFin);
      this.texto =
        "Intervalo del " +
        this.formatDate(this.fechaInicio) +
        " Al " +
        this.formatDate(this.fechaFin);
    } else if (formValues[0] > formValues[1]) {
      this.mensajesService.mensajesToast(
        "warning",
        "Fecha inicio superior a la fecha fin."
      );
    } else {
      this.mensajesService.mensajesToast(
        "warning",
        "Debe seleccionar ambas fechas."
      );
    }
  }

  graficar() {
    this.chartData = this.listCompra.map((compra) => ({
      data: [compra.totalCompra],
      label: this.formatDateCompleto(compra.fechaCompra),
    }));
  }

  getcatidadValesPorEstado() {
    this.homeFinancieroService
      .getCantidadValesPorEstado(8)
      .subscribe((cantidad: number) => {
        this.valesActivos = cantidad;
      });
    this.homeFinancieroService
      .getCantidadValesPorEstado(5)
      .subscribe((cantidad: number) => {
        this.ValesAsignados = cantidad;
      });
  }

  getcatidadSolicitudesPorEstado() {
    this.homeFinancieroService
      .getCantidadSolicitudesPorEstado(8)
      .subscribe((cantidad: number) => {
        this.soliNuevas = cantidad;
      });
    this.homeFinancieroService
      .getCantidadSolicitudesPorEstado(1)
      .subscribe((cantidad: number) => {
        this.soliPorAprobar = cantidad;
      });
  }
}
