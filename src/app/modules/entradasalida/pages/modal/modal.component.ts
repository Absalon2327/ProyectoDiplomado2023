
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NAME_VALIDATE } from 'src/app/constants/constants';
import Swal from 'sweetalert2';
import { EntradaSalidaI, IEntradaSalida } from '../../interface/EntSalinterface';
import { Router } from '@angular/router';
import { ListaentradasalidaService } from '../../service/listaentradasalida.service';
import { MensajesService } from 'src/app/shared/global/mensajes.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() leyenda!: string;
  @Input() leyendas!: string;
  @Input() titulo!: string;
  @Input() entradasalidaOd!: IEntradaSalida;
  @Input() salidaentradaOd!: boolean;

  formBuilder!: FormGroup;
  private isName: string= NAME_VALIDATE;
  entradasalidas: IEntradaSalida[]=[];//para almacenar los resultados
  entrasal:IEntradaSalida;
  

  constructor(private modalService: NgbModal,private mensajesService: MensajesService, private fb: FormBuilder, private router: Router, private listaentradasalidaservice: ListaentradasalidaService) { }

  ngOnInit(): void {

      this.formBuilder = this.Iniciarformulario();
    
  }
  private Iniciarformulario(): FormGroup {1
    return this.fb.group({
      id:[''],
      tipo: ['', [Validators.required, Validators.pattern(this.isName)]],
      fecha: ['', [Validators.required, this.maxDateValidator() ]],
      hora: ['', [Validators.required]],
      kilometraje: ['', [Validators.required]],
      combustible: ['', [Validators.required]],
  
    });
  }
  //funcion para obtener la fecha actual.
  getToday(): Date{
    return new Date();
  }
  // Validador personalizado para la fecha
  maxDateValidator() {
    return (control) => {
      const selectedDate = new Date(control.value);
      const today = this.getToday();

      if (selectedDate > today) {
        return { maxDate: true };
      }

      return null;
    };
  }

  OnlyNumbersAllowed(event):boolean{
    const charCode= (event.wich)? event.wich: event.keyCode;
    if(charCode > 31 && (charCode < 48 || charCode >75))
    {
      console.log('charCode restricted is' + charCode);
      return false;
    }
    return true;
  }

  openModal(content: any) {
    this.modalService.open(content, { size: '', centered: true });
  }
  editando(){
    const ent = this.formBuilder.value;
    console.log(ent);
    
      this.listaentradasalidaservice.putEmpleado(ent).subscribe((resp: any) => {
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
          });

          Toast.fire({
            icon: 'success',
            text: 'Modificación exitosa'
          });

          this.formBuilder.reset();
          this.recargar();
          this.modalService.dismissAll();
        }
      }, (err: any) => {
        this.mensajesService.mensajesSweet(
          "error",
          "Ups... Algo salió mal",
          err
        )
        this.obtenerLista();
          this.recargar();
      });
  }

  guardar() {
    if (this.formBuilder.valid) {
      if (this.entradasalidaOd != null) {
        this.editando();
      } else {
        console.log("antes de registrar");
       this.registrando();
      }
    } else {
      Swal.fire({
        position: 'center',
        title: 'Faltan datos en el formuario',
        text: 'submit disparado, formulario no valido',
        icon: 'warning',
      });
    }
  }

  registrando() {
    const listando = this.formBuilder.value;
  

      const entsali: EntradaSalidaI = new EntradaSalidaI(listando.tipo, listando.fecha, listando.hora, listando.combustible, listando.kilometraje);
      console.log(entsali);

      this.listaentradasalidaservice.NuevosDatos(entsali).subscribe((resp: any) => {
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
          });
          Toast.fire({
            icon: 'success',
            text: 'Almacenamiento exitoso'
          });
          this.formBuilder.reset();
          this.recargar();
          this.modalService.dismissAll();
        }
      }, (err: any) => {
        this.mensajesService.mensajesSweet(
          "error",
          "Ups... Algo salió mal",
          err
        )
        this.obtenerLista();
          this.recargar();
      });
  }

  recargar() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }

  private obtenerLista() {//para poder mostrar e la tabla
    this.listaentradasalidaservice.ObtenerLista.subscribe((resp: IEntradaSalida[]) => {
      this.entradasalidas = resp;
      console.log(resp);
    });
  }
  
  esCampoValido(campo: string){
    const validarCampo= this.formBuilder.get(campo);
    return !validarCampo?.valid && validarCampo?.touched ? 'is-invalid' : validarCampo?.touched? 'is-valid': '';
  
  }

}
