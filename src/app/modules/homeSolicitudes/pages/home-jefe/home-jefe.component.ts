import { Component, OnInit } from '@angular/core';
import { DataCards, Empleado } from 'src/app/account/auth/models/usuario.models';
import { UsuarioService } from 'src/app/account/auth/services/usuario.service';
import { ServicioService } from 'src/app/modules/calendario/servicio/servicio.service';
import { ISolicitudVehiculo } from 'src/app/modules/solicitud-vehiculo/interfaces/data.interface';
import { IExistenciaVales } from 'src/app/modules/solicitudes/Interfaces/existenciavales.interface';

@Component({
  selector: 'app-home-jefe',
  templateUrl: './home-jefe.component.html',
  styleUrls: ['./home-jefe.component.scss']
})
export class HomeJefeComponent implements OnInit {

  isVisible: string;
  storage: Storage = window.localStorage;
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
  cargaAprobar : any[] = [];

  constructor( private usuarioService: UsuarioService,
    private solicitudService : ServicioService,) { }

  ngOnInit(): void {
    this.fotoEmpleado =  this.usuarioService.empleadofoto;
    this.usuariojson = this.usuarioService.usuarioJSON;
    this.usuarioService.getCards();

      this.cargarSolicitudesUSER();
      this.cargaSoliporAprobar();
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

    //inicio de carga de solicitudes en revision
    this.solicitudService.getSolicitudesVehiculo2(6).then((data) => {
     this.solicitud = data;

       this.solicitud.forEach(element => {
           this.cargaRevision.push(element);

       })
   });// carga las solicitudes de vehiculo para el usuario

      //inicio de carga de solicitudes
      this.solicitudService.getSolicitudesVehiculo1(4).then((data) => {
       this.solicitud = data;

         this.solicitud.forEach(element => {
             this.cargaAprobadas.push(element);
         })
     });
     this.solicitudService.getSolicitudesVehiculo1(5).then((data) => {
      this.solicitud = data;

        this.solicitud.forEach(element => {
            this.cargaAprobadas.push(element);
        })
    });// carga las solicitudes de vehiculo para el usuario
     //inicio de carga de solicitudes
     this.solicitudService.getSolicitudesVehiculo3(null).then((data) => {
       this.solicitud = data;

         this.solicitud.forEach(element => {
           const date = new Date(element.fechaSolicitud);
           if(date.getMonth() == new Date().getMonth()){
             this.cargaRealizadas.push(element);
           }

         })
     });// carga las solicitudes de vehiculo para el usuario

    }

    cargaSoliporAprobar(){

     //inicio de carga de solicitudes por aprobar
     this.solicitudService.getSolicitudesRol(this.usuariojson.role).then((data) => {
       this.solicitud = data;

         this.solicitud.forEach(element => {
             this.cargaAprobar.push(element);

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
 }



