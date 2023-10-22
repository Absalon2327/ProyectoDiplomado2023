import { Component, Input, OnInit } from '@angular/core';
import { ISolicitudvalep } from '../../interface/solicitudvalep.interface';
import { SolicitudvaleService } from '../../services/solicitudvale.service';
import { IPaginacion } from 'src/app/shared/models/IPaginacion.interface';

const DEFAULT_PAGE_SIZE = 1;

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})
export class TablaComponent implements OnInit {

  solicitudes:  IPaginacion<ISolicitudvalep>;
  queryString!: string;
  p: any;
  currentPage = DEFAULT_PAGE_SIZE
  offset = 0;

  term: string = '';
  constructor(private solicitudesServices: SolicitudvaleService) { }

  ngOnInit(): void {
    this.solicitudesServices.getSolicitudes();
  }

  get listDatos() {
    //console.log(this.solicitudesServices.listSolcitudes);
    this.solicitudes = this.solicitudesServices.listSolcitudes;
    return this.solicitudes;
  }

  onPageChange(page: number) {
    this.solicitudesServices.getSolicitudes(page - 1);
  }

}
