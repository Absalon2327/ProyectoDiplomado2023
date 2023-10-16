import { Component, OnInit, Input } from '@angular/core';
import { IEntradaSalida } from '../../interface/EntSalinterface';
import { ListaentradasalidaService } from '../../service/listaentradasalida.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})
export class TablaComponent implements OnInit {
  entradasalidas: IEntradaSalida[]=[];//para almacenar los resultados
  @Input() entraoOd!: IEntradaSalida[];
  @Input() queryString: string;
  p: any;

  constructor(private listaentradasalidaservice: ListaentradasalidaService) { }

  ngOnInit(): void {
    this.obtenerLista();
  }

  private obtenerLista() {//para poder mostrar e la tabla
    this.listaentradasalidaservice.ObtenerLista.subscribe((resp: IEntradaSalida[]) => {
      this.entradasalidas = resp;
    });
  }

}
