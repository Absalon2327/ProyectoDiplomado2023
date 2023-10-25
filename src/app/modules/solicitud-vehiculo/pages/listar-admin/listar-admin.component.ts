import { Component, OnInit } from '@angular/core';
import {SolicitudVehiculoService} from "../../services/solicitud-vehiculo.service";
import Swal from "sweetalert2";
import {Usuario} from "../../../../account/auth/models/usuario.models";

@Component({
  selector: 'app-listar-admin',
  templateUrl: './listar-admin.component.html',
  styleUrls: ['./listar-admin.component.scss']
})
export class ListarAdminComponent implements OnInit {
  // migas de pan
  breadCrumbItems: Array<{}>;
  term: any; // para buscar
  estadoSeleccionado: number;
  usuario!: Usuario;

  constructor(private serviceSoliVe: SolicitudVehiculoService) { }

  ngOnInit(): void {
    this.obtenerUsuarioActivo();
    this.breadCrumbItems = [{ label: 'Solicitud de Vehículo' }, { label: 'Listar', active: true }];
  }


  filtrar(event: any) {
    this.estadoSeleccionado = event.target.value ? event.target.value : null;
    let alertLoading: any;
    // Mostrar SweetAlert de carga
    alertLoading = Swal.fire({
      title: 'Espere un momento!',
      html: 'Se está procesando la información...',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.serviceSoliVe.getSolicitudesVehiculo(this.estadoSeleccionado).then(result => {
      alertLoading.close();
    })
    .catch(error => {
      console.error('Error al obtener las solicitudes de vehículo', error);
      alertLoading.close();
    });
  }
  get listSoliVeData(){
    if (this.serviceSoliVe.listSoliVehiculo) {
      return this.serviceSoliVe.listSoliVehiculo;
    } else {
      return [];
    }
  }

  obtenerUsuarioActivo(){
    this.serviceSoliVe.getUsuarioSV().subscribe((usuario: Usuario) => {
      this.usuario = usuario;
    });
  }
}
