
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SolicitudesRoutingModule } from "./solicitudes-routing.module";
import { SolicitudvComponent } from "./solicitudv/solicitudv.component";
import { SolicitudvaleComponent } from "./solicitudvale/solicitudvale.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { NgxPaginationModule } from "ngx-pagination";
import { UIModule } from "../../shared/ui/ui.module";
import { NgbModule, NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { SolicitudValeAprobarComponent } from './solicitud-vale-aprobar/solicitud-vale-aprobar.component';
import { ValesAsignarComponent } from './solicitudvale/components/vales-asignar/vales-asignar.component';
import { SolicitanteComponent } from './solicitante/solicitante.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MovimientosvalesComponent } from './movimientosvales/movimientosvales.component';

@NgModule({

  declarations: [ SolicitanteComponent, SolicitudvComponent, SolicitudvaleComponent, SolicitudValeAprobarComponent, ValesAsignarComponent, MovimientosvalesComponent],

  imports: [
    CommonModule,
    SolicitudesRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbPaginationModule,
    Ng2SearchPipeModule,
    UIModule,
    NgSelectModule,
    NgbTooltipModule,
    NgbModule,
  ],
  providers: [DatePipe],

})
export class SolicitudesModule {}
