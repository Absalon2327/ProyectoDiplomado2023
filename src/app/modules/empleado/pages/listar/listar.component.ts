import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../service/empleado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: string = '';
  term2: string = '';
  items: number = 10;

  constructor(private empleadoService: EmpleadoService) { }

  ngOnInit() {
    Swal.fire({
      title: 'Espere un momento!',
      html: 'Se está procesando la información...',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    this.breadCrumbItems = [{ label: 'Empleado' }, { label: 'Listar', active: true }];
    this.empleadoService.getEmpleados();
  }

  get listaEmpleados() {
    return this.empleadoService.listEmpleados;
  }

}
