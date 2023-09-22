import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudvaleComponent } from './solicitudvale/solicitudvale.component';
import { SolicitudvComponent } from './solicitudv/solicitudv.component';
import { SolicitanteComponent } from './solicitante/solicitante.component';

const routes: Routes = [
  {path:'solicitudvale',component:SolicitudvaleComponent},
  {path:'solicitudv',component:SolicitudvComponent},
  {path:'solicitante',component:SolicitanteComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudesRoutingModule { }
