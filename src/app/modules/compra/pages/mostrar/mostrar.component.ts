import { CompraService } from '../../services/compra.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.component.html',
  styleUrls: ['./mostrar.component.scss']
})
export class MostrarComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  offset = 0;

  term: string = '';

  constructor(private compraService: CompraService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Compra' }, { label: 'Mostrar', active: true }];
    this.compraService.getCompras();
  }

  get listDatos() {
    return this.compraService.listCompra;
  }

}
