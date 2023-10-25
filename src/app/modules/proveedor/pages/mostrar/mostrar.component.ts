import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.component.html',
  styleUrls: ['./mostrar.component.scss']
})
export class MostrarComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  offset = 0;
  items: number = 10;
  term: string = '';

  constructor(private proveedorService: ProveedorService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Proveedor' }, { label: 'Mostrar', active: true }];
    this.proveedorService.getProveedors();
  }

  get listDatos() {
    return this.proveedorService.listProveedor;
  }

}
