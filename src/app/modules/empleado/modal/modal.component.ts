import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmpleadoService } from '../service/empleado.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ICargo, IDepartamento, IEmpleado, IEmpleadoTabala } from '../interface/empleado.interface';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() empleadOd!: IEmpleado;
  @Input() motoristaOd!: boolean;
  @Input() leyenda!: string;
  @Input() titulo!: string;
  @Input() queryString: string;

  public imgTemp: string | ArrayBuffer = null;

  cargos: ICargo[] = [];
  departamentos: IDepartamento[] = [];

  formBuilder!: FormGroup;

  cargo: ICargo;
  departamento: IDepartamento;
  empleado: IEmpleado;
  esMotorista: boolean = false;
  private file!: File;

  buttomtext: string = 'Guardar';
  imagen: string = 'no hay';


  constructor(private empleadoService: EmpleadoService, private modalService: NgbModal, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.formBuilder = this.Iniciarformulario();

    this.empleado = {
      dui: "",
      nombre: "",
      apellido: "",
      telefono: "",
      licencia: "",
      tipo_licencia: "",
      fecha_licencia: new Date(),
      estado: 7,
      jefe: false,
      correo: "",
      nombrefoto: "",
      urlfoto: "",
      cargo: null,
      departamento: null
    }

    this.cargo = {
      codigoCargo: 0,
      nombreCargo: "",
      descripcion: "",
      estado: 0
    }

    this.departamento = {
      codigoDepto: 0,
      nombre: "",
      estado: 0
    }

    this.getCargos();
    this.getDepartamentos();
  }

  private Iniciarformulario(): FormGroup {
    return this.fb.group({
      file: [this.empleadOd != null ? '' : '', [this.empleadOd == null ? Validators.required : Validators.nullValidator]],
      dui: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      licencia: [(this.esMotorista || this.motoristaOd) ? '' : '', [(this.esMotorista || this.motoristaOd) ? Validators.nullValidator : Validators.required]],
      tipolicencia: [(this.esMotorista || this.motoristaOd) ? '' : '', [(this.esMotorista || this.motoristaOd) ? Validators.nullValidator : Validators.required]],
      fechalicencia: [(this.esMotorista || this.motoristaOd) ? '' : '', [(this.esMotorista || this.motoristaOd) ? Validators.nullValidator : Validators.required]],
      jefe: [false, [Validators.required]],
      correo: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
    });    
  }

  getCargos() {
    this.empleadoService
      .getCargos()
      .subscribe((res) => {
        this.cargos = [...this.cargos, ...res];
      });

  }

  getDepartamentos() {
    this.empleadoService
      .getDepartamentos()
      .subscribe((res) => {
        this.departamentos = [...this.departamentos, ...res];
      });
  }

  openModal(content: any) {
    this.modalService.open(content, { size: 'xl', centered: true });
  }

  guardar() {
    if (this.formBuilder.valid || (this.formBuilder.get("licencia").value == '' || this.formBuilder.get("tipolicencia").value == '' || this.formBuilder.get("fechalicencia").value == '' || this.formBuilder.get("file").value == '')) {
      if (this.empleadOd != null) {
        this.editando();
      } else {
        this.registrando();
      }
    } else {
      Swal.fire({
        position: 'center',
        title: 'Faltan datos en el formuario',
        text: 'Complete todos los campos requeridos',
        icon: 'warning',
      });
    }
  }

  registrando() {

    this.empleado.dui = this.formBuilder.get('dui').value;
    this.empleado.nombre = this.formBuilder.get('nombre').value;
    this.empleado.apellido = this.formBuilder.get('apellido').value;
    this.empleado.telefono = this.formBuilder.get('telefono').value;
    this.empleado.licencia = this.formBuilder.get('licencia').value;
    this.empleado.tipo_licencia = this.formBuilder.get('tipolicencia').value;
    this.empleado.fecha_licencia = this.formBuilder.get('fechalicencia').value;
    this.empleado.jefe = this.formBuilder.get('jefe').value;
    this.empleado.correo = this.formBuilder.get('correo').value;

    //asignar cargo
    this.cargo.codigoCargo = this.formBuilder.get('cargo').value;

    this.empleado.cargo = this.cargo;

    //asignar departamento
    this.departamento.codigoDepto = this.formBuilder.get('departamento').value;

    this.empleado.departamento = this.departamento;

    this.empleadoService.postEmpleado(this.empleado, this.file).subscribe((resp: any) => {
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
    });

  }

  SelectCargo() {
    // Lógica para determinar si el cargo seleccionado es "Motorista"

    //obtenemos el objeto que tenga como nombreCargo Motorista
    const motoristaOb = this.cargos.find(cargo => cargo.nombreCargo === "Motorista");
    //Comparamos que el ID sea igual al seleccionado y cambiamos la variable para mostrar los demas campos
    this.esMotorista = (this.formBuilder.get('cargo').value === motoristaOb.codigoCargo);
    this.motoristaOd = this.esMotorista;
  }


  editando() {

    this.empleadOd.dui = this.formBuilder.get('dui').value;
    this.empleadOd.nombre = this.formBuilder.get('nombre').value;
    this.empleadOd.apellido = this.formBuilder.get('apellido').value;
    this.empleadOd.telefono = this.formBuilder.get('telefono').value;

    this.empleadOd.licencia = this.esMotorista || this.motoristaOd ? this.formBuilder.get('licencia').value : '';
    this.empleadOd.tipo_licencia = this.esMotorista || this.motoristaOd ? this.formBuilder.get('tipolicencia').value : '';
    this.empleadOd.fecha_licencia = this.esMotorista || this.motoristaOd ? this.formBuilder.get('fechalicencia').value : null;

    this.empleadOd.jefe = this.formBuilder.get('jefe').value;
    this.empleadOd.correo = this.formBuilder.get('correo').value;
    //asignar cargo
    this.empleadOd.cargo.codigoCargo = this.formBuilder.get('cargo').value;
    //asignar departamento
    this.empleadOd.departamento.codigoDepto = this.formBuilder.get('departamento').value;
    
    if (this.imagen === 'no hay') {
      this.empleadoService.putEmpleado(this.empleadOd).subscribe((resp: any) => {
        if (resp) {
          Swal.fire({
            position: 'center',
            title: 'Buen trabajo',
            text: 'Datos modificados con exito',
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
      });
    } else {
      this.empleadoService.putEmpleadoImagen(this.empleadOd, this.file).subscribe((resp: any) => {
        if (resp) {
          Swal.fire({
            position: 'center',
            title: 'Buen trabajo',
            text: 'Datos modificados con exito',
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
      });
    }
  }

  recargar() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }


  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.file = (target.files as FileList)[0];
    this.imagen = 'seleccioanda';
    this.preVisualizarImagen(event);
  }

  preVisualizarImagen(event: any) {
    this.file = event.target.files[0];
    //cambia a imagen previa
    if (!this.file) {
      this.imgTemp = null;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

}
