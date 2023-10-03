import { CompraService } from "./../../services/compra.service";
import { Component, Input, OnInit } from "@angular/core";
import { ICompra } from "../../interfaces/compra.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IVale } from "src/app/modules/devolucion-vale/interfaces/vale.interface";
import Swal from "sweetalert2";
import { MensajesService } from "src/app/shared/global/mensajes.service";

@Component({
  selector: "app-modal-vale",
  templateUrl: "./modal-vale.component.html",
  styleUrls: ["./modal-vale.component.scss"],
})
export class ModalValeComponent implements OnInit {
  @Input() compra!: ICompra;
  listVale: IVale[] = [];
  queryVale!: string;

  constructor(
    private modalService: NgbModal,
    private mensajesService: MensajesService,
    private compraService: CompraService
  ) {}

  ngOnInit(): void {
    this.getValesPorCompra(this.compra);
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
