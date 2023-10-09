import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {IDocumento, IEmail, IPais, IPasajero, ISolicitudVehiculo} from "../../interfaces/data.interface";
import {SolicitudVehiculoService} from "../../services/solicitud-vehiculo.service";

import {map} from "rxjs/operators";
import Swal from "sweetalert2";
import {MensajesService} from "../../../../shared/global/mensajes.service";
import {IVehiculos} from "../../../vehiculo/interfaces/vehiculo-interface";
import {INTEGER_VALIDATE} from "../../../../constants/constants";
import { Usuario } from 'src/app/account/auth/models/usuario.models';
import {ISolicitudvalep} from "../../../solicitud-vale-paginacion/interface/solicitudvalep.interface";
import {EmailService} from "../../services/email.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() leyenda!: string;
  @Input() estadoSelecionado!: number;
  @Input() soliVeOd!: ISolicitudVehiculo;
  @Input() usuarioActivo !: Usuario;
  @Input() vista!: string;

  private isInteger: string = INTEGER_VALIDATE;
  private isDate: string = "";

  departamentos!: IPais[];
  municipios!: IPais[];
  distritos!: IPais[];
  cantones!: IPais[];

  placas!: IVehiculos[];

  formularioSoliVe!: FormGroup;
  pasajeros: IPasajero[] = [];
  username: string = 'Usuario que inicia';
  mostrarTabla: boolean = true;
  btnVerPdf: boolean = false;
  mostrarArchivoAdjunto: boolean = false;
  cantidadPersonas: number = 0;

  pasajeroFormControls: FormControl[] = [];
  soliSave : ISolicitudVehiculo [] = [];
  file!: File;
  solicitudVale!: ISolicitudvalep;
  isChecked: boolean = false;

  alerts = [
    {
      id: 1,
      type: "info",
      message: " Complete los campos obligatorios (*)",
      show: false,
    },
    {
      id: 2,
      type: "warning",
      message:
        " Tenga en cuenta que una vez almacenada la información no las podrá modificar y serán datos permanentes.",
      show: false,
    },
  ];


  constructor(private modalService: NgbModal, private fb: FormBuilder, private router: Router,
              private soliVeService: SolicitudVehiculoService, public activeModal: NgbActiveModal,
              private mensajesService: MensajesService, private emailService: EmailService
  ) {
    this.solicitudVale = {
      idSolicitudVale: '',
      cantidadVale: 0,
      estadoEntrada: 1,
      estado: 8,
      solicitudVehiculo: '' // Otra inicialización si es necesario
    };
  }

  ngOnInit(): void {
    this.iniciarFormulario();
    this.llenarSelectDepartamentos();
    this.soliVeService.obtenerVehiculos();
    this.detalle(this.leyenda);
  }

  get listVehiculos() {
    return this.soliVeService.listVehiculos;
  }

  detalle(leyenda: string){
    if (leyenda == 'Detalle'){

      const solicitudVehiculo = this.soliVeOd;

      this.formularioSoliVe.get('fechaSolicitud')
        .setValue(this.soliVeOd != null ? this.soliVeOd.fechaSolicitud: '');
      this.formularioSoliVe.get('fechaSalida')
        .setValue(this.soliVeOd != null ? this.soliVeOd.fechaSalida: '');
      this.formularioSoliVe.get('unidadSolicitante')
        .setValue(this.soliVeOd != null ? this.soliVeOd.unidadSolicitante: '');
      this.formularioSoliVe.get('lugarMision')
        .setValue(this.soliVeOd != null ? this.soliVeOd.lugarMision: '');
      this.formularioSoliVe.get('depto')
        .setValue(this.soliVeOd != null ? this.soliVeOd.unidadSolicitante: '');
      this.formularioSoliVe.get('direccionD')
        .setValue(this.soliVeOd != null ? this.soliVeOd.direccion: '');
      this.formularioSoliVe.get('fechaEntrada')
        .setValue(this.soliVeOd != null ? this.soliVeOd.fechaEntrada: '');
      this.formularioSoliVe.get('objetivoMision')
        .setValue(this.soliVeOd != null ? this.soliVeOd.objetivoMision: '');
      this.formularioSoliVe.get('tipoVehiculo')
        .setValue(this.soliVeOd != null ? this.soliVeOd.vehiculo.clase: '');
      this.formularioSoliVe.get('vehiculo')
        .setValue(this.soliVeOd != null ? this.soliVeOd.vehiculo.placa: '');
      this.formularioSoliVe.get('cantidadPersonas')
        .setValue(this.soliVeOd != null ? this.soliVeOd.cantidadPersonas: '');
      this.formularioSoliVe.get('horaSalida')
        .setValue(this.soliVeOd != null ? this.soliVeOd.horaSalida: '');
      this.formularioSoliVe.get('horaEntrada')
        .setValue(this.soliVeOd != null ? this.soliVeOd.horaEntrada: '');
      this.formularioSoliVe.get('solicitante')
        .setValue(this.soliVeOd != null ? this.soliVeOd.solicitante.empleado.nombre+' '
          + this.soliVeOd.solicitante.empleado.apellido: '');

      if (this.soliVeOd.observaciones != null){
        this.formularioSoliVe.get('observaciones')
          .setValue(this.soliVeOd != null ? this.soliVeOd.observaciones: '');
      }

      if(this.soliVeOd.motorista != null){
        this.formularioSoliVe.get('motorista')
          .setValue(this.soliVeOd != null ? this.soliVeOd.motorista.nombre + ' '
            + this.soliVeOd.motorista.apellido: '');
      }


      if (solicitudVehiculo.cantidadPersonas > 5){
        this.mostrarTabla = false;
        this.btnVerPdf = true;
      }
      for (const persona of this.soliVeOd.listaPasajeros) {
        this.pasajeros.push({id: persona.id, nombrePasajero: persona.nombrePasajero});

        const control = new FormControl(this.soliVeOd != null ? persona.nombrePasajero : '');
        this.pasajeroFormControls.push(control);
      }
    }
  }

  async guardar(){
    this.formularioSoliVe.value.unidadSolicitante = this.usuarioActivo.empleado.departamento.nombre;
    const solicitudVehiculo = this.formularioSoliVe.value;

    if (this.formularioSoliVe.valid){
      if (this.soliVeOd != null){
        this.editarSoliVe();
      }else{
        if(this.validarfecha(solicitudVehiculo.fechaSolicitud)){
          if (this.validarfecha(solicitudVehiculo.fechaSalida)){
            if(this.validarfecha(solicitudVehiculo.fechaEntrada)){
              if (solicitudVehiculo.fechaEntrada >= solicitudVehiculo.fechaSalida){
                if (solicitudVehiculo.horaEntrada <= solicitudVehiculo.horaSalida &&
                  solicitudVehiculo.fechaSalida == solicitudVehiculo.fechaEntrada){
                  this.mensajesService.mensajesToast(
                    "warning",
                    "La hora de regreso debe ser mayor a la hora de salida en una misión de un día"
                  );
                }else {
                  if(this.file  != null
                    || solicitudVehiculo.cantidadPersonas < 6){
                    //  vacío para almacenar los datos de los pasajeros
                    const pasajerosData = [];

                    // Recorrer los controles de los pasajeros
                    for (const control of this.pasajeroFormControls) {
                      // Obtener el valor del control
                      const nombrePasajero = control.value;

                      // objeto con el valor del control y un ID vacío
                      const pasajero = { id: '', nombrePasajero };

                      // Agregar el objeto al arreglo de pasajerosData
                      pasajerosData.push(pasajero);
                    }

                    solicitudVehiculo.listaPasajeros = pasajerosData;

                    //console.log("dataPas: ",pasajerosData);

                    // validacion lista de pasajeros
                    const todosLlenos = pasajerosData.every((pasajero) => {
                      const value = pasajero.nombrePasajero;

                      return typeof value === 'string' && value.trim() !== '';


                    });

                    if (!todosLlenos) {
                      this.mensajesService.mensajesToast(
                        "warning",
                        "Por favor, completa todos los nombres de los pasajeros."
                      );
                      // fin validacion de lista de pasajeros
                    } else {
                      // Todos los nombres de los pasajeros están llenos, continuar con el envío de la solicitud.
                      if ((await this.mensajesService.mensajesConfirmar()) == true) {
                        await this.registrarSoliVe();
                      }
                    }
                  } else {
                    this.mensajesService.mensajesToast(
                      "warning",
                      "Debe subir pdf de la lista de pasajeros"
                    );
                  }
                }

              }else{
                this.mensajesService.mensajesToast(
                  "warning",
                  "La fecha de misión  debe ser mayor o igual a la fecha de salida"
                );
              }

            } else {
              this.mensajesService.mensajesToast(
                "warning",
                "Año de fecha de regreso incorrecta"
              );
            }
          } else {
            this.mensajesService.mensajesToast(
              "warning",
              "Año de fecha de misión incorrecta"
            );
          }
        } else {
          this.mensajesService.mensajesToast(
            "warning",
            "Año de fecha de solicitud incorrecta"
          );
        }
      }
    } else {
      // Mostrar nombres de campos inválidos por consola
      /*console.log('Campos inválidos:',
        Object.keys(this.formularioSoliVe.controls).filter((controlName) =>
          this.formularioSoliVe.get(controlName)?.invalid));*/

      this.mensajesService.mensajesToast(
        "warning",
        "Complete los que se indican"
      );
      return Object.values(this.formularioSoliVe.controls).forEach((control) =>
        control.markAsTouched()
      );
    }
  }

  // subir el archivo
  cambioDeArchivo(event: Event) {
    const target = event.target as HTMLInputElement;
    this.file = (target.files as FileList)[0];
  }

  registrarSoliVe() : Promise<void> {
    const solicitudVehiculo = this.formularioSoliVe.value;

    /* para la direccion */
    let nombreDepartamento;
    let nombreMunicipio;
    let nombreDistrito;
    let nombreCanton;

    const codigoDepartamentoSeleccionado = this.formularioSoliVe.get('depto').value;
    const codigoMunicipioSeleccionado = this.formularioSoliVe.get('municipio').value;
    const codigoDistritoSeleccionado = this.formularioSoliVe.get('distrito').value;
    const codigoCantonSeleccionado = this.formularioSoliVe.get('canton').value;

    // Busca el objeto correspondiente al código seleccionado
    const departamentoSeleccionado = this.departamentos.find(
      dpt => dpt.codigo === codigoDepartamentoSeleccionado
    );
    const municipioSeleccionado = this.municipios.find(
      muni => muni.codigo === codigoMunicipioSeleccionado
    );
    const distritoSeleccionado = this.distritos.find(
      dist => dist.codigo === codigoDistritoSeleccionado
    );
    const cantonSeleccionado = this.cantones.find(
      ctn => ctn.codigo === codigoCantonSeleccionado
    );

    if (departamentoSeleccionado) {
      nombreDepartamento = departamentoSeleccionado.nam;
    }
    if (municipioSeleccionado){
      nombreMunicipio = municipioSeleccionado.nam;
    }
    if (distritoSeleccionado){
      nombreDistrito = distritoSeleccionado.nam;
    }
    if (cantonSeleccionado){
      nombreCanton = cantonSeleccionado.nam;
    }

    if (this.isChecked != true){
      solicitudVehiculo.direccion = nombreDepartamento+', '+nombreMunicipio+', '+
        nombreDistrito+', '+nombreCanton;
    }
    /* fin de la direccion */

    // Mostrar SweetAlert de carga
    Swal.fire({
      title: "Espere",
      text: "Realizando la acción...",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
    });

    return new Promise<void> ((resolve, reject) => {
      this.soliVeService.registrarSoliVe(solicitudVehiculo).subscribe({
        next: (resp: any) => {
          this.soliSave = resp;
          Swal.close();

          if (solicitudVehiculo.file != null && solicitudVehiculo.cantidadPersonas > 5) {
            // enviar pdf
            const formData = new FormData();
            let obj = {
              nombreDocumento: '',
              urlDocumento: '',
              tipoDocumento:'Lista de pasajeros',
              fecha: this.obtenerFechaActual(new Date()),
              codigoSolicitudVehiculo: {
                codigoSolicitudVehiculo: resp.codigoSolicitudVehiculo,
              }
            }
            formData.append('archivo', this.file!);
            formData.append('entidad', new Blob([JSON.stringify(obj)], {type: 'application/json'}));

            this.soliVeService.enviarPdfPasajeros(formData).subscribe({
              next: () => {
                //console.log(pdfResp:any);
                this.soliVeService.getSolicitudesVehiculo(this.estadoSelecionado);
                /*Correo*/
                if (this.usuarioActivo.role != ("JEFE_DEPTO" || "JEFE_FINANACIERO" || 'DECANO')){
                  this.enviarEmail(this.usuarioActivo.empleado.departamento.nombre);
                }
                /*Fin correo*/
                this.mensajesService.mensajesToast("success", "Registro agregado");
                this.modalService.dismissAll();
                this.formularioSoliVe.reset();
                resolve();
              },
              error: (pdfError) => {
                Swal.close();
                this.mensajesService.mensajesSweet(
                  'error',
                  'Ups... Algo salió mal al enviar el PDF',
                  pdfError.error.message
                );
                reject(pdfError);
              },
            });
          } else {
            this.soliVeService.getSolicitudesVehiculo(this.estadoSelecionado);
            /*Correo*/
            if (this.usuarioActivo.role != ("JEFE_DEPTO" || "JEFE_FINANACIERO" || 'DECANO')){
              this.enviarEmail(this.usuarioActivo.empleado.departamento.nombre);
            }
            /*Fin correo*/
            this.mensajesService.mensajesToast("success", "Registro agregado");
            this.modalService.dismissAll();
            this.formularioSoliVe.reset();
            resolve();
          }
        },
        error : (err) => {
          // Cerrar SweetAlert de carga
          Swal.close();
          this.mensajesService.mensajesSweet(
            "error",
            "Ups... Algo salió mal al registrar la solicitud",
            err.error.message
          );
          reject(err); // Rechaza la promesa con el error
        },
      });
    });
  }

  editarSoliVe(){}

  cargarPlacas(tipoVehiculo: string, fechaSalida:string, fechaEntrada:string) {
    this.soliVeService.filtroPlacasVehiculo(tipoVehiculo,fechaSalida,fechaEntrada).subscribe(
      (vehiculosData: IVehiculos[]) => {
        if (vehiculosData && vehiculosData.length > 0) {
          this.placas = vehiculosData;
        } else if(tipoVehiculo != '') {
          this.mensajesService.mensajesToast("warning", "En estas fechas, no hay vehiculos disponibles del tipo seleccionado.");
        }
      },
      (error: any) => {
        // console.error('Error al obtener opciones de vehículos desde el backend:', error);
      }
    );
  }


  iniciarFormulario() {
    const unidadSolicitante = this.usuarioActivo?.empleado?.departamento?.nombre || '';
    const fechaActual = this.obtenerFechaActual(new Date()) || '';

    this.formularioSoliVe = this.fb.group({
      fechaSolicitud: [
        fechaActual,
        [
          Validators.required,
          Validators.pattern(this.isDate)
        ]
      ],
      fechaSalida: [
        '',
        [Validators.required]
      ],
      fechaEntrada: [
        '',
        [Validators.required]
      ],
      unidadSolicitante: [
        unidadSolicitante,
        [Validators.required]
      ],
      tipoVehiculo: ['', [Validators.required]],
      vehiculo: ['', [Validators.required]],
      objetivoMision: ['', [Validators.required]],
      lugarMision: ['', [Validators.required]],
      direccion: [null,[]],
      direccionD: [''],
      depto: ['', [Validators.required]],
      municipio: ['', [Validators.required]],
      distrito: ['', [Validators.required]],
      canton: ['', [Validators.required]],
      horaSalida: ['', [Validators.required]],
      horaEntrada: ['', [Validators.required]],
      cantidadPersonas: [
        1,
        [Validators.required, Validators.min(1), Validators.pattern(this.isInteger)]
      ],
      solicitante: [this.usuarioActivo?.codigoUsuario || '', [Validators.required]],
      listaPasajeros: this.fb.array([]),
      file: ['',],
      isChecked: [false],
      observaciones: ['',[]],
      motorista: ['', []]
    });

    this.formularioSoliVe.get('isChecked').valueChanges.subscribe((isChecked) => {

      const depto = this.formularioSoliVe.get('depto');
      const municipio = this.formularioSoliVe.get('municipio');
      const distrito = this.formularioSoliVe.get('distrito');
      const canton = this.formularioSoliVe.get('canton');
      const direccion = this.formularioSoliVe.get('direccion');


      if (isChecked == true) {
        direccion.setValidators([Validators.required]);
        depto.clearValidators();
        municipio.clearValidators();
        distrito.clearValidators();
        canton.clearValidators();
      } else {
        depto.setValidators([Validators.required]);
        municipio.setValidators([Validators.required]);
        distrito.setValidators([Validators.required]);
        canton.setValidators([Validators.required]);
        direccion.clearValidators();
      }

      depto.updateValueAndValidity();
      municipio.updateValueAndValidity();
      distrito.updateValueAndValidity();
      canton.updateValueAndValidity();
      direccion.updateValueAndValidity();
    });
  }


  validarfecha(fecha: string) {
    const inputDate = new Date(fecha);
    return inputDate.getFullYear() > 999 && inputDate.getFullYear() < 10000;
  }

  //// metodo para validar el campo si es valido o no ////
  esCampoValido(campo: string) {
    const validarCampo = this.formularioSoliVe.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? 'is-invalid' : validarCampo?.touched ? 'is-valid' : '';
  }

  obtenerFechaActual(date: Date): string {
    const year = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().
    padStart(2, '0');
    const dia = date.getDate().toString().
    padStart(2, '0');
    return `${year}-${mes}-${dia}`;
  }

  llenarSelectDepartamentos(){
    // Reiniciar las selecciones y opciones para los selectores subsiguientes
    this.formularioSoliVe.get('depto').setValue(null);
    this.formularioSoliVe.get('municipio').setValue(null);
    this.formularioSoliVe.get('distrito').setValue(null);
    this.formularioSoliVe.get('canton').setValue(null);
    this.municipios = [];
    this.distritos = [];
    this.cantones = [];
    this.soliVeService.getDepa()
      .pipe(map((dp) => dp.filter((depa)=> depa.codigo.length === 2)))
      .subscribe((resp) => {
        this.departamentos = this.sortItemsByCodigo(resp);
      });
  }

  /**Cargar municipio segun dpto */
  deptoChange(id: string): void {

    this.formularioSoliVe.get('municipio').setValue(null);
    this.formularioSoliVe.get('distrito').setValue(null);
    this.formularioSoliVe.get('canton').setValue(null);
    this.municipios = [];
    this.distritos = [];
    this.cantones = [];

    // Obtener las opciones correspondientes al departamento seleccionado
    this.soliVeService.getDepa()
      .pipe(map(dp => dp.filter(muni => muni.codigo.startsWith(id) && muni.codigo.length === 4)))
      .subscribe(resp => {
        this.municipios = this.sortItemsByCodigo(resp);
      });
  }

  distChange(id: string): void {
    this.formularioSoliVe.get('distrito').setValue(null);
    this.formularioSoliVe.get('canton').setValue(null);
    this.distritos = [];
    this.cantones = [];

    // Obtener las opciones correspondientes al distrito seleccionado
    this.soliVeService.getDepa()
      .pipe(map(dp => dp.filter(disti => disti.codigo.startsWith(id) && disti.codigo.length === 6)))
      .subscribe(resp => {
        this.distritos = this.sortItemsByCodigo(resp);
      });
  }

  muniChange(id: string): void {
    this.formularioSoliVe.get('canton').setValue(null);
    this.cantones = [];

    // Obtener las opciones correspondientes al municipio seleccionado
    this.soliVeService.getDepa()
      .pipe(map(dp => dp.filter(canton => canton.codigo.startsWith(id) && canton.codigo.length === 8)))
      .subscribe(resp => {
        this.cantones = this.sortItemsByCodigo(resp);
      });
  }

  //metodo para ordenar los datos del json de direcciones
  sortItemsByCodigo(items: any[]): any[] {
    return items.sort((a, b) => a.codigo.localeCompare(b.codigo));
  }


  actualizarFilas() {

    this.cantidadPersonas = this.formularioSoliVe.get('cantidadPersonas').value;
    const pasajerosArray = this.formularioSoliVe.get('listaPasajeros') as FormArray;

    // Calcula cuántas filas deberías tener
    const filasAAgregar = this.cantidadPersonas >= 2 && this.cantidadPersonas <= 5 ? this.cantidadPersonas - 1 : 0;

    if (this.cantidadPersonas <= 5) {
      // Si la cantidad actual es menor o igual a 5, elimina el último input si existe
      if (pasajerosArray.length > filasAAgregar) {
        pasajerosArray.removeAt(pasajerosArray.length - 1);
        this.pasajeroFormControls.pop();
      }

      // Agrega filas adicionales según la cantidad deseada
      while (pasajerosArray.length < filasAAgregar) {
        pasajerosArray.push(this.fb.group({
          id: [''], // Puedes inicializar estos valores como desees
          nombrePasajero: ['']
        }));

        // Agrega un nuevo FormControl al arreglo pasajeroFormControls
        this.pasajeroFormControls.push(new FormControl(''));
      }
    } else {
      // Si la cantidad de personas es mayor a 5, detén la generación de filas
      pasajerosArray.clear();
      this.pasajeroFormControls = [];
    }

    if (this.cantidadPersonas > 5) {
      this.mostrarTabla = false; // Ocultar la tabla
      this.mostrarArchivoAdjunto = true; // Mostrar el campo de entrada de archivo
    } else if (this.cantidadPersonas <= 5 && this.cantidadPersonas >= 2){
      this.mostrarTabla = true; // Mostrar la tabla
      this.mostrarArchivoAdjunto = false; // Ocultar el campo de entrada de archivo
    }
  }

  siMuestraAlertas() {
    return this.alerts.every((alert) => alert.show);
  }
  restaurarAlerts() {
    this.alerts.forEach((alert) => {
      alert.show = true;
    });
  }
  CambiarAlert(alert) {
    alert.show = !alert.show;
  }

  async aprobarSolicitud(){
    if ((await this.mensajesService.mensajeAprobar()) == true) {
      //await this.actualizarSolicitud(data);
      this.soliVeOd.observaciones =  this.formularioSoliVe.get('observaciones').value;
      if (this.usuarioActivo.role=="JEFE_DEPTO"){
        await this.actualizarSolicitud(this.soliVeOd, 'aprobada');
      }else{
        await this.actualizarSolicitudDec(this.soliVeOd);
      }
    }
  }

  async anularSolicitud() {
    if(this.formularioSoliVe.get('observaciones').value == ''){
      this.formularioSoliVe.get('observaciones').setErrors({required:true});
      this.formularioSoliVe.get('observaciones').markAsTouched();
      this.mensajesService.mensajesToast("warning", "Solicitud se requiere campo observaciones");
    } else {
      if (await this.mensajesService.mensajeAnular() == true){
        this.soliVeOd.observaciones =  this.formularioSoliVe.get('observaciones').value;
        this.soliVeOd.estado = 15;
        if (this.usuarioActivo.role == 'ADMIN'){
          await this.actualizarSolicitudAdmin(this.soliVeOd, 'anulada');
        }else{
          await this.actualizarSolicitud(this.soliVeOd, 'anulada');
        }
      }
    }

  }

  actualizarSolicitud(data: any, accion: string ):Promise <void>{
    return new Promise<void>((resolve, reject) => {
      this.soliVeService.updateSolciitudVehiculo(data).subscribe({
        next: () => {
          //resp:any

          this.mensajesService.mensajesToast("success", `Solicitud ${accion} con éxito`);
          this.modalService.dismissAll();
          if (accion == 'anulada'){
            this.enviarEmailAnulacion(data.solicitante.codigoUsuario, data.observaciones);
          }else if(accion=='aprobada'){
            this.enviarEmailSecre('SECR_DECANATO', 'Nueva solicitud de vehículo pendiente',
              'Tiene una nueva solicitud de vehículo pendiente de asignar motorista o verificación de la información.');
          }

          setTimeout(() => {
            this.soliVeService.getSolicitudesRol(this.usuarioActivo.role);
          }, 3025);
          resolve();
        },
        error: (error) => {
          Swal.close();
          this.mensajesService.mensajesSweet(
            'error',
            'Ups... Algo salió mal',
            error.error.message
          );
          reject (error);
        },
      });
    });
  }

  actualizarSolicitudDec(data: any):Promise <void>{
    return new Promise<void>((resolve, reject) => {
      this.soliVeService.updateSolciitudVehiculo(data).subscribe({
        next: () => {
          // resp: any
          this.solicitudVale.cantidadVale =0 ;
          this.solicitudVale.estadoEntrada = 1;
          this.solicitudVale.estado = 8;
          this.solicitudVale.solicitudVehiculo = data.codigoSolicitudVehiculo;

          this.soliVeService.registrarSolicitudVale(this.solicitudVale).subscribe({
            next: () => {
              // valeResp: any
              this.mensajesService.mensajesToast("success", "Solicitud aprobada con éxito");
              this.modalService.dismissAll();
              setTimeout(() => {
                this.soliVeService.getSolicitudesRol(this.usuarioActivo.role);
              }, 3025);
              resolve();
            },
            error: (errorSoli) => {
              Swal.close();
              this.mensajesService.mensajesSweet(
                'error',
                'Ups... Algo salió mal al aprobar la solicitud',
                errorSoli.error.message
              );
              reject (errorSoli);
            },
          })
        },
        error: (error) => {
          Swal.close();
          this.mensajesService.mensajesSweet(
            'error',
            'Ups... Algo salió mal',
            error.error.message
          );
          reject (error);
        },
      });
    });
  }

  actualizarEstadoCheckbox() {
    this.isChecked = this.isChecked == false;
  }

  descargaPdf() {
    const tipoBuscado = "Lista de pasajeros";

    const nombreDocument = this.soliVeOd.listDocumentos.filter((documento:IDocumento) => documento.tipoDocumento === tipoBuscado)
      .map((documento) => documento.nombreDocumento);
    this.soliVeService.obtenerDocumentPdf(nombreDocument)
      .subscribe((resp:any) => {
        let file = new Blob([resp], { type: 'application/pdf' });
        let fileUrl = URL.createObjectURL(file);
        window.open(fileUrl);
      });
  }

  /* administrador */
  async aprobarSolicitudAdministrador(){
    if ((await this.mensajesService.mensajeAprobar()) == true) {
      //await this.actualizarSolicitud(data);
      this.soliVeOd.observaciones =  this.formularioSoliVe.get('observaciones').value;

       if (this.soliVeOd.estado == 1 && this.usuarioActivo.role == 'ADMIN'){
        await this.actualizarSolicitudAdmin(this.soliVeOd, 'aprobada');
      }
    }
  }

  actualizarSolicitudAdmin(data: any, accion: string ):Promise <void>{
    return new Promise<void>((resolve, reject) => {
      this.soliVeService.updateSolciitudVehiculo(data).subscribe({
        next: () => {
          //resp:any

          this.mensajesService.mensajesToast("success", `Solicitud ${accion} con éxito`);
          this.modalService.dismissAll();
          if (accion == 'aprobada'){
            this.enviarEmailSecre('SECR_DECANATO', 'Nueva solicitud de vehículo pendiente',
              'Tiene una nueva solicitud de vehículo pendiente de asignar motorista o verificación de la información.');
          }else if (accion == 'anulada'){
            this.enviarEmailAnulacion(data.solicitante.codigoUsuario, data.observaciones);
          }
          setTimeout(() => {
            this.soliVeService.getSolicitudesVehiculo(1);
          }, 3025);
          resolve();
        },
        error: (error) => {
          Swal.close();
          this.mensajesService.mensajesSweet(
            'error',
            'Ups... Algo salió mal',
            error.error.message
          );
          reject (error);
        },
      });
    });
  }
  /*fin administrador*/


  /*Correo*/
  enviarEmail(departamento: any){
    this.emailService.getCorreoJefeDepto(departamento).subscribe(
      (datos) => {
        const nombreCompletoSolicitante = this.usuarioActivo.empleado.nombre + " "+
          this.usuarioActivo.empleado.apellido;
        const email: IEmail = {
          asunto: 'Solicitud de vehículo pendiente de aprobación',
          titulo: 'Solicitud de vehículo pendiente de aprobación',
          email: datos.correo,
          receptor: "Estimad@ "+datos.nombreCompleto+".",
          mensaje: nombreCompletoSolicitante+" ha realizado una solicitud de vehículo para una misión y esta a la espera de su aprobación.",
          centro: 'Por favor ingrese al sistema para ver más detalles',
          abajo: 'Gracias por su atención a este importante mensaje.\nFeliz día!',
        }
        this.emailService.notificarEmail(email);
      },
      (error) => {
        console.error('Error al obtener el correo:', error);
      }
    );
  }

  enviarEmailAnulacion(id: any, obsevacion: any){
    if (obsevacion ==  null){
      obsevacion = 'SIN NINGUNA OBSERVACIÓN';
    }
    this.emailService.getSolicitante(id).subscribe(
      (datos) => {
        const nombreUserAccion = this.usuarioActivo.empleado.nombre + " "+
          this.usuarioActivo.empleado.apellido;
        const email: IEmail = {
          asunto: 'Solicitud de vehículo ANULADA',
          titulo: 'Solicitud de vehículo ANULADA',
          email: datos.correo,
          receptor: "Estimad@ "+datos.nombreCompleto+".",
          mensaje: "Su solicitud ha sido anulada por "+nombreUserAccion+". "+obsevacion,
          centro: 'Por favor ingrese al sistema para ver más detalles',
          abajo: 'Gracias por su atención a este importante mensaje.\nFeliz día!',
        }
        this.emailService.notificarEmail(email);
      },
      (error) => {
        console.error('Error al obtener el correo:', error);
      }
    );
  }

  enviarEmailSecre(rol: any, titulo: string, mensaje: string){
    this.emailService.getEmailNameRol(rol).subscribe(
      (datos) => {
        const email: IEmail = {
          asunto: titulo,
          titulo: titulo,
          email: datos.correo,
          receptor: "Estimad@ "+datos.nombreCompleto+".",
          mensaje: mensaje,
          centro: 'Por favor ingrese al sistema para ver más detalles',
          abajo: 'Gracias por su atención a este importante mensaje.\nFeliz día!',
        }
        this.emailService.notificarEmail(email);
      },
      (error) => {
        console.error('Error al obtener el correo:', error);
      }
    );
  }

  /* fin correo */

}
