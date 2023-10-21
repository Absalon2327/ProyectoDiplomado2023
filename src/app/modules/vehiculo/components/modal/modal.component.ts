import { Component, Input, OnInit } from "@angular/core";
import { IVehiculos } from "../../interfaces/vehiculo-interface";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MensajesService } from "src/app/shared/global/mensajes.service";
import { INTEGER_VALIDATE, STRING_VALIDATE, TEXTO_CARACTER_ESPECIAL, TEXTO_PLACA } from "src/app/constants/constants";
import { VehiculoService } from "../../service/vehiculo.service";
import { ListarComponent } from "../../pages/listar/listar.component";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
  //entradas
  @Input() leyenda!: string;
  @Input() titulo!: string;
  @Input() objVehiculo!: IVehiculos;

  //mascara
  public customPatterns = {
    'S': { pattern: new RegExp('[A-Za-z]') },
    'A': { pattern: new RegExp('[A-Za-z0-9]') }
  };

  //var
  formVehiculo!: FormGroup;
  private isInteger: string = INTEGER_VALIDATE;
  private isTexto: string = TEXTO_CARACTER_ESPECIAL;
  private isPalabra:string = STRING_VALIDATE;
  private isPlaca:string = TEXTO_PLACA;


  //var para img
  public imgTemp: string | ArrayBuffer = null;
  private file!: File;
  imagen: string = "no hay";

  //para alertas
  alerts = [
    {
      id: 1,
      type: "info",
      message: "Complete los campos obligatorios (*)",
      messageTwo:"Ingrese el número de placa sin guiones",
      show: false,
    }
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private vehiService:VehiculoService,
    private mensajeService: MensajesService,
  ) {
    this.formVehiculo = this.iniciarFormulario();
  }

  ngOnInit(): void {
    this.formVehiculo.patchValue(this.objVehiculo);
  }

  iniciarFormulario(): FormGroup {
    return this.fb.group({
      placa: ['', [Validators.required, Validators.pattern(this.isPlaca)]],
      modelo: ['', [Validators.required]],
      marca: ['', [Validators.required,Validators.pattern(this.isPalabra)]],
      clase: ['', [Validators.required, Validators.pattern(this.isPalabra)]],
      color: ['',[Validators.required, Validators.pattern(this.isTexto)]],
      fecha_tarjeta: ['',[Validators.required, this.fechaVencimientoFormat, this.fechaVencimientoValidator]],
      year: ['',[Validators.required, Validators.pattern(this.isInteger), this.yearValidator]],
      capacidad: ['',[Validators.required, Validators.min(1)]],
      capacidadTanque: ['',[Validators.required, Validators.min(1)]],
      n_chasis: ['',[Validators.required]],
      n_motor: ['', [Validators.required,Validators.minLength(5), Validators.maxLength(10)]],
      tipo_gas: ['Diesel',[Validators.required]],
      file: [null,]
    });
  }

  yearValidator(control: FormControl) {
    const currentYear = new Date().getFullYear();
    const enteredYear = parseInt(control.value, 10);

    if (isNaN(enteredYear) || enteredYear > currentYear || enteredYear < currentYear - 50) {
      return { invalidYear: true };
    }

    return null;
  }

  fechaVencimientoValidator(control: FormControl) {
    const fechaVencimiento = new Date(control.value);
    const fechaActual = new Date();

    if (fechaVencimiento <= fechaActual) {
      return { fechaVencimientoInvalida: true };
    }

    return null;
  }

  fechaVencimientoFormat(control: FormControl) {
    const fechaVencimiento = new Date(control.value);

    if (fechaVencimiento.getFullYear() > 9999) {
      return { fechaVencimientoformat: true };
    }
    return null;
  }

  openModal(content: any) {
    this.modalService.open(content, { size: "xl", centered: true });
  }

  guardar() {
    if (this.formVehiculo.valid) {
      if (this.objVehiculo != null) {
        this.editando();
      } else {
        if(this.file != null){
          this.registrando();
        }else{
          this.mensajeService.mensajesToast("error","La Fotografia del vehiculo es requerida");
        }
      }
    } else {
      this.mensajeService.mensajesToast(
        "warning",
        "Complete lo que se indican"
      );

      return Object.values(this.formVehiculo.controls)
      .forEach((control) => control.markAsTouched());
    }
  }

  onFileSelected(event: Event) {
    const selectedFiles = event.target as HTMLInputElement;
    let imgSelec = (selectedFiles.files as FileList)[0];
    if (!imgSelec.type.startsWith('image/')) {
      this.mensajeService.mensajesToast("warning","Por favor, selecciona solo archivos de imagen en formato .png o .jpg");
      // Limpia la selección
      selectedFiles.value = null;
      return;
    }

    const target = event.target as HTMLInputElement;
    this.file = (target.files as FileList)[0];
    this.imagen = "seleccioanda";
    this.preVisualizarImagen(event);
  }

  esCampoValido(campo: string) {
    const validarCampo = this.formVehiculo.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? 'is-invalid' : validarCampo?.touched ? 'is-valid' : 'form-control';
  }

  registrando(){
    const formData = new FormData();
    let envObj = this.formVehiculo.value;
    envObj.estado = 8;

    formData.append('vehiculo', new Blob([JSON.stringify(envObj)], {type: 'application/json'}));
    formData.append('imagen', this.file!);

    this.vehiService.guardarVehiculo(formData).subscribe( reps => {
      this.mensajeService.mensajesToast("success", "Datos almacenados exitosamente...");
      this.vehiService.getVehiculos();
      //cerrar el modal
      this.modalService.dismissAll();
    }, (err: any) => {
      this.mensajeService.mensajesSweet("error", "Algo salió mal", err.error.message);
    });

  }

  editando(){
    const formData = new FormData();
    let envObj = this.formVehiculo.value;
    envObj.codigoVehiculo = this.objVehiculo.codigoVehiculo;
    envObj.estado = this.objVehiculo.estado;
    envObj.nombrefoto = this.objVehiculo.nombrefoto;
    envObj.urlfoto = this.objVehiculo.urlfoto;

    formData.append('vehiculo', new Blob([JSON.stringify(envObj)], {type: 'application/json'}));
    formData.append('imagen', this.file!);

    this.vehiService.editarVehiculo(formData).subscribe( reps => {
      this.mensajeService.mensajesToast("success", "Registro editado");
      this.vehiService.getVehiculos();
      //cerrar el modal
      this.modalService.dismissAll();
    }, (err: any) => {
      this.mensajeService.mensajesSweet("error", "Algo salió mal", err.error.message);
    });

  }

  preVisualizarImagen(event: any) {
    this.file = event.target.files[0];
    //cambia a imagen previa
    if (!this.file) {
      this.imgTemp = null;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  siMuestraAlertas() {
    return this.alerts.every((alert) => alert.show);
  }

  restaurarAlerts() {
    this.alerts.forEach((alert) => {
      alert.show = true;
    });
  }

  cambiarAlert(alert) {
    alert.show = !alert.show;
  }

}
