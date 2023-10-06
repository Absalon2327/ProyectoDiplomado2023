import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmpleadoService } from '../../service/empleado.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ICargo, IDepto, IEmpleado } from '../../interface/empleado.interface';

import { EMAIL_VALIDATE_UES, NAME_VALIDATE } from 'src/app/constants/constants';
import { MensajesService } from 'src/app/shared/global/mensajes.service';
import { UsuarioService } from 'src/app/account/auth/services/usuario.service';
import { IEmail } from 'src/app/account/auth/interfaces/usuario';

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

  private isEmail: string = EMAIL_VALIDATE_UES;
  private isText: string = NAME_VALIDATE;

  cargos: ICargo[] = [];
  departamentos: IDepto[] = [];

  formBuilder!: FormGroup;

  esMotorista: boolean = false;
  private file!: File;

  imagen: string = 'no hay';

  hovered: boolean = false; // Inicializamos hovered como falso

  alerts = [
    {
      id: 1,
      type: "info",
      message:
        " Por favor, asegúrese de completar todos los campos obligatorios (*) y de cumplir con los formatos correspondientes. Además, le recomendamos prestar atención a los mensajes de alerta. En cuanto a la foto del empleado no es obligatoria; Indicar que el empleado sera jefe del área o departamento correspondiente solamente cuando sea acorde a sus responsabilidades laborales. ",
      show: false,
    },
  ];


  constructor(
    private empleadoService: EmpleadoService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private mensajesService: MensajesService,
    private usuarioService: UsuarioService
  ) {
    this.formBuilder = this.Iniciarformulario();
  }

  ngOnInit(): void {
    if (this.leyenda == "Editar") {
      this.formBuilder = this.Iniciarformulario();
    }

    this.empleadoService.getCargos();
    this.empleadoService.getDepartamentos();
  }

  private Iniciarformulario(): FormGroup {
    return this.fb.group({
      codigoEmpleado: [''],
      dui: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.pattern(this.isText)]],
      apellido: ['', [Validators.required, Validators.pattern(this.isText)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[267]\d{7}$/)]],
      licencia: ['', this.motoristaOd ? [Validators.required] : []],
      tipolicencia: ['', this.motoristaOd ? [Validators.required] : []],
      fechalicencia: ['', this.motoristaOd ? [Validators.required] : []],
      /*   jefe: [false, [Validators.required]], */
      estado: [8],
      nombrefoto: [''],
      urlfoto: [''],
      correo: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      cargo: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
    });
  }

  ////////////// >>>>> metodos primarios <<<<<   /////////////

  //// metodo para obtener los cargos /////
  get Cargos() {
    const cargos: ICargo[] = [];

    if (this.leyenda == "Editar") {
      cargos.push(this.empleadOd.cargo)
    }

    this.empleadoService.listCargos.forEach((x) => {
      if (this.leyenda == "Editar") {
        if (x.estado == 8 && x.id != this.empleadOd.cargo.id) {
          cargos.push(x);
        }
      } else {
        if (x.estado == 8) {
          cargos.push(x);
        }
      }
    });
    return cargos;
  }

  //// metodo para obtener los departamentos /////
  get Departamentos() {
    const departamentos: IDepto[] = [];

    if (this.leyenda == "Editar") {
      departamentos.push(this.empleadOd.departamento)
    }

    this.empleadoService.listDepartamentos.forEach((x) => {
      if (this.leyenda == "Editar") {
        if (x.estado == 8 && x.codigoDepto != this.empleadOd.departamento.codigoDepto) {
          departamentos.push(x);
        }
      } else {
        if (x.estado == 8) {
          departamentos.push(x);
        }
      }
    });
    return departamentos;
  }

  ////// metodo para tomar la desicion si es registro o actualizacion /////
  guardar() {
    if (this.formBuilder.valid) {
      this.cargando();
      if (this.empleadOd != null) {
        this.editando();
      } else {
        this.registrando();
      }
    } else {
      Swal.fire({
        position: 'center',
        title: 'Faltan datos en el formuario',
        html: 'Complete todos los campos requeridos (<span style="color: red;">*</span>)',
        icon: 'warning',
      });

    }
  }

  /////////// metodo para enviar EMAIL///////////

  Email(correo: string, nombre: string) {
    const email: IEmail = {
      asunto: '!Bienvenid@¡',
      titulo: 'Registro de empleado',
      email: correo,
      receptor: "Estimad@ : " + nombre,
      mensaje: 'Se han registrado sus datos en el sistema de Misiones de la Universidad de El Salvador - Facultad Multidisciplinaria Paracentral. Para iniciar sesión por primera vez, utilice como nombre de usuario el habitual que son los parámetros de su correo electrónico antes de "@", y su clave por defecto será su número de DUI, la cual deberá cambiar una vez haya iniciado sesión.',
      centro: 'Gracias por su atención a este importante mensaje.',
      codigo: '',
      abajo: 'Pagina principal : ' + 'http://localhost:4200/',
    }

    this.usuarioService.SendEmail(email).subscribe(
      (resp) => {
        Swal.close();
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          //timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });

        Toast.fire({
          icon: 'success',
          text: 'Almacenamiento exitoso'
        }).then(() => {
          this.formBuilder.reset();
          this.recargar();
          this.modalService.dismissAll();
        });
      },
      (err) => {
        Swal.close();
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          //timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });

        Toast.fire({
          icon: 'success',
          text: 'Almacenamiento exitoso'
        }).then(() => {
          this.formBuilder.reset();
          this.recargar();
          this.modalService.dismissAll();
        });
      }
    );
  }

  registrando() {

    const empleado = this.formBuilder.value;
    if (this.imagen === 'no hay') {
      this.empleadoService.postEmpleado(empleado).subscribe((resp: any) => {
        if (resp) {
          this.Email(this.formBuilder.get('correo').value, this.formBuilder.get('nombre').value + ' ' + this.formBuilder.get('apellido').value);
        }
      }, (err: any) => {
        this.mensajesService.mensajesSweet(
          "error",
          "Ups... Algo salió mal",
          err.error.message
        )
      });
    } else {
      this.empleadoService.postEmpleadoImagen(empleado, this.file).subscribe((resp: any) => {
        if (resp) {
          this.Email(this.formBuilder.get('correo').value, this.formBuilder.get('nombre').value + ' ' + this.formBuilder.get('apellido').value);
        }
      }, (err: string) => {
        this.mensajesService.mensajesSweet(
          "error",
          "Ups... Algo salió mal",
          err
        )
      });
    }

  }

  ///////// metodo para editar empleado con imagen o sin imagen ///////
  editando() {
    const empleado = this.formBuilder.value;
    empleado.nombrefoto = this.empleadOd.nombrefoto;
    empleado.urlfoto = this.empleadOd.urlfoto;
    if (this.imagen === 'no hay') {
      this.empleadoService.putEmpleado(empleado).subscribe((resp: any) => {
        if (resp) {
          Swal.close();
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            //timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          });

          Toast.fire({
            icon: 'success',
            text: 'Modificación exitosa'
          }).then(() => {
            this.formBuilder.reset();
            this.recargar();
            this.modalService.dismissAll();
          });
        }
      }, (err: any) => {
        this.mensajesService.mensajesSweet(
          "error",
          "Ups... Algo salió mal",
          err.error.message
        )
      });
    } else {
      this.empleadoService.putEmpleadoImagen(empleado, this.file).subscribe((resp: any) => {
        if (resp) {
          Swal.close();
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            //timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          });

          Toast.fire({
            icon: 'success',
            text: 'Modificación exitosa'
          }).then(() => {
            this.formBuilder.reset();
            this.recargar();
            this.modalService.dismissAll();
          });

          this.formBuilder.reset();
          this.recargar();
          this.modalService.dismissAll();
        }
      }, (err: any) => {
        this.mensajesService.mensajesSweet(
          "error",
          "Ups... Algo salió mal",
          err.error.message
        )
      });
    }
  }

  ////////////// >>>>> metodos secundarios de validacion y acciones  <<<<<   /////////////

  //// Metodo para validacion de fecha /////
  validarfecha() {
    const currentDate = new Date();
    const fechaString = this.formBuilder.get('fechalicencia').value; // Debe ser un string en formato 'yyyy-MM-dd'
    const fecha = new Date(fechaString);

    if (!isNaN(fecha.getTime())) {
      if (fecha <= currentDate) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });

        Toast.fire({
          icon: 'warning',
          text: 'Fecha invalida'
        });

        this.formBuilder.get('fechalicencia').setValue(null);
      }
    }
  }

  /////// metodo para modificacion de validaciones y estados cambiando el formulario a comveniencia si el empleado es motorista o no //////

  SelectCargo(newValue: string) {
    // Lógica para determinar si el cargo seleccionado es "Motorista"

    //obtenemos el objeto que tenga como nombreCargo Motorista
    const motoristaOb = this.Cargos.find(cargo => cargo.nombreCargo === "MOTORISTA");
    //Comparamos que el ID sea igual al seleccionado y cambiamos la variable para mostrar los demas campos
    this.esMotorista = (this.formBuilder.get('cargo').value === motoristaOb.id);
    this.motoristaOd = this.esMotorista;

    // Retrasamos la actualización del teléfono en 3 segundos
    setTimeout(() => {
      this.formBuilder.get('telefono').setValue(newValue); // Función para cambiar teléfono
    }, 50); // 1000 milisegundos = 1 segundos

    // Asignar o quitar validadores según el valor de esmotorista
    const licenciaControl = this.formBuilder.get('licencia');
    const tipolicenciaControl = this.formBuilder.get('tipolicencia');
    const fechalicenciaControl = this.formBuilder.get('fechalicencia');

    if (this.esMotorista) {
      licenciaControl.setValidators([Validators.required]);
      tipolicenciaControl.setValidators([Validators.required]);
      fechalicenciaControl.setValidators([Validators.required]);
    } else {
      licenciaControl.clearValidators();
      tipolicenciaControl.clearValidators();
      fechalicenciaControl.clearValidators();

      licenciaControl.setValue('');
      tipolicenciaControl.setValue('');
      fechalicenciaControl.setValue('');
      fechalicenciaControl.reset();

      if (this.empleadOd) {
        this.empleadOd.licencia = "";
        this.empleadOd.tipolicencia = "";
        this.empleadOd.fechalicencia = new Date();
      }

    }
    licenciaControl.updateValueAndValidity();
    tipolicenciaControl.updateValueAndValidity();
    fechalicenciaControl.updateValueAndValidity();

  }

  //// metodo par abrir la modal ////
  openModal(content: any) {
    //hacer que la modal no se cierre al precionar fuera de ella -> backdrop: 'static', keyboard: false
    this.modalService.open(content, { size: 'xl', centered: true, backdrop: 'static', keyboard: false });
  }


  ///// Metodo para recargar la pagina /////
  recargar() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }

  //// metodo para validar el campo si es valido o no ////
  esCampoValido(campo: string) {
    const validarCampo = this.formBuilder.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? 'is-invalid' : validarCampo?.touched ? 'is-valid' : '';
  }

  ///// metodo que extrae la informacion de la imagen /////
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.file = (target.files as FileList)[0];
    this.imagen = 'seleccioanda';
    this.preVisualizarImagen(event);
  }

  ///// metodo para previsualizar la imagen /////
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

  //////   metodos para la ayuda ///////
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

  cargando() {
    Swal.fire({
      title: 'Espere un momento!',
      html: 'Se está procesando la petición...',
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

}
