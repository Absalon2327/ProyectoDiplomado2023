import { ProveedorService } from "./../../services/proveedor.service";
import { Component, OnInit, Input } from "@angular/core";
import { IProveedor } from "../../interfaces/proveedor.interface";
import Swal from "sweetalert2";
import { MensajesService } from "src/app/shared/global/mensajes.service";

@Component({
  selector: "app-tabla",
  templateUrl: "./tabla.component.html",
  styleUrls: ["./tabla.component.scss"],
})
export class TablaComponent implements OnInit {
  @Input() proveedores!: IProveedor[];
  @Input() queryString!: string;
  p: any;

  proveedor: IProveedor;
  cambio: string;

  constructor(
    private proveedorService: ProveedorService,
    private mensajesService: MensajesService
  ) {}

  ngOnInit(): void {}

  cambiarEstado(proveedorED: IProveedor) {
    if (proveedorED.estado == 8) {
      this.cambio = "Inactivo";
    } else {
      this.cambio = "Activo";
    }

    Swal.fire({
      icon: "question",
      title: "¿Cambiar el estado a " + this.cambio + "?",
      showDenyButton: true,
      denyButtonColor: "#2c3136",
      denyButtonText: "No cambiar",
      confirmButtonColor: "#972727",
      confirmButtonText: "Cambiar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedor = proveedorED;
        if (proveedorED.estado == 8) {
          this.proveedor.estado = 9;
          this.cambio = "Inactivo";
        } else {
          this.proveedor.estado = 8;
          this.cambio = "Activo";
        }
        this.proveedorService.modificar(this.proveedor).subscribe(() => {
          this.proveedorService.getProveedors();
          this.mensajesService.mensajesToast("success", "Registro modificado");
        });
      } else if (result.isDenied) {
        this.mensajesService.mensajesToast("info", "Acción Cancelada!");
      }
    });
  }
}
