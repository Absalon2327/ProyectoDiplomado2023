import {Component, OnInit} from '@angular/core';
import {SolicitudVehiculoService} from "../../services/solicitud-vehiculo.service";
import {ISolicitudVehiculo} from "../../interfaces/data.interface";
import {UsuarioService} from 'src/app/account/auth/services/usuario.service';
import {Usuario} from "../../../../account/auth/models/usuario.models";

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {

  // migas de pan
  breadCrumbItems: Array<{}>;
  term: any; // para buscar
  p: any; // paginacion

  solicitudesVehiculo: ISolicitudVehiculo [] = [];
  usuario!: Usuario;
  estadoSeleccionado: number;

  constructor( private soliVeService: SolicitudVehiculoService,
    private userService: UsuarioService) {
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Solicitud de Vehículo' }, { label: 'Lista', active: true }]; // miga de pan
    this.userService.getUsuario();
    this.obtenerUsuarioActivo();
  }

  obtenerUsuarioActivo(){
    this.soliVeService.getUsuarioSV().subscribe((usuario: Usuario) => {
      this.usuario = usuario;
      this.soliVeService.getSolicitudesRol(this.usuario.role);
    });
  }

  get usuarioActivo(){
    return this.userService.usuario;
  }

  get listSoliVeData(){
    return this.soliVeService.listSoliVehiculoRol;
  }

  calcularNumeroCorrelativo(index: number): number {
    if (typeof this.p === 'number') {
      return (this.p - 1) * 10 + index + 1;
    } else {
      return index + 1; // Si no es numérico, solo regresamos el índice + 1
    }
  }

  filtrar(event: any) {
    this.estadoSeleccionado = event.target.value ? event.target.value : null;
    this.soliVeService.getSolicitudesVehiculo(this.estadoSeleccionado);
  }

}
