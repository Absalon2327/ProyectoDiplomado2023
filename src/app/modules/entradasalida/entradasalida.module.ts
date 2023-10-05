import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EntradasalidaRoutingModule } from './entradasalida-routing.module';
import { VistaentradasalidaComponent } from './pages/vistaentradasalida/vistaentradasalida.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartsModule } from 'ng2-charts';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ListaentradasalidaService } from './service/listaentradasalida.service';
import { ListarComponent } from './pages/listar/listar.component';
import { TablaComponent } from './pages/tabla/tabla.component';
import { ModalComponent } from './pages/modal/modal.component';
import { CardComponent } from './components/card/card.component';



@NgModule({
  declarations: [
    VistaentradasalidaComponent,
    ListarComponent,
    TablaComponent,
    ModalComponent,
    CardComponent,
  ],
  imports: [
    CommonModule,
    EntradasalidaRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,//para las peticiones
    InfiniteScrollModule,//para scroll infinito
    UIModule,//para la modal
    FormsModule,//
    NgApexchartsModule,
    ChartsModule,//para las graficas
    NgbModalModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    //BrowserModule
  ],exports:[ListarComponent],
  providers:[
    ListaentradasalidaService,
    //DatePipe
  ],
  //bootstrap:[AppComponent]

})
export class EntradasalidaModule { }
