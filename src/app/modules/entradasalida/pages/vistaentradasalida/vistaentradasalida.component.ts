import { MensajesService } from 'src/app/shared/global/mensajes.service';
import { Component, OnInit, Input } from '@angular/core';
import { EntradaSalidaI, IEntradaSalida } from '../../interface/EntSalinterface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListaentradasalidaService } from '../../service/listaentradasalida.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NAME_VALIDATE } from 'src/app/constants/constants';


@Component({
  selector: 'app-vistaentradasalida',
  templateUrl: './vistaentradasalida.component.html',
  styleUrls: ['./vistaentradasalida.component.scss']
})
export class VistaentradasalidaComponent implements OnInit {
  //formularioGeneral!: FormGroup;//formularioGeneral= new FormGroup({});
  entradasalidas: IEntradaSalida[]=[];//para almacenar los resultados
  breadCrumbItems: Array<{}>;
  @Input() queryString: string;
  @Input() entradasalidaOd!: IEntradaSalida;
  private isName: string= NAME_VALIDATE;
  ///public fechaminima:Date;
  //public fechamaxima:Date;
  //public fechaStrMinima:string;
  //public fechaStrMaxima:string;



  formBuilder!: FormGroup;
  page: number = 0;
  size: number = 5;
  isFirst : boolean = false;
  isLast : boolean= false;
  totalPages: Array<number> = []
  totalElement: number = 0
  p: any;
  term: string = '';
  //currentDate: Date = new Date();
  //formattedDate: string = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');



  /////para probar
  submit: boolean;
  formsubmit: boolean;
  typesubmit: boolean;
  rangesubmit: boolean;
  validationform: FormGroup;
  //public myForm: FormGroup;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private listaentradasalidaservice: ListaentradasalidaService, private router: Router, private mensajesService: MensajesService) {
    this.breadCrumbItems = [{ label: 'Entradas y Salidas' }, { label: 'Vista', active: true }];//Migas de pan
  }

  ngOnInit(): void {
    this.obtenerLista();
    this.formBuilder = this.Iniciarformulario();

    //validacion del campo de fecha
    //this.myForm= this.createform();
    //this.fechaminima= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-1)
    //this.fechaStrMinima=this.pd.transform(this.fechaminima, "yyyy-MM-dd", 'UTC');
    //this.fechamaxima= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1)
    //this.fechaStrMaxima=this.pd.transform(this.fechamaxima, "yyyy-MM-dd", 'UTC');
  }


  OnlyNumbersAllowed(event):boolean{
    const charCode= (event.wich)? event.wich: event.keyCode;
    if(charCode > 31 && (charCode < 48 || charCode >75))
    {
      return false;
    }
    return true;
  }

  guardar() {
    if (this.formBuilder.valid) {
      if (this.entradasalidaOd != null) {
        //this.editando();
      } else {
       this.registrando();
      }
    } else {
      
            this.mensajesService.mensajesToast(
        "warning",
        "Complete lo que se indican"
      );
    }
  }

  registrando() {
    const listando = this.formBuilder.value;


      const entsali: EntradaSalidaI = new EntradaSalidaI(listando.tipo, listando.fecha, listando.hora, listando.combustible, listando.kilometraje);

      this.listaentradasalidaservice.NuevosDatos(entsali).subscribe((resp: any) => {
        if (resp) {
          Swal.fire({
            position: 'center',
            title: 'Buen trabajo',
            text: 'Datos guardados con exito',
            icon: 'info',
          });
          this.formBuilder.reset();
          this.recargar();
          this.modalService.dismissAll();
        }
      }, (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Algo paso, hable con el administrador',
        });
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

private Iniciarformulario(): FormGroup {1
  return this.fb.group({
    tipo: ['', [Validators.required, Validators.pattern(this.isName)]],
    fecha: ['', [Validators.required]],
    hora: ['', [Validators.required]],
    kilometraje: ['', [Validators.required]],
    combustible: ['', [Validators.required]],

  });
}

private obtenerLista() {//para poder mostrar e la tabla
  this.listaentradasalidaservice.ObtenerLista.subscribe((resp: IEntradaSalida[]) => {
    this.entradasalidas = resp;
  });
}

esCampoValido(campo: string){
  const validarCampo= this.formBuilder.get(campo);
  return !validarCampo?.valid && validarCampo?.touched ? 'is-invalid' : validarCampo?.touched? 'is-valid': '';

}
/**
     * Open modal
     * @param content modal content
     */
openModal(content: any) {
  this.modalService.open(content);

}

  /**********************PAGINACION************************* */

  setSize(num: number) {
    this.size = num;
    //this.cargarDatos();
  }

  setPage(page: number) {
    this.page = page;
    //this.cargarDatos();

  }

  retroceder(){
    if(!this.isFirst){
      this.page--;
    //  this.cargarDatos();
    }
    return this.page;
  }
  adelante(){
    if(!this.isLast){
      this.page++;
      //this.cargarDatos();
    }
    return this.page;
  }


  ////probando
  get form() {
    return this.validationform.controls;
  }

}
