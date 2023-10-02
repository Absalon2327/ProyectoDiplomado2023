import { CompraService } from './../../services/compra.service';
import { Component, Input, OnInit } from '@angular/core';
import { ICompra } from '../../interfaces/compra.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IVale } from 'src/app/modules/devolucion-vale/interfaces/vale.interface';

@Component({
  selector: 'app-modal-vale',
  templateUrl: './modal-vale.component.html',
  styleUrls: ['./modal-vale.component.scss']
})
export class ModalValeComponent implements OnInit {

  @Input() compra!: ICompra;
  listVale: IVale[] = [];
  queryVale!: string;

  constructor(private modalService: NgbModal, private compraService: CompraService) { }

  ngOnInit(): void {
    this.getValesPorCompra(this.compra);
  }

  getValesPorCompra(compra: ICompra) {
    this.compraService
      .getValesPorCompra(compra.id)
      .subscribe((vales: IVale[]) => {
        this.listVale = vales;
      });
  }

  estadoNombre(estado: number): string{
    if (estado == 5) {
      return "Asignado";
    } else if (estado == 7) {
      return "Finalizada";
    }else if (estado == 8) {
      return "Activo";
    }else if (estado == 9) {
      return "Inactivo";
    }else if (estado == 10) {
      return "Caducado";
    }else if (estado == 11) {
      return "Consumido";
    }else if (estado == 12) {
      return "Devuelto";
    }else if (estado == 15) {
      return "Anulada";
    }
  }

  getClassOf(estado: number) {
    if (estado == 5) {
      return "badge rounded-pill bg-info";
    } else if (estado == 7) {
      return "badge rounded-pill bg-primary";
    }else if (estado == 8) {
      return "badge rounded-pill bg-success";
    }else if (estado == 9) {
      return "badge rounded-pill bg-danger";
    }else if (estado == 10) {
      return "badge rounded-pill bg-light";
    }else if (estado == 11) {
      return "badge rounded-pill bg-dark";
    }else if (estado == 12) {
      return "badge rounded-pill bg-warning";
    }else if (estado == 15) {
      return "badge rounded-pill bg-secondary";
    }
  }


  openModal(content: any, compra: ICompra) {
    this.compra = compra;
    this.queryVale="";
    const modalOptions = {
      centered: true,
      size: "lg", // 'lg' para modal grande, 'sm' para modal pequeño
      backdrop: "static" as "static",
      keyboard: false, // Configura backdrop como 'static'
      scrollable: true
    };
    this.modalService.open(content, modalOptions);
  }

}