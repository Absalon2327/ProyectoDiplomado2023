import { Proveedor } from "./../../../solicitudes/Interfaces/CompraVale/Proveedor";
import { Component, Input, OnInit } from "@angular/core";
import { IProveedor } from "../../interfaces/proveedor.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-modal-detalle",
  templateUrl: "./modal-detalle.component.html",
  styleUrls: ["./modal-detalle.component.scss"],
})
export class ModalDetalleComponent implements OnInit {
  @Input() proveedor!: IProveedor;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  openModal(content: any) {
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
