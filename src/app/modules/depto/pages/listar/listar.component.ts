import { Component, OnInit } from '@angular/core';
import { IDepto } from '../../interface/depto';
import { DeptoService } from '../../service/depto.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {



  breadCrumbItems: Array<{}>;
  lstDeptos: IDepto[] = [];
  cambio: string;
  term: string = '';
  p: any;

  constructor(private deptoService : DeptoService,
    private modalService: NgbModal,
    private router : Router) { }


  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Departamento' }, { label: 'Listar', active: true }];
    this.getDeptosAll();
  }

  cargaDeptos(event : any){
    const estado = event.target.value;
    //this.getDeptos(Number(estado));
    this.getDeptosAll();
  }

  getDeptos(estado : number){
    this.deptoService.getDeptos(estado).subscribe((data: IDepto[]) => {
      this.lstDeptos = data;
    });
  }

  getDeptosAll(){
    this.deptoService.getDeptosAll().subscribe((data: IDepto[]) => {
      this.lstDeptos = data;
    });
  }

  cambiarEstado(data: IDepto, estado: number) {

    if(estado == 8){

      this.cambio = 'Inactivo';
    }else{

      this.cambio = 'Activo';
    }


    Swal.fire({
      icon: 'question',
    title: "¿Cambiar el estado a " + this.cambio + "?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Cambiar",
    denyButtonText: `No cambiar`,
    }).then((result) => {
      if (result.isConfirmed) {

        if(estado == 8){
          data.estado = 9;

        }else{
          data.estado = 8;
          
        }

        this.deptoService.editDepto(data.codigoDepto, data).subscribe({
          next: (resp) => {

            this.mostrar();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Algo paso, hable con el administrador',
            });

          },
          complete: () => {



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
            })
          },
        });
      } else if (result.isDenied) {
        Swal.fire("Cambios no aplicados", "", "info");

      }


    });

   // this.cargoService.editCargo(data.id, { estado: estado }).subscribe((data: ICargo) => {
   //   this.getCargos(8);
   // });
}

abrirModal(leyenda: string) {
  const modalRef = this.modalService.open(ModalComponent);
  modalRef.componentInstance.leyenda = leyenda;
}

abrirModal2(leyenda: string, data: IDepto) {

const modalRef = this.modalService.open(ModalComponent);
modalRef.componentInstance.leyenda = leyenda; // Pasa la leyenda al componente modal
modalRef.componentInstance.deptos = data; // Pasa la data al componente modal
}
mostrar(){
  let currentUrl = this.router.url;
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate([currentUrl]);

}

}
