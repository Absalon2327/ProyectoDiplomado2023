import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DetalleService } from "../../services/detalle.service";
import {
  IAsignacionDetalle,
  ILiquidacion,
} from "../../interfaces/asignacion.interface";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { TablaDetalleComponent } from "../tabla-detalle/tabla-detalle.component";
import Swal from "sweetalert2";
import { MensajesService } from "src/app/shared/global/mensajes.service";

@Component({
  selector: "app-encabezado",
  templateUrl: "./encabezado.component.html",
  styleUrls: ["./encabezado.component.scss"],
})
export class EncabezadoComponent implements OnInit {
  detalleAsignacion: IAsignacionDetalle;
  breadCrumbItems: Array<{}>;

  @ViewChild(TablaDetalleComponent) valesLiquidar;

  p: any;
  term: string = "";
  currentPage = 1;
  codigoAsignacion: string;
  liquidacion: ILiquidacion = {
    idAsignacionVale: "",
    valesLiquidar: [],
  };
  arregloVales = [];
  mision: string = "";
  constructor(
    private service: DetalleService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private mensajesService: MensajesService
  ) {}
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Vales" },
      { label: "Asignación de Vales" },
      { label: "Registro de Asignaciones", active: true },
    ];

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.codigoAsignacion = params.get("codigoAsignacion");
    });

    console.log("codigoAsignacion en Líquidar: ", this.codigoAsignacion);

    this.obtnerEncabezado(this.codigoAsignacion);
  }
  ngAfterViewInit() {
    this.liquidacion.idAsignacionVale = this.codigoAsignacion;
    this.liquidacion.valesLiquidar = this.valesLiquidar.valesLiquid;
    console.log("interfaz liquidar:", this.liquidacion);
  }

  obtnerEncabezado(codigoA: string) {
    this.service.getDetalleAsignacionVale(codigoA).subscribe({
      next: (data) => {
        this.detalleAsignacion = data;
        this.mision = this.detalleAsignacion.mision;
        console.log(this.detalleAsignacion);
      },
    });
  }

  volver() {
    this.router.navigate(["/solicitudes/solicitudvale"]);
  }

  async liquidar() {
    if ((await this.service.mensajesConfirmarLiquidacion()) == true) {
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
        this.service.liquidarVales(this.liquidacion).subscribe({
          next: (data: any) => {
            // Cerrar SweetAlert de carga
            Swal.close();
            this.mensajesService.mensajesToast("success", "Misión Finalizada");
            this.router.navigate(["/solicitudes/solicitudvale"]);
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
  }
}
