import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDepto } from '../../interface/depto';
import { DeptoService } from '../../service/depto.service';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MensajesService } from 'src/app/shared/global/mensajes.service';
import { NAME_TILDES_VALIDATE } from 'src/app/constants/constants';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  formDepto !: FormGroup;
  @Input() deptos !: IDepto;
  @Input() leyenda !: string;
  private isText : string =  NAME_TILDES_VALIDATE;

  alerts = [
    {
      id: 1,
      type: "info",
      message:
        " Ingrese un Cargo en mayusculas y complete los campos obligatorios (*)",
      show: false,
    },
  ];

  constructor(private deptopService : DeptoService,
    private fb : FormBuilder,
    private router : Router,
    private modalService: NgbModal,
    private mensajesService : MensajesService,
    public activeModal: NgbActiveModal) {
      this.formDepto = this.iniciarFormulario();
    }

  ngOnInit(): void {
    if(typeof this.deptos != 'undefined'){
      this.formDepto.patchValue(this.deptos);
    }
  }

  private iniciarFormulario(){
    return this.fb.group({
      nombre : ['',Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*')])],
      descripcion : ['',Validators.compose([Validators.required, Validators.pattern(this.isText)])],
      tipo : ['',Validators.compose([Validators.required])]
    })
  }

  guardar(){

    if(this.formDepto.valid){
      if(this.deptos != null){
        this.editando();
      console.log("editando");
      } else {
        console.log("registrando");
        this.registrando();
      }
    }else{
      Swal.fire({
        position: 'center',
        title: 'Faltan datos en el formuario',
        text: 'Complete todos los campos requeridos',
        icon: 'warning',
      });
    }
    }

    registrando(){
      const data : IDepto =
        {
          nombre : this.formDepto.controls['nombre'].value,
          descripcion : this.formDepto.controls['descripcion'].value,
          tipo : this.formDepto.controls['tipo'].value,
          estado : 8
        }
      ;

      data.nombre = data.nombre.toUpperCase();

      console.log(data);
      console.log(this.formDepto.value);

      this.deptopService.saveDepto(data).subscribe({
        next : (resp) => {
          this.modalService.dismissAll();
          this.formDepto.reset();
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
            text: 'Datos Guardados con exito'
          });

        }
      });
      }

      editando(){

        const data : IDepto =
        {
          codigoDepto : this.deptos.codigoDepto,
          nombre : this.formDepto.controls['nombre'].value,
          descripcion : this.formDepto.controls['descripcion'].value,
          tipo : this.formDepto.controls['tipo'].value,
          estado : 8
        }
      ;

      data.nombre = data.nombre.toUpperCase();

      this.deptopService.editDepto(data.codigoDepto,data).subscribe({
        next : (resp) => {
          this.formDepto.reset();
          this.modalService.dismissAll();
          this.mostrar();
        },
        error : (error) => {
          this.mensajesService.mensajesSweet(
            'error',
            "Ups... Algo salió mal",
            error
           )
          console.log(error);
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
            text: 'Datos Guardados con exito'
          });
        }
      });
      }

      esCampoValido(campo:string){
        const validarCampo = this.formDepto.get(campo);
        return !validarCampo?.valid && validarCampo?.touched
        ? 'is-invalid' : validarCampo?.touched ? 'is-valid' : '';
      }

      noRequiereValor(campo:string):string{
        return this.formDepto.get(campo)?.value ? 'is-valid' : '';
      }

      mostrar(){
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);

      }

      openModal(content: any) {
        this.modalService.open(content);
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

      get nombre(){
        return this.formDepto.get('nombre');
      }

      get descripcion(){
        return this.formDepto.get('descripcion');
      }
}
