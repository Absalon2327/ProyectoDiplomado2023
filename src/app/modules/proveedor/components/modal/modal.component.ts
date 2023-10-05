import { Component, Input, OnInit } from "@angular/core";
import { IProveedor } from "../../interfaces/proveedor.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProveedorService } from "../../services/proveedor.service";
import { MensajesService } from "src/app/shared/global/mensajes.service";
import {
  EMAIL_VALIDATE_GENERAL,
  NAME_STRING_NUMBER_VALIDATE,
  NAME_TILDES_VALIDATE,
} from "src/app/constants/constants";
import Swal from "sweetalert2";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
  @Input() proveedor!: IProveedor;
  @Input() leyenda!: string;

  formularioGeneral: FormGroup;

  private isEmail: string = EMAIL_VALIDATE_GENERAL;
  private isNombre: string = NAME_TILDES_VALIDATE;
  private isProveedor: string = NAME_STRING_NUMBER_VALIDATE;

  alerts = [
    {
      id: 1,
      type: "info",
      message:
        " Seleccione un tipo de proveedor y complete los campos obligatorios (*).",
      show: false,
    },
  ];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private mensajesService: MensajesService
  ) {
    this.formularioGeneral = this.iniciarFormulario();
  }

  ngOnInit(): void {
    if (this.leyenda == "Editar") {
      this.formularioGeneral.patchValue(this.proveedor);
    }
  }

  private iniciarFormulario() {
    return this.fb.group({
      id: [""],
      tipo: ["1", [Validators.required]],
      nombre: [
        "",
        [
          Validators.required,
          Validators.pattern(this.isProveedor),
          Validators.minLength(2),
          Validators.maxLength(200),
        ],
      ],
      encargado: [
        "",
        [Validators.maxLength(200), Validators.pattern(this.isNombre)],
      ],
      telefono: ["", [Validators.required, this.validatePhoneNumber]],
      email: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern(this.isEmail),
        ],
      ],
      direccion: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(750),
        ],
      ],
    });
  }

  async guardar() {
    if (this.formularioGeneral.valid) {
      if (this.proveedor?.id) {
        //Modificar
        this.editando();
      } else {
        // Guardar
        this.registrando();
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

  registrando() {
    const proveedor = this.formularioGeneral.value;
    proveedor.estado = 8;

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

    this.proveedorService.guardar(proveedor).subscribe({
      next: (resp: any) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.proveedorService.getProveedors();
        this.mensajesService.mensajesToast("success", "Registro agregado");
        this.modalService.dismissAll();
        this.limpiarCampos();
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

  editando() {
    const proveedor = this.formularioGeneral.value;
    proveedor.estado = this.proveedor.estado;

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

    this.proveedorService.modificar(proveedor).subscribe({
      next: (resp: any) => {
        // Cerrar SweetAlert de carga
        loadingAlert.close();
        this.proveedorService.getProveedors();
        this.mensajesService.mensajesToast("success", "Registro modificado");
        this.modalService.dismissAll();
        this.limpiarCampos();
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

  validatePhoneNumber(control: any) {
    const phoneNumber = control.value;

    // Verifica si el número comienza con 7, 6 o 2
    if (/^[726][0-9]{7}$/.test(phoneNumber)) {
      return null; // Válido
    } else {
      return { invalidPhoneNumber: true }; // Inválido
    }
  }

  openModal(content: any, proveedor: IProveedor) {
    this.proveedor = proveedor;
    if (this.leyenda != "Editar") {
      this.limpiarCampos();
    }

    const modalOptions = {
      centered: true,
      size: "", // 'lg' para modal grande, 'sm' para modal pequeño
      backdrop: "static" as "static",
      keyboard: false, // Configura backdrop como 'static'
    };
    this.modalService.open(content, modalOptions);
  }
}
