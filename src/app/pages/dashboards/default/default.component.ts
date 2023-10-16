import { Component, OnInit, ViewChild } from '@angular/core';
import { emailSentBarChart, monthlyEarningChart } from './data';
import { ChartType } from './dashboard.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../core/services/event.service';

import { ConfigService } from '../../../core/services/config.service';
import { UsuarioService } from 'src/app/account/auth/services/usuario.service';
import { IEmpleado } from 'src/app/modules/empleado/interface/empleado.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ServiceService } from 'src/app/modules/solicitudes/Service/service.service';
import { IExistenciaVales } from 'src/app/modules/solicitudes/Interfaces/existenciavales.interface';
import { DataCards, Empleado } from 'src/app/account/auth/models/usuario.models';
import { SolicitudVehiculoService } from 'src/app/modules/solicitud-vehiculo/services/solicitud-vehiculo.service';
import { ISolicitudVehiculo } from 'src/app/modules/solicitud-vehiculo/interfaces/data.interface';
import { ServicioService } from 'src/app/modules/calendario/servicio/servicio.service';
import { Console } from 'console';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  isVisible: string;
  storage: Storage = window.localStorage;
  emailSentBarChart: ChartType;
  monthlyEarningChart: ChartType;
  transactions: Array<[]>;
  statData: Array<[]>;

  isActive: string;

  fotoEmpleado!: string;
  usuario!: string;
  imagenBlob: Blob | null = null;
  imagenURL: any; // Variable para almacenar la URL de la imagen
  existenciaI!: IExistenciaVales; //para vales disponibles
  usuariojson: any;
  solicitud : ISolicitudVehiculo[] = [];

  cargaRevision : any[] = [];
  cargaAprobadas : any[] = [];
  cargaRealizadas : any[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private solicitudService : ServicioService,
    ) {}

  ngOnInit() {
    this.fotoEmpleado =  this.usuarioService.empleadofoto;
    this.usuariojson = this.usuarioService.usuarioJSON;
    this.usuarioService.getCards();


   
     // aqui optengo las cards del admin

  }

  get listSoliVeData(){
   // this.solicitudService.getSolicitudesVehiculo(2);
    return this.solicitudService.listSoliVehiculo;
  }

  get listSoliVeData2(){
    // this.solicitudService.getSolicitudesVehiculo(2);
     return this.solicitudService.listSoliVehiculo2;
   }

   get listSoliVeData3(){
    // this.solicitudService.getSolicitudesVehiculo(2);
     return this.solicitudService.listSoliVehiculo3;
   }

   cargarSolicitudesUSER(){

    //this.listSoliVeData2.forEach(element => {
    //  const fecha = new Date(element.fechaSolicitud);
    //  const fecha2 = new Date();

   //   if(fecha.getMonth()==fecha2.getMonth()){
    //      this.carga.push(element);
    //  }

   // });

   //inicio de carga de solicitudes en revision
   this.solicitudService.getSolicitudesVehiculo2(6).then((data) => {
    this.solicitud = data;
      console.log("dasd",this.solicitud)
      this.solicitud.forEach(element => {
        const date = new Date(element.fechaSolicitud);
        if(date.getMonth() == new Date().getMonth()){
          this.cargaRevision.push(element);
        }
        console.log("carga",this.cargaRevision)
      })
  });// carga las solicitudes de vehiculo para el usuario

     //inicio de carga de solicitudes
     this.solicitudService.getSolicitudesVehiculo1(4).then((data) => {
      this.solicitud = data;
        console.log("dasd",this.solicitud)
        this.solicitud.forEach(element => {
          const date = new Date(element.fechaSolicitud);
          if(date.getMonth() == new Date().getMonth()){
            this.cargaAprobadas.push(element);
          }
          console.log("carga",this.cargaAprobadas)
        })
    });// carga las solicitudes de vehiculo para el usuario
    //inicio de carga de solicitudes
    this.solicitudService.getSolicitudesVehiculo3(null).then((data) => {
      this.solicitud = data;
        console.log("dasd",this.solicitud)
        this.solicitud.forEach(element => {
          const date = new Date(element.fechaSolicitud);
          if(date.getMonth() == new Date().getMonth()){
            this.cargaRealizadas.push(element);
          }
          console.log("carga",this.cargaRealizadas)
        })
    });// carga las solicitudes de vehiculo para el usuario

   }

   cargaSoliporAprobar(){

    //inicio de carga de solicitudes por aprobar
    this.solicitudService.getSolicitudesRol(this.usuariojson.role).then((data) => {
      this.solicitud = data;
        console.log("dasd",this.solicitud)
        this.solicitud.forEach(element => {
          const date = new Date(element.fechaSolicitud);
          if(date.getMonth() == new Date().getMonth()){
            this.cargaRevision.push(element);
          }
          console.log("carga revision",this.cargaRevision)
        })
    });
    //fin de la carga
   }

  /* Metodos para optener datos de cards */
  get cards(): DataCards | null {
      return this.usuarioService.cards;
  }

  get empleado(): Empleado | null {
    const usuarioString = this.storage.getItem("usuario");
    if (usuarioString) {
      const usuarioObj = JSON.parse(usuarioString);
      return usuarioObj.empleado;
    }
    return null;
  }

  get fotoempleado(): string | null {
    const foto = this.storage.getItem("empleadoFoto");
    if (foto) {
      return foto;
    }
    return "./../../../assets/images/Default-Avatar.png";
  }
  /* Metodos para optener datos de cards */
}
