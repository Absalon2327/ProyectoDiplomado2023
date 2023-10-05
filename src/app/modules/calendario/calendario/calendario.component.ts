import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventApi, EventClickArg, EventInput, EventSourceFunc,formatDate } from '@fullcalendar/core';
import dayGrirdPlugin from '@fullcalendar/daygrid';
import { ServicioService } from '../servicio/servicio.service';
import { UsuarioService } from 'src/app/account/auth/services/usuario.service';
import { SolicitudVv } from '../../solicitudes/Interfaces/SolicitudVv';
import { ModalSecretariaComponent } from '../../solicitud-vehiculo/components/modal-secretaria/modal-secretaria.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ISolicitudVehiculo } from '../../solicitud-vehiculo/interfaces/data.interface';
import { ModalComponent } from '../../solicitud-vehiculo/components/modal/modal.component';
import { Usuario } from 'src/app/account/auth/models/usuario.models';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  solicitud: any[] = [];
  editEvent: any;
  selectedData: ISolicitudVehiculo;
  contador = 0;
  usuario !: Usuario;

  calendarOptions: CalendarOptions = {
    headerToolbar: {

    },
    buttonText:{
      today : 'Hoy'
    },

    initialView: 'dayGridMonth',

    editable: true,
    selectable: true,
   // timeZone: 'UTC',
    locale: 'es',              // para poner en español el calendario

    eventClick : this.handleEventClick.bind(this),  // al dar click sobre un evento se invoca
    events: this.LoadEvents.bind(this),             // para cargar los eventos que bienen del servicio

  };

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Calendario' }, { label: 'Solicitud', active: true }];
  }



  currentEvents: EventApi[] = [];

  async LoadEvents(args: EventSourceFunc): Promise<EventInput[]> { // empieza el forech

        return new Promise<EventInput[]>((resolve) => {
         // console.log(args.startStr);


        this.soliService.getSolicitudV().subscribe(result => {
          const events: EventInput[] = [];
            result.forEach(function (val) {


     // Fechas a objeto Date
          const fechaInicio = new Date(val.fechaSalida);
          const fechaFin = new Date(val.fechaEntrada);

          // Aumentamos en 1 el dia de fin para que el calendario lo pinte bien
          fechaFin.setDate(fechaFin.getDate() + 1);

          // Convertimos las fechas a string con formato ISO para que el calendario las pinte bien
          let var1 : string = fechaInicio.toISOString().split('T')[0];
          let var2 : string = fechaFin.toISOString().split('T')[0];

          //nombre del solicitante
          const paso1 = val.solicitante.empleado.nombre;
          const paso2 = paso1.split(" ");
          const nombre = paso2[0];
          console.log("solicitante",val.solicitante.empleado.nombre);
          // switch para pintar los eventos segun el estado
             switch (val.estado) {
                case 1:

                  events.push({
                    id: val.codigoSolicitudVehiculo,
                    title: nombre,
                    start: var1,
                    end: var2,
                    className: 'bg-warning text-white'
                  });
                  break;
                case 2:

                  events.push({
                    id: val.codigoSolicitudVehiculo,
                    title: nombre,
                    start: var1,
                    end: var2,
                    className: 'bg-info text-white'
                  });
                  break;
                case 3:

                  events.push({
                    id: val.codigoSolicitudVehiculo,
                    title: nombre,
                    start: var1,
                    end: var2,

                    color: '#873600'
                  });
                  break;
                case 4:

                  events.push({
                    id: val.codigoSolicitudVehiculo,
                    title: nombre,
                    start: var1,
                    end: var2,
                    className: 'bg-success text-white'
                  });

                  break;
                  case 5:

                    events.push({
                      id: val.codigoSolicitudVehiculo,
                      title: nombre,
                      start: var1,
                      end: var2,
                      color: '#B79CED'
                    });

                  break;

                  case 6:

                    events.push({
                      id: val.codigoSolicitudVehiculo,
                      title: nombre,
                      start: var1,
                      end: var2,
                      color: '#A6ACAF'

                    });

                  break;
                  case 7:

                    events.push({
                      id: val.codigoSolicitudVehiculo,
                      title: nombre,
                      start: var1,
                      end: var2,
                      color: 'blue'

                    });

                  break;

                default:

                  events.push({
                    id: val.codigoSolicitudVehiculo,
                    title: nombre,
                    start: var1,
                    end: var2,
                    className: 'bg-danger text-white'
                  });
                  break;

             }

              resolve(events); // almacena los eventos
            }); // termina el foreach
          }, error => console.error(error));
        });
      } // termina el metodo async

    //metodo para cargar el modal
  async handleEventClick(clickInfo: EventClickArg) {
        this.editEvent = clickInfo.event; // obtenemos los eventos del calendario
        console.log(this.editEvent.id)
       const compara = this.editEvent.id; // se asigna a una variable el id del evento que tambien es el codigo de la solicitud

      const dataSoli =  await this.soliService.getSolicitudV().toPromise();  // se obtinen las solicitudes
          let data = dataSoli.find(x => x.codigoSolicitudVehiculo == clickInfo.event.id);  // se busca la solicitud
            if (data.codigoSolicitudVehiculo == compara) {
               console.log("lo que trajo", data);
              this.abrirModalSecre('Detalle', data);                  // se invoca al metodo para abrir el modal
            }
          }






       handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }


get listSoliVeData(){
  return this.soliService.getSoli2();
}


  constructor( private soliService: ServicioService, private modalService: NgbModal, private usuarioService: UsuarioService) {

   }


   abrirModalSecre(leyenda: string, data: any) {
    this.usuario = this.usuarioService.usuario;
    const selectedData = data;
     //console.log("lo que trajo", this.usuario);
    const modalRef = this.modalService.open(ModalSecretariaComponent, {size:'xl', backdrop: 'static'});
    modalRef.componentInstance.leyenda = leyenda;
    modalRef.componentInstance.soliVeOd = data;
    modalRef.componentInstance.usuarioActivo = this.usuario;
  }

}
