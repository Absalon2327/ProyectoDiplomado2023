import { Component, Input, OnInit } from "@angular/core";
import { ICompra } from "../../interfaces/compra.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CompraService } from "../../services/compra.service";

import { MensajesService } from "src/app/shared/global/mensajes.service";

import Swal from "sweetalert2";
import { IProveedor } from "src/app/modules/proveedor/interfaces/proveedor.interface";
import {
  DECIMAL_VALIDATE,
  INTEGER_VALIDATE,
} from "src/app/constants/constants";
import { UsuarioService } from "src/app/account/auth/services/usuario.service";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
  @Input() compra!: ICompra;
  @Input() leyenda!: string;

  formularioGeneral: FormGroup;

  private isNumber: string = DECIMAL_VALIDATE;
  private isInteger: string = INTEGER_VALIDATE;
  private isDate: string = "";

  codInicio?: number;
  codFin?: number;
  cantidad: number = 0;

  precioUnitario?: number;
  totalCompra: number = 0;

  aplicarReadOnly: boolean = false;

  alerts = [
    {
      id: 1,
      type: "info",
      message: " Complete los campos obligatorios (*).",
      show: false,
    },
    {
      id: 2,
      type: "warning",
      message:
        " Tenga en cuenta que una vez almacenada la información algunas opciones no las podrá modificar y serán datos permanentes.",
      show: false,
    },
  ];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private compraService: CompraService,
    private mensajesService: MensajesService,
    private usuarioService: UsuarioService
  ) {
    this.formularioGeneral = this.iniciarFormulario();
  }

  ngOnInit(): void {
    if (this.leyenda == "Editar") {
      this.codInicio = this.compra.codInicio;
      this.codFin = this.compra.codFin;
      this.precioUnitario = this.compra.precioUnitario;
      this.cantidad = this.compra.cantidad;
      this.totalCompra = this.compra.totalCompra;
      this.aplicarReadOnly = true;
      this.formularioGeneral.patchValue(this.compra);
      this.formularioGeneral.patchValue({
        proveedor: this.compra.proveedor.id,
      });
    }
    this.compraService.getProveedor();
    this.usuarioService.getUsuario();
  }

  private iniciarFormulario() {
    return this.fb.group({
      id: [""],
      factura: [""],
      proveedor: ["", [Validators.required]],
      descripcion: ["", [Validators.required, Validators.minLength(2)]],
      cantidad: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(this.isInteger),
        ],
      ],

      codInicio: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(this.isInteger),
        ],
      ],
      codFin: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(this.isInteger),
        ],
      ],
      fechaCompra: ["", [Validators.required, Validators.pattern(this.isDate)]],
      fechaVencimiento: [
        "",
        [Validators.required, Validators.pattern(this.isDate)],
      ],
      precioUnitario: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(this.isNumber),
        ],
      ],
      totalCompra: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(this.isNumber),
        ],
      ],
    });
  }

  get listProveedor() {
    const proveedores: IProveedor[] = [];

    if (this.leyenda == "Editar") {
      proveedores.push(this.compra.proveedor);
    }

    this.compraService.listProveedor.forEach((x) => {
      if (this.leyenda == "Editar") {
        if (x.estado == 8 && x.id != this.compra.proveedor.id) {
          proveedores.push(x);
        }
      } else {
        if (x.estado == 8) {
          proveedores.push(x);
        }
      }
    });

    return proveedores;
  }

  getcantidad(): void {
    this.codInicio = this.formularioGeneral.get("codInicio").value;
    this.codFin = this.formularioGeneral.get("codFin").value;

    if (isNaN(this.codInicio) || isNaN(this.codFin)) {
      this.cantidad = null;
    } else if (this.codInicio == null || this.codFin == null) {
      this.cantidad = null;
    } else {
      this.cantidad = this.codFin + 1 - this.codInicio;
    }
    this.formularioGeneral.controls["cantidad"].setValue(this.cantidad);
    this.getTotalCompra();
  }

  getTotalCompra(): void {
    this.precioUnitario = this.formularioGeneral.get("precioUnitario").value;
    if (isNaN(this.precioUnitario)) {
      this.totalCompra = null;
    } else if (this.precioUnitario == null) {
      this.totalCompra = null;
    } else {
      this.totalCompra = this.precioUnitario * this.cantidad;
    }
    this.formularioGeneral.controls["totalCompra"].setValue(this.totalCompra);
  }

  validarfecha(fecha: string) {
    const inputDate = new Date(fecha);

    if (inputDate.getFullYear() > 999 && inputDate.getFullYear() < 10000) {
      // La fecha es válida y el año tiene 4 dígitos, puedes continuar
      return true;
    } else {
      return false;
    }
  }

  validarCodigos() {
    const codInicio = this.formularioGeneral.get("codInicio").value;
    const codFin = this.formularioGeneral.get("codFin").value;

    if (codInicio > codFin) {
      // Error
      return false;
    } else {
      return true;
    }
  }

  async guardar() {
    if (this.formularioGeneral.valid) {
      if (this.validarCodigos()) {
        if (
          this.validarfecha(this.formularioGeneral.get("fechaCompra").value)
        ) {
          if (
            this.validarfecha(
              this.formularioGeneral.get("fechaVencimiento").value
            )
          ) {
            if (this.compra?.id) {
              //Modificar
              this.editando();
            } else {
              if ((await this.mensajesService.mensajesConfirmar()) == true) {
                // Guardar
                this.registrando();
              }
            }
          } else {
            this.mensajesService.mensajesToast(
              "warning",
              "Año de fecha de vencimiento incorrecto"
            );
          }
        } else {
          this.mensajesService.mensajesToast(
            "warning",
            "Año de fecha de compra incorrecto"
          );
        }
      } else {
        this.mensajesService.mensajesToast(
          "warning",
          "El código de inicio debe ser inferior al código de fin"
        );
      }
    } else {
      this.mensajesService.mensajesToast(
        "warning",
        "Complete los que se indican"
      );
      return Object.values(this.formularioGeneral.controls).forEach((control) =>
        control.markAsTouched()
      );
    }
  }

  registrando(): Promise<void> {
    const compra = this.formularioGeneral.value;
    const idusuariologueado = this.usuarioService.usuario.codigoUsuario;

    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    return new Promise<void>((resolve, reject) => {
      this.compraService.guardar(compra, idusuariologueado).subscribe({
        next: (resp: any) => {
          // Cerrar SweetAlert de carga
          loadingAlert.close();
          this.compraService.getCompras();
          this.modalService.dismissAll();
          this.limpiarCampos();
          this.mensajesService.mensajesToast("success", "Registro agregado");
          resolve(); // Resuelve la promesa sin argumentos
        },
        error: (err) => {
          // Cerrar SweetAlert de carga
          loadingAlert.close();
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

  editando() {
    const compra = this.formularioGeneral.value;

    // Crear una variable para la alerta de carga
    let loadingAlert: any;

    // Mostrar SweetAlert de carga
    loadingAlert = Swal.fire({
      title: "Espere un momento!",
      html: "Se está procesando la información...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.compraService.modificar(compra).subscribe({
      next: (resp: any) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.compraService.getCompras();
        this.modalService.dismissAll();
        this.limpiarCampos();
        this.mensajesService.mensajesToast("success", "Registro modificado");
      },
      error: (err) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.mensajesService.mensajesSweet(
          "error",
          "Ups... Algo salió mal",
          err.error.message
        );
      },
    });
  }

  esCampoValido(campo: string) {
    const validarCampo = this.formularioGeneral.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? "is-invalid"
      : validarCampo?.touched
      ? "is-valid"
      : "";
  }

  limpiarCampos() {
    this.codInicio = null;
    this.codFin = null;
    this.cantidad = null;
    this.precioUnitario = null;
    this.totalCompra = null;
    this.formularioGeneral.reset();
  }

  getClassOf() {
    if (this.leyenda == "Editar") {
      return "btn btn-info btn-sm btn-rounded boton-cuadrado mx-1";
    } else {
      return "btn-primary";
    }
  }
  getIconsOf() {
    if (this.leyenda == "Editar") {
      return "<i class='mdi mdi-18px mdi-book-edit-outline'></i>";
    } else {
      return "Agregar";
    }
  }

  CambiarAlert(alert) {
    alert.show = !alert.show;
  }

  restaurarAlerts() {
    this.alerts.forEach((alert) => {
      alert.show = true;
    });
  }

  siMuestraAlertas() {
    return this.alerts.every((alert) => alert.show);
  }

  openModal(content: any, compra: ICompra) {
    this.compra = compra;
    if (this.leyenda != "Editar") {
      this.limpiarCampos();
    }

    const modalOptions = {
      centered: true,
      size: "lg", // 'lg' para modal grande, 'sm' para modal pequeño
      backdrop: "static" as "static",
      keyboard: false, // Configura backdrop como 'static'
    };
    this.modalService.open(content, modalOptions);
  }
}
