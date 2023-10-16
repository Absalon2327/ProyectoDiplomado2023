import { Component, Input, OnInit } from '@angular/core';
import { IVehiculos } from '../../interfaces/vehiculo-interface';
import { VehiculoService } from '../../service/vehiculo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';
import Swal from 'sweetalert2';
import { MensajesService } from 'src/app/shared/global/mensajes.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})
export class TablaComponent implements OnInit {

  @Input() vehiculos: IVehiculos[] = [];
  @Input() busqueda: string = '';

  p: any;
  cambio:string = '';
  estado:number = 8;

  constructor(private vehiService:VehiculoService, private serviModal: NgbModal, private mensajesService: MensajesService) { }

  ngOnInit(): void {

  }

  abrirModal(leyenda: string, objVehiculo:IVehiculos) {
    const modalRef = this.serviModal.open(ModalComponent, {
      size: "xl",
      centered: true,
      backdrop: "static" as "static",
    });
    modalRef.componentInstance.titulo = leyenda;
    modalRef.componentInstance.objVehiculo = objVehiculo;
  }

  cambiarEstado(vehiculoED: IVehiculos, estado: number) {
    const envObj = vehiculoED;
    const formData = new FormData();
    if(envObj.estado == 8){
      this.cambio = 'Inactivo';
      this.estado = 9;
      //envObj.estado = 9;
    }else{
      this.cambio = 'Activo';
      this.estado = 8;
      //envObj.estado = 8;
    }

    Swal.fire({
      icon: "question",
      title: "¿Cambiar el estado a " + this.cambio + "?",
      showDenyButton: true,
      denyButtonColor: "#2c3136",
      denyButtonText: "No cambiar",
      confirmButtonColor: "#972727",
      confirmButtonText: "Cambiar",
    }).then((result) => {
      if (result.isConfirmed) {
        envObj.estado = this.estado;
        formData.append('vehiculo', new Blob([JSON.stringify(envObj)], {type: 'application/json'}));
        this.vehiService.editarVehiculo(formData).subscribe((resp: any) => {
          if (resp) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              //timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'success',
              text: 'Modificación exitosa'
            });
            this.vehiService.getVehiculos();
          }
        }, (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err,
          });
        });
      } else if (result.isDenied) {
        this.mensajesService.mensajesToast("info", "Acción Cancelada!");
      }
    });
  }



}
