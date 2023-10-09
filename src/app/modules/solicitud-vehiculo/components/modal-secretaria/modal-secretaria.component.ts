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
import {IDocumento, IDocumentoSoliVe, IMotorista, IPais, IPasajero, ISolicitudVehiculo} from "../../interfaces/data.interface";
import {SolicitudVehiculoService} from "../../services/solicitud-vehiculo.service";

import {map} from "rxjs/operators";
import Swal from "sweetalert2";
import {MensajesService} from "../../../../shared/global/mensajes.service";
import {IVehiculos} from "../../../vehiculo/interfaces/vehiculo-interface";
import {INTEGER_VALIDATE} from "../../../../constants/constants";
import { Usuario } from 'src/app/account/auth/models/usuario.models';
import { log } from 'console';
import {ISolicitudvalep} from "../../../solicitud-vale-paginacion/interface/solicitudvalep.interface";

@Component({
  selector: 'app-modal-secretaria',
  templateUrl: './modal-secretaria.component.html',
  styleUrls: ['./modal-secretaria.component.scss']
})
export class ModalSecretariaComponent implements OnInit {

  @Input() leyenda!: string;
  @Input() estadoSelecionado!: number;
  @Input() soliVeOd!: ISolicitudVehiculo;
  @Input() usuarioActivo !: Usuario;
  solicitudVale!: ISolicitudvalep;

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
  isChecked: boolean = false;

  pasajeroFormControls: FormControl[] = [];
  soliSave : ISolicitudVehiculo [] = [];
  file!: File;
  fileAcuerdo!: File;
  documentoSoliVe: IDocumentoSoliVe [] = [];

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
              private mensajesService: MensajesService,
  ) { }

  ngOnInit(): void {
    //console.log(this.usuarioActivo);
    //console.log("data",this.soliVeOd);
    this.iniciarFormulario();
    this.llenarSelectDepartamentos();
    this.soliVeService.obtenerVehiculos();
    this.soliVeService.obtenerMotoristas();
    this.detalle(this.leyenda);
  }

  get listVehiculos() {
    return this.soliVeService.listVehiculos;
  }

  get listMotoristas(){
    return this.soliVeService.listMotorista;
  }

  detalle(leyenda: string){
    if (leyenda == 'Edicion' || leyenda == 'Detalle'){

      const solicitudVehiculo = this.soliVeOd;

      const cadena = this.soliVeOd.direccion;
      const partes:string[] = cadena.split(', ');

      this.formularioSoliVe.get('fechaSolicitud')
        .setValue(this.soliVeOd != null ? this.soliVeOd.fechaSolicitud: '');
      this.formularioSoliVe.get('fechaSalida')
        .setValue(this.soliVeOd != null ? this.soliVeOd.fechaSalida: '');
      this.formularioSoliVe.get('unidadSolicitante')
        .setValue(this.soliVeOd != null ? this.soliVeOd.unidadSolicitante: '');
      this.formularioSoliVe.get('lugarMision')
        .setValue(this.soliVeOd != null ? this.soliVeOd.lugarMision: '');
      this.formularioSoliVe.get('depto')
        .setValue(this.soliVeOd != null ? partes[0].toLocaleUpperCase(): '');
      this.formularioSoliVe.get('direccion')
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
      // por estado revision

      if(this.soliVeOd.motorista != null){
        this.formularioSoliVe.get('motorista')
          .setValue(this.soliVeOd != null ? this.soliVeOd.motorista.nombre + ' '
            + this.soliVeOd.motorista.apellido: '');
      }
      if (this.soliVeOd.observaciones != null){
        this.formularioSoliVe.get('observaciones')
          .setValue(this.soliVeOd != null ? this.soliVeOd.observaciones: '');
      }

      if (solicitudVehiculo.cantidadPersonas > 5){
        this.mostrarTabla = false;
        this.btnVerPdf = true;
      }else if (solicitudVehiculo.cantidadPersonas==1){
        this.mostrarTabla = false;
      }


      for (const persona of this.soliVeOd.listaPasajeros) {
        //console.log(persona);
        this.pasajeros.push({id: persona.id, nombrePasajero: persona.nombrePasajero});

        const control = new FormControl(this.soliVeOd != null ? persona.nombrePasajero : '');
        this.pasajeroFormControls.push(control);
      }

      console.log(this.pasajeros);

    }
  }

  async guardar(){
    //this.formularioSoliVe.value.unidadSolicitante = this.usuarioActivo.empleado.departamento.nombre;

    const solicitudVehiculo = this.formularioSoliVe.value;
    console.log("formularo: ",this.formularioSoliVe);
    if (this.formularioSoliVe.valid){
      if(this.validarfecha(solicitudVehiculo.fechaSolicitud)){
        if (this.validarfecha(solicitudVehiculo.fechaSalida)){
          if(this.validarfecha(solicitudVehiculo.fechaEntrada)){
            if((solicitudVehiculo.cantidadPersonas == this.soliVeOd.cantidadPersonas
                || this.file != null) ||
              (solicitudVehiculo.cantidadPersonas < 6)){
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

                if (typeof value === 'string' && value.trim() !== '') {
                  return true;
                }
                return false;
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
                  this.registrarSoliVe();
                }
              }
            } else {
              this.mensajesService.mensajesToast(
                "warning",
                "Debe subir pdf de la lista de pasajeros"
              );
            }
          } else {
            this.mensajesService.mensajesToast(
              "warning",
              "Año de fecha de regreso incorrecta");
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
    } else {
      // Mostrar nombres de campos inválidos por consola
      console.log('Campos inválidos:',
        Object.keys(this.formularioSoliVe.controls).filter((controlName) =>
          this.formularioSoliVe.get(controlName)?.invalid));

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
    solicitudVehiculo.codigoSolicitudVehiculo = this.soliVeOd.codigoSolicitudVehiculo;
    //solicitudVehiculo.motorista = this.soliVeOd.motorista.codigoEmpleado;
    solicitudVehiculo.solicitante = this.soliVeOd.solicitante.codigoUsuario;
    solicitudVehiculo.nombreJefeDepto = this.soliVeOd.nombreJefeDepto;
    let nombreMotoristaExistente;
    if(this.soliVeOd.motorista != null) {
      nombreMotoristaExistente =  this.soliVeOd.motorista.nombre + ' ' +
        this.soliVeOd.motorista.apellido;

      if (nombreMotoristaExistente.toString() == this.formularioSoliVe.get('motorista').value){
        console.log("entro al if motorista");
        solicitudVehiculo.motorista = this.soliVeOd.motorista.codigoEmpleado;
      }
    }

    if(this.soliVeOd.vehiculo.placa == this.formularioSoliVe.get('vehiculo').value){
      console.log("entro al if vehiculo");
      solicitudVehiculo.vehiculo = this.soliVeOd.vehiculo.codigoVehiculo;
    }

    console.log("vehiculo",solicitudVehiculo.vehiculo);
    console.log("motorista", solicitudVehiculo.motorista);
    const tipoBuscado = "Lista de pasajeros";
    const documentosFiltrados = this.soliVeOd.listDocumentos.filter((documento) => {
      return documento.tipoDocumento === tipoBuscado;
    });
    console.log(documentosFiltrados);


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

    solicitudVehiculo.direccion = this.soliVeOd.direccion;
    // solicitudVehiculo.direccion = nombreDepartamento+', '+nombreMunicipio+', '+
    //   nombreDistrito+', '+nombreCanton;
    /* fin de la direccion */

    // Mostrar SweetAlert de carga
    const loadingAlert = Swal.fire({
      title: "Espere",
      text: "Realizando la acción...",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
    });

    //console.log(solicitudVehiculo);
    return new Promise<void> ((resolve, reject) => {
      this.soliVeService.updateSolicitudVehiculo(solicitudVehiculo).subscribe({
        next: (resp: any) => {
          this.soliSave = resp;
          Swal.close();
          if (solicitudVehiculo.cantidadPersonas != this.soliVeOd.cantidadPersonas && this.file != null) {
            // enviar pdf
            const formData = new FormData();
            let obj = {
              codigoDocumento:documentosFiltrados[0].codigoDocumento,
              nombreDocumento:documentosFiltrados[0].nombreDocumento,
              urlDocumento:documentosFiltrados[0].urlDocumento,
              tipoDocumento:'Lista de pasajeros',
              fecha: this.obtenerFechaActual(new Date()),
              codigoSolicitudVehiculo: {
                codigoSolicitudVehiculo: resp.codigoSolicitudVehiculo,
              }
            }
            formData.append('archivo', this.file!);
            formData.append('entidad', new Blob([JSON.stringify(obj)], {type: 'application/json'}));

            this.soliVeService.enviarPdfPasajeros(formData).subscribe({
              next: (pdfResp: any) => {
                //console.log(pdfResp);
                if (this.usuarioActivo.role == 'ADMIN'){
                  this.soliVeService.getSolicitudesVehiculo(2);
                }else{
                  this.soliVeService.getSolicitudesRol(this.usuarioActivo.role);
                }
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
            if (this.usuarioActivo.role == 'ADMIN'){
              this.soliVeService.getSolicitudesVehiculo(2);
            }else{
              this.soliVeService.getSolicitudesRol(this.usuarioActivo.role);
            }
            this.mensajesService.mensajesToast("success", "Asignacion exitosa");
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
            "Ups... Algo salió mal en la asignacion",
            err.error.message
          );
          reject(err); // Rechaza la promesa con el error
        },
      });
    });
  }

  editarSoliVe(){
  }

  cargarPlacas(tipoVehiculo: string, fechaSalida:string, fechaEntrada:string) {
    this.soliVeService.filtroPlacasVehiculo(tipoVehiculo,fechaSalida,fechaEntrada).subscribe(
      (vehiculosData: IVehiculos[]) => {
        if (vehiculosData && vehiculosData.length > 0) {
          this.placas = vehiculosData;
        }else if(tipoVehiculo != '') {
          this.mensajesService.mensajesToast("warning", "En estas fechas, no hay vehiculos disponibles del tipo seleccionado.");
        }
      },
      (error: any) => {
        console.error('Error al obtener opciones de vehículos desde el backend:', error);
      }
    );
  }


  iniciarFormulario() {
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
      unidadSolicitante: ['', [Validators.required]
      ],
      tipoVehiculo: ['', [Validators.required]],
      vehiculo: ['', [Validators.required]],
      objetivoMision: ['', [Validators.required]],
      lugarMision: ['', [Validators.required]],
      direccion: [''],
      depto: ['', [Validators.required]],
      //modificado por sino se ocupa borrar
      municipio: ['', []],
      distrito: ['', []],
      canton: ['', []],
      horaSalida: ['', [Validators.required]],
      horaEntrada: ['', [Validators.required]],
      cantidadPersonas: [
        1,
        [Validators.required, Validators.min(1)]
      ],
      solicitante: [],
      listaPasajeros: this.fb.array([]),
      motorista:['',[Validators.required]],
      observaciones:['',[]],
      file: ['',],
    });
  }


  validarfecha(fecha: string) {
    const inputDate = new Date(fecha);

    if (inputDate.getFullYear() > 999 && inputDate.getFullYear() < 10000) {
      return true;
    } else {
      return false;
    }
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

  actualizarPasajeros() {
    this.cantidadPersonas = this.formularioSoliVe.get('cantidadPersonas').value;

    if (this.cantidadPersonas > 5) {
      this.mostrarTabla = false; // Ocultar la tabla
      this.mostrarArchivoAdjunto = true; // Mostrar el campo de entrada de archivo
    } else if (this.cantidadPersonas <=1 ) {
      this.mostrarTabla=false;
      this.mostrarArchivoAdjunto = false;
    }else {
      this.mostrarTabla = true; // Mostrar la tabla
      this.mostrarArchivoAdjunto = false; // Ocultar el campo de entrada de archivo
    }

    // Verifica si la cantidad de personas está dentro del rango deseado (2 a 5)
    if (this.cantidadPersonas >= 2 && this.cantidadPersonas <= 5) {
      const cantidadFilasDeseada = this.cantidadPersonas - 1;

      // Elimina filas en exceso si hay más de las deseadas
      while (this.pasajeroFormControls.length > cantidadFilasDeseada) {
        this.pasajeroFormControls.pop();
      }

      // Agrega filas
      while (this.pasajeroFormControls.length < cantidadFilasDeseada) {
        const control = new FormControl('', Validators.required);
        this.pasajeroFormControls.push(control);
      }
    } else if(this.cantidadPersonas < 2) {
      while (this.pasajeroFormControls.length > 0) {
        this.pasajeroFormControls.pop();
      }
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

  actualizarEstadoCheckbox() {
    this.isChecked = !this.isChecked;
    console.log(this.isChecked);

  }

  borrarPasatiempo(i: number){
    this.pasajeroFormControls.splice(i,1);
    this.formularioSoliVe.get('cantidadPersonas')
      .setValue(this.pasajeroFormControls.length + 1);
  }

  async anularSolicitud() {
    if(this.formularioSoliVe.get('observaciones').value == ''){
      this.formularioSoliVe.get('observaciones').setErrors({required:true});
      this.formularioSoliVe.get('observaciones').markAsTouched();
      this.mensajesService.mensajesToast("warning", "Solicitud se requiere campo observaciones");
    } else {
      if (await this.mensajesService.mensajeAnular() == true){
        this.soliVeOd.estado = 15;
        this.soliVeOd.observaciones = this.formularioSoliVe.get('observaciones').value;
        await this.actualizarSolicitud(this.soliVeOd, 'anulada');
      }
    }
  }

  actualizarSolicitud(data: any, accion: string):Promise <void>{
    return new Promise<void>((resolve, reject) => {
      this.soliVeService.updateSolciitudVehiculo(data).subscribe({
        next: () => {
          //resp:any this.usuarioActivo.role == 'ADMIN' && data.estado == 15 && this.leyenda == 'Edicion'
          if (this.usuarioActivo.role == 'ADMIN' && data.estado == 15 && this.leyenda == 'Edicion'){
            this.soliVeService.getSolicitudesVehiculo(2);
          }else if(this.usuarioActivo.role == 'ADMIN' && (data.estado == 6 ||  data.estado == 15)){
            this.soliVeService.getSolicitudesVehiculo(3);
          }else {
            this.soliVeService.getSolicitudesRol(this.usuarioActivo.role);
          }
          this.mensajesService.mensajesToast("success", `Solicitud ${accion} con éxito`);
          this.modalService.dismissAll();
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

  async revisionSolicitud() {

    if(this.formularioSoliVe.get('observaciones').value == ''){
      this.formularioSoliVe.get('observaciones').setErrors({required:true});
      this.formularioSoliVe.get('observaciones').markAsTouched();
      this.mensajesService.mensajesToast("warning", "Se requiere campo observaciones");
      return;
    }
    if (await this.mensajesService.mensajeRevision() == true){
      this.soliVeOd.estado = 6;
      this.soliVeOd.observaciones = this.formularioSoliVe.get('observaciones').value;
      await this.actualizarSolicitud(this.soliVeOd, 'enviada a revisión');
    }
  }

  async aprobarSolicitud(){
    console.log(this.soliVeOd);
    if ((await this.mensajesService.mensajeAprobar()) == true) {
      this.soliVeOd.observaciones =  this.formularioSoliVe.get('observaciones').value;
      await this.actualizarSolicitudDec(this.soliVeOd);
    }
  }

  actualizarSolicitudDec(data: any):Promise <void>{
    return new Promise<void>((resolve, reject) => {
      this.soliVeService.updateSolciitudVehiculo(data).subscribe({
        next: () => {
          // resp: any
          this.solicitudVale = {
            idSolicitudVale: null,
            cantidadVale: 0,
            estadoEntrada: 1,
            estado: 8,
            solicitudVehiculo: data.codigoSolicitudVehiculo
          };

          this.soliVeService.registrarSolicitudVale(this.solicitudVale).subscribe({
            next: () => {
              // valeResp: any
              if (this.usuarioActivo.role == 'ADMIN'){
                this.soliVeService.getSolicitudesVehiculo(3);
              }else {
                this.soliVeService.getSolicitudesRol(this.usuarioActivo.role);
              }
              this.mensajesService.mensajesToast("success", "Solicitud aprobada con éxito");
              this.modalService.dismissAll();
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
}
