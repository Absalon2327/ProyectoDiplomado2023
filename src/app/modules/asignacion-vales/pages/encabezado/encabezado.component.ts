import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DetalleService } from '../../services/detalle.service';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss']
})
export class EncabezadoComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  p: any;
  term: string = "";
  currentPage = 1;

  //@Input() queryString!: string;

  constructor(private service: DetalleService, private http: HttpClient) {}
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Vales" },
      { label: "Asignación de Vales" },
      { label: "Registro de Asignaciones", active: true },
    ];

    //this.service.getDetalleAsignacionValePage();
  }

  pageChange(page:number){
    //this.service.getDetalleAsignacionValePage(page-1);
  }

  get listDetalle() {
   // return this.service.listDetalle;
   return  null;
  }

}
