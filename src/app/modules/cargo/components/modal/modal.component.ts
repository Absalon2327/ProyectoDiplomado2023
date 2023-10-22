import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICargo } from '../../interface/cargo';
import { CargoService } from '../../service/cargoservice';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MensajesService } from 'src/app/shared/global/mensajes.service';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  formCargo !: FormGroup;
  @Input() cargos !: ICargo;
  @Input() leyenda !: string;
  alerts = [
    {
      id: 1,
      type: "info",
      message:
        " Ingrese un Cargo en mayusculas y complete los campos obligatorios (*)",
      show: false,
    },
  ];


  constructor(private cargoService : CargoService,
    private fb : FormBuilder,
    private router : Router,
    private mensajesService : MensajesService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal  ) {
      this.formCargo = this.iniciarFormulario();
     }

     ngOnInit(): void {


      if(typeof this.cargos != 'undefined'){
        //console.log("trae algo:"+this.cargos);
        this.formCargo.patchValue(this.cargos);
      }
      //console.log("no trae nada"+this.cargos);
    }

     private iniciarFormulario(){
      return this.fb.group({
        nombreCargo : ['',Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*')])],
        descripcion : ['',Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*')])],

      })
    }
//prueba de push

    guardar(){

    if(this.formCargo.valid){
      if(this.cargos != null){
        this.editando();
      //console.log("editando");
      } else {
        //console.log("registrando");
        this.registrando();
      }
    }else{
            this.mensajesService.mensajesToast(
        "warning",
        "Complete lo que se indican"
      );
    }
    }

    registrando(){
    const data : ICargo =
      {
        nombreCargo : this.formCargo.controls['nombreCargo'].value,
        descripcion : this.formCargo.controls['descripcion'].value,
        estado : 8
      }
    ;

    data.nombreCargo = data.nombreCargo.toUpperCase();

    //console.log(data);
    //console.log(this.formCargo.value);

    this.cargoService.saveCargos(data).subscribe({
      next : (resp) => {
        this.modalService.dismissAll();
        this.formCargo.reset();
        this.mostrar();
      },
      error : (error) => {

       this.mensajesService.mensajesSweet(
        'error',
        "Ups... Algo salió mal",
        error
       )
      },
      complete : () => {

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer : 3000,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
        Toast.fire({
          icon: 'success',
          text: 'Datos guardados con exito'
        });

      }
    });

    }

    editando(){

      const data : ICargo =
      {
        id : this.cargos.id,
        nombreCargo : this.formCargo.controls['nombreCargo'].value,
        descripcion : this.formCargo.controls['descripcion'].value,
        estado : 8
      }
    ;

    data.nombreCargo = data.nombreCargo.toUpperCase();

    this.cargoService.editCargo(data.id,data).subscribe({
      next : (resp) => {
        this.formCargo.reset();
        this.modalService.dismissAll();
        this.mostrar();
      },
      error : (error) => {
        this.mensajesService.mensajesSweet(
          'error',
          "Ups... Algo salió mal",
          error
         )

      },
      complete : () => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer : 3000,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
        Toast.fire({
          icon: 'success',
          text: 'Datos guardados con exito'
        });
      }
    });

    }



  esCampoValido(campo:string){
    const validarCampo = this.formCargo.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
    ? 'is-invalid' : validarCampo?.touched ? 'is-valid' : '';
  }

  mostrar(){
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);

  }
/*
  openModal(content: any) {
    this.modalService.open(content);
  }
*/
  openModal(content: any) {
    this.modalService.open(content, {size: 'lg', backdrop: 'static'});
  }

  CambiarAlert(alert) {
    alert.show = !alert.show;
  }

  restaurarAlerts() {
    this.alerts.forEach((alert) => {
      alert.show = true;
    });
  }

  siMuestraAlertas() {
    return this.alerts.every((alert) => alert.show);
  }

  get nombreCargo(){
    return this.formCargo.get('nombreCargo');
  }

  get descripcion(){
    return this.formCargo.get('descripcion');
  }
  }
