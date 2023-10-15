import { Component, OnInit } from '@angular/core';

import { DataCards, Empleado } from 'src/app/account/auth/models/usuario.models';
import { UsuarioService } from 'src/app/account/auth/services/usuario.service';

import { IExistenciaVales } from 'src/app/modules/solicitudes/Interfaces/existenciavales.interface';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss']
})
export class HomeAdminComponent implements OnInit {

  isVisible: string;
  storage: Storage = window.localStorage;
  //emailSentBarChart: ChartType;
  //monthlyEarningChart: ChartType;
  transactions: Array<[]>;
  statData: Array<[]>;

  isActive: string;

  fotoEmpleado!: string;
  usuario!: string;
  imagenBlob: Blob | null = null;
  imagenURL: any; // Variable para almacenar la URL de la imagen
  existenciaI!: IExistenciaVales; //para vales disponibles
  usuariojson: any;


  constructor(private usuarioService: UsuarioService,
 ) { }

  ngOnInit(): void {
    this.fotoEmpleado =  this.usuarioService.empleadofoto;
    this.usuariojson = this.usuarioService.usuarioJSON;
    this.usuarioService.getCards();





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

