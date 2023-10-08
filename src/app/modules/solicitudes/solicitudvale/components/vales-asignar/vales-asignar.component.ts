import { Component, Input, OnInit } from "@angular/core";
import { MensajesService } from "src/app/shared/global/mensajes.service";
import { IValesAsignar } from "../../../Interfaces/asignacionvale.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IValesAsignarPage } from "../../../Interfaces/solicitudValeAprobar.interface";
import { Observable } from "rxjs";
import { DetalleService } from "src/app/modules/asignacion-vales/services/detalle.service";
import Swal from "sweetalert2";
const DEFAULT_PAGE_SIZE = 1;
@Component({
  selector: "app-vales-asignar",
  templateUrl: "./vales-asignar.component.html",
  styleUrls: ["./vales-asignar.component.scss"],
})
export class ValesAsignarComponent implements OnInit {
  valesAsignarData: IValesAsignarPage[];

  total$: Observable<number>;
  vales$: Observable<IValesAsignarPage[]>;

  buscarVale: string = "";
  pVales: any;
  valesAsingar!: IValesAsignar;
  valesAsignarPage: IValesAsignarPage;
  currentPage = DEFAULT_PAGE_SIZE;
  cantVales: number;
  size: number;
  constructor(
    private modalService: NgbModal,
    public detalleService: DetalleService,
    private mensajesService: MensajesService
  ) {
    this.vales$ = detalleService.vales$;
    this.total$ = detalleService.total$;
  }

  @Input() cantidadVales!: any;
  @Input() valesExistentes!: any;
  ngOnInit(): void {}

  valesAsignar(valesAsignarModal: any) {
    const existencia = this.cantidadVales.get("existencia")?.value;
    const cantidadVales = this.cantidadVales.get("cantidadVales")?.value;
    if (cantidadVales == 0) {
      this.mensajesService.mensajesToast(
        "warning",
        "Ingrese una cantidad válida"
      );
    } else if (cantidadVales > existencia) {
      Swal.fire({
        icon: "error",
        title: "Error de Solicitud",
        text: "No hay en existencia la cantidad de vales que desea verificar",
        showCancelButton: false,
        confirmButtonColor: "#972727",
        confirmButtonText: "Aceptar",
        cancelButtonColor: "#2c3136",
        cancelButtonText: "Cancelar",
      });
    } else {
      let alert: any;
      alert = Swal.fire({
        title: "Espere un momento!",
        html: "Se está procesando la información...",
        didOpen: () => {
          Swal.showLoading();
        },
      });
      this.detalleService.getValesAsignar(cantidadVales);

      this.detalleService.getVales(cantidadVales).subscribe((data) => {
        this.valesAsignarData = data;
        alert.close();
      });
      this.modalService.open(valesAsignarModal, { size: "lg", centered: true });
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
}
