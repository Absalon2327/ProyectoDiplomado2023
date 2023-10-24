import {Component, OnInit, ViewChild} from '@angular/core';
import {SolicitudVehiculoService} from "../../services/solicitud-vehiculo.service";
import {ISolicitudVehiculo} from "../../interfaces/data.interface";
import {UsuarioService} from 'src/app/account/auth/services/usuario.service';
import {Usuario} from "../../../../account/auth/models/usuario.models";
import { from } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {

  // migas de pan
  breadCrumbItems: Array<{}>;
  term: any; // para buscar
  items: number = 10;
  p: any; // paginacion

  solicitudesVehiculo: ISolicitudVehiculo [] = [];
  usuario!: Usuario;
  estadoSeleccionado: number;
  @ViewChild('selectElement') selectElement: any; // ViewChild para acceder al elemento select

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

    if (this.estadoSeleccionado == 4 || this.estadoSeleccionado == 5) {

      Swal.fire({
        title: 'Estas seguro?',
        text: "Usa esta acción solamente si hay algún cambio a realizar!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#972727',
        cancelButtonColor: '#2c3136',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          from(this.soliVeService.getSolicitudesVehiculo(this.estadoSeleccionado))
            .subscribe((data: ISolicitudVehiculo[]) => {
              this.listSoliVeData.length = 0;
              this.listSoliVeData.push(...data);
          });
        }
      })

    }else{
      from(this.soliVeService.getSolicitudesVehiculo(this.estadoSeleccionado))
      .subscribe((data: ISolicitudVehiculo[]) => {
        this.listSoliVeData.length = 0;
        this.listSoliVeData.push(...data);
      });
      this.selectElement.nativeElement.selectedIndex = 0;
    }
  }


}
