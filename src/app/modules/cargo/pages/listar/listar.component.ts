import { Component, OnInit } from '@angular/core';
import { CargoService } from '../../service/cargoservice';
import { ICargo } from '../../interface/cargo';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../components/modal/modal.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  lstCargos: ICargo[] = [];
  cambio: string;
  term: string = '';
  p: any;

  selectedData: any;
  constructor(private cargoService : CargoService,
    private modalService: NgbModal,
    private router : Router,) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Cargo' }, { label: 'Listar', active: true }];
    this.getCargoAll();
  }

  cargaCargos(event : any){
  const estado = event.target.value;
  //this.getCargos(Number(estado));
  this.getCargoAll();
  }

  getCargos(estado : number){
    console.log(estado);
    this.cargoService.getCargos(estado).subscribe((data: ICargo[]) => {
      this.lstCargos = data;
    });
  }

  getCargoAll(){
    this.cargoService.getCargosAll().subscribe((data: ICargo[]) => {
      this.lstCargos = data;
    });
  }

  cambiarEstado(data: ICargo, estado: number) {

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

          this.cargoService.editCargo(data.id, data).subscribe({
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

abrirModal2(leyenda: string, data: ICargo) {
  this.selectedData = data; // Almacena los datos del registro seleccionado
  const modalRef = this.modalService.open(ModalComponent);
  modalRef.componentInstance.leyenda = leyenda; // Pasa la leyenda al componente modal
  modalRef.componentInstance.cargos = this.selectedData; // Pasa la data al componente modal
}
  mostrar(){
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);

  }


}
