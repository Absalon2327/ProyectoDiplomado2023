import {Component, Input, OnInit} from '@angular/core';
import {IEmail, ILogSoliVe, ISolicitudVehiculo} from "../../interfaces/data.interface";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalComponent} from "../modal/modal.component";
import { ModalSecretariaComponent } from '../modal-secretaria/modal-secretaria.component';
import {MensajesService} from "../../../../shared/global/mensajes.service";
import {SolicitudVehiculoService} from "../../services/solicitud-vehiculo.service";
import Swal from "sweetalert2";
import {Usuario} from "../../../../account/auth/models/usuario.models";
import {ISolicitudvalep} from "../../../solicitud-vale-paginacion/interface/solicitudvalep.interface";
import {ModalLogComponent} from "../modal-log/modal-log.component";
import {EmailService} from "../../services/email.service";

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})
export class TablaComponent implements OnInit {
  @Input() solicitudesVehiculo!: ISolicitudVehiculo[];
  @Input() opc!: string;
  @Input() term!: any; // para buscar
  @Input() vista!: string;
  @Input() userAcivo!: Usuario;
  p: any; // paginacion
  selectedData: any; // Almacena los datos del registro seleccionado
  solicitudVale!: ISolicitudvalep;
  logSoli: ILogSoliVe[];
  constructor(private modalService: NgbModal,
              private mensajesService: MensajesService,
              private soliService: SolicitudVehiculoService,
              private emailService: EmailService) {
    this.solicitudVale = {
      idSolicitudVale: '',
      cantidadVale: 0,
      estadoEntrada: 1,
      estado: 8,
      solicitudVehiculo: '' // Otra inicialización si es necesario
    };
  }

  ngOnInit(): void {
  }

  abrirModal(leyenda: string, data: any) {
    if (this.userAcivo.role == 'DECANO' && data.estado == 3 && this.vista == 'listado'){
      this.abrirModalSecre(leyenda, data)
    } else if (this.userAcivo.role == 'SECR_DECANATO' && (data.estado == 2 || data.estado == 4 || data.estado == 5 || data.estado == 6) && this.vista == 'listado'){
      this.abrirModalSecre(leyenda, data);
      console.log("entro");
    }else {
      this.selectedData = data; // Almacena los datos del registro seleccionado
      const modalRef = this.modalService.open(ModalComponent, {size: 'xl', backdrop: 'static' , scrollable: true});
      modalRef.componentInstance.leyenda = leyenda; // Pasa la leyenda al componente modal
      modalRef.componentInstance.soliVeOd = data;
      modalRef.componentInstance.vista = this.vista;
      modalRef.componentInstance.usuarioActivo = this.userAcivo;
    }
  }

  abrirModalParaAdmin(leyenda: string, data: any) {
    if (this.userAcivo.role == 'ADMIN' && data.estado == 1 && this.vista == 'listar'){
      this.selectedData = data; // Almacena los datos del registro seleccionado
      const modalRef = this.modalService.open(ModalComponent, {size: 'xl', backdrop: 'static'});
      modalRef.componentInstance.leyenda = leyenda; // Pasa la leyenda al componente modal
      modalRef.componentInstance.soliVeOd = data;
      modalRef.componentInstance.vista = this.vista;
      modalRef.componentInstance.usuarioActivo = this.userAcivo;
    }else if (this.userAcivo.role == 'ADMIN' && data.estado != 1) {
      this.abrirModalSecre(leyenda, data);
    }
  }

  abrirModalSecre(leyenda: string, data: any) {
    const modalRef = this.modalService.open(ModalSecretariaComponent, {size:'xl', backdrop: 'static'});
    modalRef.componentInstance.leyenda = leyenda;
    modalRef.componentInstance.soliVeOd = data;
    modalRef.componentInstance.usuarioActivo = this.userAcivo;
  }

  abrirModalLog(data: any) {
    this.obtenerLog(data.codigoSolicitudVehiculo).then(() => {
      const modalRef = this.modalService.open(ModalLogComponent, { size: 'xl', backdrop: 'static' });
      modalRef.componentInstance.log = this.logSoli;
    });
  }

  obtenerLog(codigoSoliVe: string): Promise<void> {
    return this.soliService.getLogSoli(codigoSoliVe)
      .then((log: ILogSoliVe[]) => {
        this.logSoli = log;
      })
      .catch((error) => {
        console.error('Error al obtener el log de la solicitud', error);
      });
  }


  async aprobarSolicitud(data: any){
    if ((await this.mensajesService.mensajeAprobar()) == true) {
      //await this.actualizarSolicitud(data);
      if (this.userAcivo.role=="JEFE_DEPTO"){
        await this.actualizarSolicitud(data);
      }else{
        if(data.tieneVale){
          await this.actualizarSolicitudDec(data);
        }else {
          data.estado = 5;
          await this.actualizarSolicitudSinVa(data);
        }
      }
    }
  }

  async revisionSolicitud(data: any) {
    if (await this.mensajesService.mensajeRevision() == true){
      data.estado = 6;
      await this.actualizarSolicitud(data);
    }

  }

  async anularSolicitud(data: any) {
    if (await this.mensajesService.mensajeAnular() == true){
      data.estado = 15;
      await this.actualizarSolicitud(data);
    }

  }

  actualizarSolicitud(data: any):Promise <void>{
    return new Promise<void>((resolve, reject) => {
      this.soliService.updateSolciitudVehiculo(data).subscribe({
        next: () => {
          //resp: any
          if (this.userAcivo.role == 'ADMIN'){
            this.soliService.getSolicitudesVehiculo(1);
          }else {
            this.soliService.getSolicitudesRol(this.userAcivo.role);
          }
          this.enviarEmailAprob('SECR_DECANATO', 'Nueva solicitud de vehículo pendiente',
            'Tiene una nueva solicitud de vehículo pendiente de asignar motorista o verificación de la información.');
          this.mensajesService.mensajesToast("success", "Solicitud aprobada con éxito");
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
      this.soliService.updateSolciitudVehiculo(data).subscribe({
        next: () => {
          // resp: any
          this.solicitudVale.cantidadVale =0 ;
          this.solicitudVale.estadoEntrada = 1;
          this.solicitudVale.estado = 8;
          this.solicitudVale.solicitudVehiculo = data.codigoSolicitudVehiculo;

          this.enviarEmailAprobacionASolicitante(data.solicitante.codigoUsuario, data.observaciones);

          this.soliService.registrarSolicitudVale(this.solicitudVale).subscribe({
            next: () => {
              // valeResp: any
              if (this.userAcivo.role == 'ADMIN'){
                this.soliService.getSolicitudesVehiculo(3);
              }else {
                this.soliService.getSolicitudesRol(this.userAcivo.role);
              }

              this.enviarEmailAprob("ASIS_FINANCIERO",
                "Solicitud de vales", "Tiene una nueva solicitud de vales para la misión: "+data.objetivoMision);
              this.mensajesService.mensajesToast("success", "Solicitud aprobada con éxito");

              this.mensajesService.mensajesToast("success", "Solicitud aprobada con éxito");
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

  actualizarSolicitudSinVa(data: any):Promise <void>{
    return new Promise<void>((resolve, reject) => {
      this.soliService.updateSolciitudVehiculoSinVale(data).subscribe({
        next: () => {
          // resp: any
          this.soliService.getSolicitudesRol(this.userAcivo.role);
          this.enviarEmailAprob('SECR_DECANATO', 'Nueva solicitud de vehículo pendiente',
                'Tiene una nueva solicitud de vehículo pendiente de asignar motorista o verificación de la información.');
          this.mensajesService.mensajesToast("success", "Solicitud aprobada con éxito");
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

  calcularNumeroCorrelativo(index: number): number {
    if (typeof this.p === 'number') {
      return (this.p - 1) * 10 + index + 1;
    } else {
      return index + 1; // Si no es numérico, solo regresamos el índice + 1
    }
  }

  /* Metodos del administrador */

  async aprobarSolicitudAdmin(data: any){
    if ((await this.mensajesService.mensajeAprobar()) == true) {
      //await this.actualizarSolicitud(data);
      if (data.estado == 1){
        await this.actualizarSolicitud(data);
      }else if(data.estado == 3){
        await this.actualizarSolicitudDec(data);
      }
    }
  }

  /* correo */

  enviarEmailAprob(rol: any, titulo: string, mensaje: string){
    this.emailService.getEmailNameRol(rol).subscribe(
      (datos) => {
        const email: IEmail = {
          asunto: titulo,
          titulo: titulo,
          email: datos.correo,
          receptor: "Estimad@ "+datos.nombreCompleto+".",
          mensaje: mensaje,
          centro: 'Por favor ingrese al sistema para ver más detalles.',
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
        const nombreUserAccion = this.userAcivo.empleado.nombre + " "+
          this.userAcivo.empleado.apellido;
        const email: IEmail = {
          asunto: 'Solicitud de vehículo APROBADA',
          titulo: 'Solicitud de vehículo APROBADA',
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

  /* fin correo */
}
