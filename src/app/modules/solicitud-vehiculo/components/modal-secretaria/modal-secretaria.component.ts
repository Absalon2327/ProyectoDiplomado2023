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
import {IDocumento, IDocumentoSoliVe, IEmail, IMotorista, IPais, IPasajero, ISolicitudVehiculo} from "../../interfaces/data.interface";
import {SolicitudVehiculoService} from "../../services/solicitud-vehiculo.service";

import {map} from "rxjs/operators";
import Swal from "sweetalert2";
import {MensajesService} from "../../../../shared/global/mensajes.service";
import {IVehiculos} from "../../../vehiculo/interfaces/vehiculo-interface";
import {INTEGER_VALIDATE, NAME_TILDES_VALIDATE} from "../../../../constants/constants";
import { Usuario } from 'src/app/account/auth/models/usuario.models';
import { log } from 'console';
import {ISolicitudvalep} from "../../../solicitud-vale-paginacion/interface/solicitudvalep.interface";
import { EmailService } from '../../services/email.service';
import { IEmpleado } from 'src/app/modules/empleado/interface/empleado.interface';

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
  motoristas !: IMotorista[];

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
  private isText:string = NAME_TILDES_VALIDATE;

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
  ) { }

  ngOnInit(): void {
    this.iniciarFormulario();
    this.llenarSelectDepartamentos();
    this.soliVeService.obtenerVehiculos();

    if(this.leyenda != 'Detalle') {
      // const fechasSalida =   this.soliVeOd.fechaSalida.  //new Date(this.soliVeOd.fechaSalida);
      const dateSalida = new Date(this.soliVeOd.fechaSalida);
      const dateEntrada = new Date(this.soliVeOd.fechaEntrada);
       // Aumentamos en 1 el dia de fin para que el calendario lo pinte bien
       dateEntrada.setDate(dateEntrada.getDate());

       // Convertimos las fechas a string con formato ISO para que el calendario las pinte bien
       let var1 : string = dateSalida.toISOString().split('T')[0];
       let var2 : string = dateEntrada.toISOString().split('T')[0];



         this.cargaMotorista2(var1,var2);

     }

    this.detalle(this.leyenda);
  }

  get listVehiculos() {
    return this.soliVeService.listVehiculos;
  }

  get listMotoristas(){
    return this.soliVeService.listMotorista;
  }

  detalle(leyenda: string){
    if (leyenda == 'Edicion' || leyenda == 'Detalle' || leyenda == 'Calendario'){

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
      this.placas = [this.soliVeOd.vehiculo];
      //this.motoristas = [this.soliVeOd.motorista];
      //console.log(this.placas);


      // para input radio
      if(this.usuarioActivo.role == 'DECANO' || leyenda == 'Detalle' || leyenda == 'Calendario'){
        this.formularioSoliVe.get('tieneVale').disable();
      }

    if(this.soliVeOd.estado == 5){
      this.formularioSoliVe.get('tieneVale').disable();
      }

      if (this.soliVeOd.estado > 2){
        this.formularioSoliVe.get('tieneVale')
        .setValue(this.soliVeOd.tieneVale ? 'true':'false');
      }

      // por estado revision
      if(this.soliVeOd.motorista != null){
        this.motoristas = [this.soliVeOd.motorista];
        //console.log("motorista: ",this.motoristas);
        this.formularioSoliVe.get('motorista')
          .setValue(this.soliVeOd != null ? this.soliVeOd.motorista.nombre + ' '
            + this.soliVeOd.motorista.apellido: '');
        // nuevo codigo para mostrar motorista junta
        if(this.soliVeOd.motoristaJunta != null){
          this.isChecked = true;
          this.formularioSoliVe.get('motoristaJunta')
          .setValue(this.soliVeOd != null ? this.soliVeOd.motoristaJunta: '');

          this.formularioSoliVe.get('detalleAcuerdo')
          .setValue(this.soliVeOd != null ? this.soliVeOd.detalleAcuerdo: '');
        }else{
          this.isChecked = false;
        }
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

        this.pasajeros.push({id: persona.id, nombrePasajero: persona.nombrePasajero});

        const control = new FormControl(this.soliVeOd != null ? persona.nombrePasajero : '');
        this.pasajeroFormControls.push(control);
      }



    }
  }

  async guardar(){
    //this.formularioSoliVe.value.unidadSolicitante = this.usuarioActivo.empleado.departamento.nombre;

    const solicitudVehiculo = this.formularioSoliVe.value;
    //console.log("formularo: ",this.formularioSoliVe);
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

              if (!todosLlenos && solicitudVehiculo.cantidadPersonas<6) {
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
      /*//console.log('Campos inválidos:',
        Object.keys(this.formularioSoliVe.controls).filter((controlName) =>
          this.formularioSoliVe.get(controlName)?.invalid));*/

      this.mensajesService.mensajesToast(
        "warning",
        "Complete lo que se indican"
      );
      return Object.values(this.formularioSoliVe.controls).forEach((control) =>
        control.markAsTouched()
      );
    }
  }
//metodo para cargar desde el metodo de cargaplaca
  cargaMotorista(fechaSalida:string, fechaEntrada:string){
    this.motoristas = [];


    const dateSalida = new Date(this.soliVeOd.fechaSalida);
    const dateEntrada = new Date(this.soliVeOd.fechaEntrada);

     dateEntrada.setDate(dateEntrada.getDate());

     // Convertimos las fechas a string con formato ISO para que el calendario las pinte bien
     let var1 : string = dateSalida.toISOString().split('T')[0];
     let var2 : string = dateEntrada.toISOString().split('T')[0];
    this.soliVeService.obtenerMotoristas2(fechaSalida,fechaEntrada).subscribe(
    (motoristasData: IMotorista[]) => {
       //this.formularioSoliVe.get('motorista').setValue(null);// limpiar el select
       if(this.soliVeOd.motorista != null ){ // si el motorista no es null falto agregar mensaje que cuando sea null
        // viene en estado 6

        if(motoristasData.length > 0){  //si lo que trae la data es 0
          this.motoristas = motoristasData;  // si en caso es mayor a 0 se setea la data
          //this.motoristas.push(this.soliVeOd.motorista);

          if(this.soliVeOd.motorista.dui != '00000000'){
            this.formularioSoliVe.get('motorista').setValue(null);
           }else{
            this.formularioSoliVe.get('motorista').setValue(this.soliVeOd.motorista.nombre + ' ' +
            this.soliVeOd.motorista.apellido);
            this.isChecked = true;
            this.formularioSoliVe.get('motoristaJunta').setValue(this.soliVeOd.motoristaJunta);
            this.formularioSoliVe.get('detalleAcuerdo').setValue(this.soliVeOd.detalleAcuerdo);
           }


          if(var1 == fechaSalida && var2 == fechaEntrada){
           if(this.soliVeOd.motorista.dui != '00000000'){
            this.motoristas.push(this.soliVeOd.motorista);
           }

            this.formularioSoliVe.get('motorista').setValue(this.soliVeOd.motorista.nombre + ' ' +
              this.soliVeOd.motorista.apellido);
          }

          if(var1 == fechaSalida){
            if(this.soliVeOd.motorista.dui != '00000000'){
              this.motoristas.push(this.soliVeOd.motorista);
             }
            this.formularioSoliVe.get('motorista').setValue(this.soliVeOd.motorista.nombre + ' ' +
              this.soliVeOd.motorista.apellido);
          }
        }else if(motoristasData.length == 0){
          if(var1 != fechaSalida || var2 != fechaEntrada){
            this.formularioSoliVe.get('motorista').setValue(null);
            this.mensajesService.mensajesToast("warning", "No hay motoristas disponibles.");
          }else {
            this.motoristas.push(this.soliVeOd.motorista);
            this.formularioSoliVe.get('motorista').setValue(this.soliVeOd.motorista.nombre + ' ' + this.soliVeOd.motorista.apellido); // se setea en el select
            this.mensajesService.mensajesToast("warning", "No hay más motoristas disponibles.");
          }
        }
      } else {
          //viene en estado 2
          if (motoristasData.length > 0) {
            this.motoristas = motoristasData;  // si en caso es mayor a 0 se setea la data
          }else{
            this.formularioSoliVe.get('motorista').setValue(null);
            this.mensajesService.mensajesToast("warning", "No hay motoristas disponibles.");
          }
      }
    }
  );
}
// fin del metodo
// metodo para cargar motoristas desde el oninit
   cargaMotorista2(fechaSalida:string, fechaEntrada:string){
    this.soliVeService.obtenerMotoristas2(fechaSalida,fechaEntrada).subscribe(
    (motoristasData: IMotorista[]) => {
      if(motoristasData.length > 0) {
        this.motoristas = motoristasData;
        if(this.soliVeOd.motorista != null && this.soliVeOd.motorista.dui != '00000000'){
         this.motoristas.push(this.soliVeOd.motorista);
        }
      }else if(motoristasData.length == 0 && this.soliVeOd.motorista == null){
        this.mensajesService.mensajesToast("warning", "No hay motoristas disponibles.");
      }else if(motoristasData.length == 0 && this.soliVeOd.motorista != null){
        //this.mensajesService.mensajesToast("warning", "No hay más motoristas disponibles.");
       this.motoristas = motoristasData;  // si en caso es mayor a 0 se setea la data
        this.motoristas.push(this.soliVeOd.motorista);
      }
    });
  }
//fin del metodo
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
        solicitudVehiculo.motorista = this.soliVeOd.motorista.codigoEmpleado;
      }
    }

    if(this.soliVeOd.vehiculo.placa == this.formularioSoliVe.get('vehiculo').value){
      solicitudVehiculo.vehiculo = this.soliVeOd.vehiculo.codigoVehiculo;
    }
    const tipoBuscado = "Lista de pasajeros";
    const documentosFiltrados = this.soliVeOd.listDocumentos.filter((documento) => {
      return documento.tipoDocumento === tipoBuscado;
    });
    //console.log(documentosFiltrados);


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
    let alertLoadingEdit: any;
    // Mostrar SweetAlert de carga
    alertLoadingEdit = Swal.fire({
      title: 'Espere un momento!',
      html: 'Se está procesando la información...',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    //console.log(solicitudVehiculo);
    return new Promise<void> ((resolve, reject) => {
      this.soliVeService.updateSolicitudVehiculo(solicitudVehiculo).subscribe({
        next: (resp: any) => {
          this.soliSave = resp;
          if (solicitudVehiculo.cantidadPersonas != this.soliVeOd.cantidadPersonas && this.file != null) {
            // enviar pdf
            const formData = new FormData();
            let obj = {
              codigoDocumento:documentosFiltrados.length>0 ? documentosFiltrados[0].codigoDocumento : '',
              nombreDocumento:documentosFiltrados.length>0 ? documentosFiltrados[0].nombreDocumento : '',
              urlDocumento:documentosFiltrados.length>0 ? documentosFiltrados[0].urlDocumento : '',
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
                  this.soliVeService.getSolicitudesVehiculo(this.soliVeOd.estado);
                }else if (this.soliVeOd.estado == 4 || this.soliVeOd.estado == 5){
                  this.soliVeService.getSolicitudesVehiculo(this.soliVeOd.estado);
                } else{
                  this.soliVeService.getSolicitudesRol(this.usuarioActivo.role);
                }
                if (this.soliVeOd.estado == 2 || this.soliVeOd.estado == 6){
                  this.enviarEmailSD('DECANO', 'Solicitud de vehículo','Tiene una nueva solicitud de vehículo pendiente de aprobar o verificar la información');
                }
                this.modalService.dismissAll();
                alertLoadingEdit.close();
                this.formularioSoliVe.reset();
                this.mensajesService.mensajesToast("success", "Asignación exitosa");
                resolve();
              },
              error: (pdfError) => {
                alertLoadingEdit.close();
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
              this.soliVeService.getSolicitudesVehiculo(this.soliVeOd.estado);
            }else if (this.soliVeOd.estado == 4 || this.soliVeOd.estado == 5){
              this.soliVeService.getSolicitudesVehiculo(this.soliVeOd.estado);
            } else{
              this.soliVeService.getSolicitudesRol(this.usuarioActivo.role);
            }
            if (this.soliVeOd.estado == 2 || this.soliVeOd.estado == 6) {
              this.enviarEmailSD('DECANO', 'Solicitud de vehículo', 'Tiene una nueva solicitud de vehículo pendiente de aprobar o verificar la información');
            }
            this.modalService.dismissAll();
            alertLoadingEdit.close();
            this.formularioSoliVe.reset();
            this.mensajesService.mensajesToast("success", "Asignación exitosa");
            resolve();
          }
        },
        error : (err) => {
          // Cerrar SweetAlert de carga
          alertLoadingEdit.close();
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
    this.placas = [];
    this.soliVeService.filtroPlacasVehiculo(tipoVehiculo,fechaSalida,fechaEntrada).subscribe(
      (vehiculosData: IVehiculos[]) => {
        if (vehiculosData && vehiculosData.length > 0) {
          this.placas = vehiculosData;
          this.formularioSoliVe.get('vehiculo').setValue('');
          if(this.soliVeOd.vehiculo.clase == tipoVehiculo){
            this.placas.push(this.soliVeOd.vehiculo);
            this.formularioSoliVe.get('vehiculo').setValue(this.soliVeOd.vehiculo.placa);
          }
        }else if(tipoVehiculo == this.soliVeOd.vehiculo.clase){
          this.placas = [];
          this.placas.push(this.soliVeOd.vehiculo);
          this.formularioSoliVe.get('vehiculo').setValue(this.soliVeOd.vehiculo.placa);
        }else if(tipoVehiculo != '' && tipoVehiculo != this.soliVeOd.vehiculo.clase) {
          this.placas = [];
          this.formularioSoliVe.get('vehiculo').setValue('');
          this.mensajesService.mensajesToast("warning", "En estas fechas, no hay vehículos disponibles del tipo seleccionado.");
        }
      },
      (error: any) => {
        //console.error('Error al obtener opciones de vehículos desde el backend:', error);
      }
    );

    // inicio de carga motirista
    //this.formularioSoliVe.get('motorista').setValue(null);

    this.cargaMotorista(fechaSalida,fechaEntrada);

   // this.soliVeService.obtenerMotoristas(fechaSalida,fechaEntrada);

    // fin

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
      motorista:[null,[Validators.required]],
      observaciones:['',[]],
      file: ['',],
      tieneVale:['',[Validators.required]],
      motoristaJunta:[null],
      detalleAcuerdo:[null]
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

    if(this.cantidadPersonas == this.soliVeOd.cantidadPersonas){
      if((this.soliVeOd.cantidadPersonas < 6 && this.soliVeOd.cantidadPersonas >=2 ) &&
      (this.cantidadPersonas < 6 && this.cantidadPersonas >=2)){
        this.mostrarTabla = true;
        this.mostrarArchivoAdjunto = false;
      }else{
        this.mostrarTabla = false;
        this.mostrarArchivoAdjunto = true;
      }
    } else if (this.cantidadPersonas > 5 ) {
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
    } else {
      this.pasajeroFormControls = [];
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
    let alertLoadingUpdate: any;
    // Mostrar SweetAlert de carga
    alertLoadingUpdate = Swal.fire({
      title: 'Espere un momento!',
      html: 'Se está procesando la información...',
      didOpen: () => {
        Swal.showLoading();
      }
    });
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
          if (data.estado == 6) {
            this.enviarEmailSD('SECR_DECANATO', 'Solicitud de vehículo',
            `Tiene una solicitud vehículo pendiente de revisión. ${data.observaciones}.`);
          } else if( data.estado == 15 ){
            this.enviarEmailAnulacion(data.solicitante.codigoUsuario, data.observaciones);
          }
          this.modalService.dismissAll();
          alertLoadingUpdate.close();
          this.mensajesService.mensajesToast("success", `Solicitud ${accion} con éxito`);
          resolve();
        },
        error: (error) => {
          alertLoadingUpdate.close();
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
    if(this.soliVeOd.tieneVale){
      if ((await this.mensajesService.mensajeAprobar()) == true) {
        await this.actualizarSolicitudDec(this.soliVeOd);
      }
    }else{
      if ((await this.mensajesService.mensajeAprobar()) == true) {
        this.soliVeOd.estado = 5;
        await this.actualizarSolicitudSinVa(this.soliVeOd);
      }
    }

  }

  actualizarSolicitudDec(data: any):Promise <void>{
    let alertLoadingDec: any;
    // Mostrar SweetAlert de carga
    alertLoadingDec = Swal.fire({
      title: 'Espere un momento!',
      html: 'Se está procesando la información...',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    return new Promise<void>((resolve, reject) => {
      this.soliVeService.updateSolciitudVehiculo(data).subscribe({
        next: (resp: any) => {
          // resp: any
          this.solicitudVale = {
            idSolicitudVale: null,
            cantidadVale: 0,
            estadoEntrada: 1,
            estado: 8,
            solicitudVehiculo: data.codigoSolicitudVehiculo
          };

          this.enviarEmailAprobacionASolicitante(data.solicitante.codigoUsuario, data.observaciones);

          this.soliVeService.registrarSolicitudVale(this.solicitudVale).subscribe({
            next: () => {
              // valeResp: any
              if (this.usuarioActivo.role == 'ADMIN'){
                this.soliVeService.getSolicitudesVehiculo(3);
              }else {
                this.soliVeService.getSolicitudesRol(this.usuarioActivo.role);
              }
              this.enviarEmailSD("ASIS_FINANCIERO",
                "Solicitud de vales", "Tiene una nueva solicitud de vales para la misión: "+data.objetivoMision);
              this.modalService.dismissAll();
              alertLoadingDec.close();
              this.mensajesService.mensajesToast("success", "Solicitud aprobada con éxito");
              resolve();
            },
            error: (errorSoli) => {
              alertLoadingDec.close();
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
          alertLoadingDec.close();
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

  actualizarSolicitudSinVa(data: any):Promise <void>{
    let alertLoadingSinVa: any;
    // Mostrar SweetAlert de carga
    alertLoadingSinVa = Swal.fire({
      title: 'Espere un momento!',
      html: 'Se está procesando la información...',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    return new Promise<void>((resolve, reject) => {
      this.soliVeService.updateSolciitudVehiculoSinVale(data).subscribe({
        next: () => {
          // resp: any
          this.soliVeService.getSolicitudesRol(this.usuarioActivo.role);
          this.enviarEmailAprobacionASolicitante(data.solicitante.codigoUsuario, data.observaciones);
          this.modalService.dismissAll();
          alertLoadingSinVa.close();
          this.mensajesService.mensajesToast("success", "Solicitud aprobada con éxito");
          resolve();
        },
        error: (error) => {
          alertLoadingSinVa.close();
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

  /** correos */

  enviarEmailSD(rol: any, titulo: string, mensaje: string){
    this.emailService.getEmailNameRol(rol).subscribe(
      (datos) => {
        const email: IEmail = {
          asunto: titulo,
          titulo: titulo,
          email: datos.correo,
          receptor: "Estimad@ "+datos.nombreCompleto+".",
          mensaje: mensaje,
          centro: 'Para acceder, haz clic aquí, o en la imagen de arriba: https://uti.fmp.ues.edu.sv/GestionCombustible/',
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
          titulo: 'Solicitud de vehículo',
          email: datos.correo,
          receptor: "Estimad@ "+datos.nombreCompleto+".",
          mensaje: "Su solicitud ha sido anulada por "+nombreUserAccion+". "+obsevacion,
          centro: 'Para acceder, haz clic aquí, o en la imagen de arriba: https://uti.fmp.ues.edu.sv/GestionCombustible/',
          abajo: 'Gracias por su atención a este importante mensaje.\nFeliz día!',
        }
        this.emailService.notificarEmail(email);
      },
      (error) => {
        console.error('Error al obtener el correo:', error);
      }
    );
  }

  enviarEmailAprobacionASolicitante(id: any, obsevacion: any){
    if (obsevacion ==  null){
      obsevacion = 'SIN NINGUNA OBSERVACIÓN';
    }
    this.emailService.getSolicitante(id).subscribe(
      (datos) => {
        const nombreUserAccion = this.usuarioActivo.empleado.nombre + " "+
          this.usuarioActivo.empleado.apellido;
        const email: IEmail = {
          asunto: 'Solicitud de vehículo APROBADA',
          titulo: 'Solicitud de vehículo',
          email: datos.correo,
          receptor: "Estimad@ "+datos.nombreCompleto+".",
          mensaje: "Su solicitud ha sido aprobada por el Dencano: "+nombreUserAccion+". Y está a la espera de asignación de vales",
          centro: '',
          abajo: 'Gracias por su atención a este importante mensaje.\nFeliz día!',
        }
        this.emailService.notificarEmail(email);
      },
      (error) => {
        console.error('Error al obtener el correo:', error);
      }
    );
  }

  /** fin correos */


  get textoBoton(): string {
    return this.leyenda === 'Detalle' ||
      this.leyenda === 'Calendario' ? 'Cerrar' : 'Cancelar';
  }


  verficarSelect(){
    const valorSeleccionado = this.formularioSoliVe.get('motorista').value;
    if (valorSeleccionado != null) {
      this.soliVeService.obtenerMotoristaAcuerdo(valorSeleccionado)
      .subscribe((MotorisData: IMotorista) => {
        if(MotorisData.dui == '00000000'){
          this.isChecked = true;
          this.formularioSoliVe.get('motoristaJunta')
          .setValidators([Validators.required,Validators.pattern(this.isText)]);

          this.formularioSoliVe.get('detalleAcuerdo')
          .setValidators([Validators.required,Validators.pattern(this.isText)]);
        }else{
          this.isChecked = false;
          this.formularioSoliVe.get('motoristaJunta').setValue(null);
          this.formularioSoliVe.get('motoristaJunta').clearValidators();
          this.formularioSoliVe.get('motoristaJunta').updateValueAndValidity();

          this.formularioSoliVe.get('detalleAcuerdo').setValue(null);
          this.formularioSoliVe.get('detalleAcuerdo').clearValidators();
          this.formularioSoliVe.get('detalleAcuerdo').updateValueAndValidity();
        }
      });
    }
    this.isChecked = false;
  }
  onInputMayus(index: number, event: any) {
    const inputValue = event.target.value;
    const formattedValue = inputValue
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    this.pasajeroFormControls[index].setValue(formattedValue, { emitEvent: false });
  }

  get textoBotonEditar(): string {
    return this.leyenda === 'Edicion' && this.soliVeOd.estado == 2 ? 'Asignar' : 'Modificar';
  }
}
