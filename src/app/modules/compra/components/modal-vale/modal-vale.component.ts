import { CompraService } from "./../../services/compra.service";
import { Component, Input, OnInit } from "@angular/core";
import { ICompra } from "../../interfaces/compra.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IVale } from "src/app/modules/devolucion-vale/interfaces/vale.interface";

@Component({
  selector: "app-modal-vale",
  templateUrl: "./modal-vale.component.html",
  styleUrls: ["./modal-vale.component.scss"],
})
export class ModalValeComponent implements OnInit {
  @Input() compra!: ICompra;
  listVale: IVale[] = [];
  listValeAux: IVale[] = [];
  listEstado: number[] = [8, 9, 11];
  queryVale!: string;
  valorSeleccionado: number;

  constructor(
    private modalService: NgbModal,
    private compraService: CompraService
  ) {}

  ngOnInit(): void {
    this.getValesPorCompra(this.compra);
  }

  getValesPorCompra(compra: ICompra) {
    this.compraService
      .getValesPorCompra(compra.id)
      .subscribe((vales: IVale[]) => {
        this.listVale = vales;
        this.listValeAux = vales;
      });
  }

  getValesSelect() {
    this.listValeAux = [];
    if (this.valorSeleccionado != null) {
      this.listVale.forEach((x) => {
        if (this.valorSeleccionado == x.estado) {
          this.listValeAux.push(x);
        }
      });
    } else {
      this.listValeAux = this.listVale;
    }
  }

  estadoNombre(estado: number): string {
    if (estado == 8) {
      return "Activo";
    } else if (estado == 5) {
      return "Asignado";
    } else if (estado == 9) {
      return "Inactivo";
    } else if (estado == 11) {
      return "Consumido";
    }
  }

  getClassOf(estado: number) {
    if (estado == 8) {
      return "badge rounded-pill bg-success me-1";
    } else if (estado == 5) {
      return "badge rounded-pill bg-warning me-1";
    } else if (estado == 9) {
      return "badge rounded-pill bg-dark me-1";
    } else if (estado == 11) {
      return "badge rounded-pill bg-info me-1";
    }
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
    return fechaFormateada;
  }

  openModal(content: any, compra: ICompra) {
    this.compra = compra;
    this.queryVale = "";
    this.valorSeleccionado = null;
    this.listValeAux = this.listVale;
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
