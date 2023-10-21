import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DetalleService } from "../../services/detalle.service";
import {
  IAsignacionDetalle,
  IValesADevolver,
} from "../../interfaces/asignacion.interface";
import { TmplAstRecursiveVisitor } from "@angular/compiler";
import Swal from "sweetalert2";
import { MensajesService } from "src/app/shared/global/mensajes.service";
import { Router } from "@angular/router";
import { IValesAsignar } from "../../../solicitudes/Interfaces/asignacionvale.interface";
import { ModalDocumentosComponent } from "../../components/modal-documentos/modal-documentos.component";

@Component({
  selector: "app-tabla-detalle",
  templateUrl: "./tabla-detalle.component.html",
  styleUrls: ["./tabla-detalle.component.scss"],
})
export class TablaDetalleComponent implements OnInit {
  buttonDisabled = true; // Estado del botón
  storage: Storage = window.localStorage;
  valesAsignados: IAsignacionDetalle;

  @ViewChild(ModalDocumentosComponent)
  listaDocumentos: ModalDocumentosComponent;

  busqueda: string = "";
  p: any;
  term: any; // para buscar

  devolucionExito: boolean = false;
  vales = [];
  valesADevoler: IValesADevolver = {
    valesDevueltos: [],
    estadoVales: 8,
  };
  valesLiquid = [];
  constructor(
    private service: DetalleService,
    private http: HttpClient,
    private mensajesService: MensajesService,
    private router: Router
  ) {}
  ngAfterViewInit() {
    this.listDocSize = this.listaDocumentos;
  }
  @Input() codigoAsignacion: string = "";
  @Input() mision: string = "";

  listDocSize: any;

  ngOnInit(): void {
    this.mostrarVales();
  }

  mostrarVales() {
    this.service.getDetalleAsignacionVale(this.codigoAsignacion).subscribe({
      next: (data) => {
        this.valesAsignados = data;
        this.vales = this.valesAsignados.vales;
        this.valesAsignados.vales.forEach((element) => {
          this.valesLiquid.push(element.idVale);
        });
      },
    });
  }

  valesDevolver(vales: any[], vale: string) {
    const todosDesmarcados = vales.every((vale) => !vale.checked);
    this.buttonDisabled = todosDesmarcados;

    if (this.valesADevoler.valesDevueltos.length == 0) {
      this.valesADevoler.valesDevueltos.push(vale);
    } else {
      let valeABuscar: string = vale;
      const valeEncontrado =
        this.valesADevoler.valesDevueltos.indexOf(valeABuscar);
      if (valeEncontrado !== -1) {
        this.valesADevoler.valesDevueltos.splice(valeEncontrado, 1);
      } else {
        this.valesADevoler.valesDevueltos.push(vale);
      }
    }
  }

  async devolverVales() {
    const usuario = JSON.parse(this.storage.getItem("usuario" || ""));
    if ((await this.service.mensajesConfirmarDevolucion()) == true) {
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
        this.service.devolverVales(this.valesADevoler, usuario.codigoUsuario).subscribe({
          next: (data: any) => {
            // Cerrar SweetAlert de carga
            Swal.close();
            this.mostrarVales();
            this.buttonDisabled = true;
            this.vales = this.valesADevoler.valesDevueltos;
            this.mensajesService.mensajesToast("success", "Vales devueltos");
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
  mostrar() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }

  get fechaActual() {
    // Obtiene la fecha actual
    const fechaActual = new Date();

    // Obtiene el año, el mes y el día por separado
    const año = fechaActual.getFullYear();
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0"); // El mes es de 0 a 11, así que sumamos 1
    const dia = fechaActual.getDate().toString().padStart(2, "0");

    // Formatea la fecha en "YYYY-MM-dd"
    const fechaFormateada = `${año}-${mes}-${dia}`;
    //console.log(fechaFormateada);
    return fechaFormateada;
  }
}
