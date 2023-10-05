import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudvaleComponent } from './solicitudvale/solicitudvale.component';
import { SolicitudvComponent } from './solicitudv/solicitudv.component';

import { SolicitanteComponent } from './solicitante/solicitante.component';

import { SolicitudValeAprobarComponent } from './solicitud-vale-aprobar/solicitud-vale-aprobar.component';
import { MovimientosvalesComponent } from './movimientosvales/movimientosvales.component';
import { HasRoleGuard } from 'src/app/core/guards/has-role.guard';


const routes: Routes = [
  {path:'solicitudvale',component:SolicitudvaleComponent, canActivate: [HasRoleGuard],
  canLoad: [HasRoleGuard],
  data: { allowedRoles: ['JEFE_FINANACIERO','ADMIN','ASIS_FINANCIERO'] }},
  {path:'solicitudv',component:SolicitudvComponent, canActivate: [HasRoleGuard],
  canLoad: [HasRoleGuard],
  data: { allowedRoles: ['JEFE_FINANACIERO','ADMIN','ASIS_FINANCIERO'] }},
  {path:'movimientosvales',component:MovimientosvalesComponent, canActivate: [HasRoleGuard],
  canLoad: [HasRoleGuard],
  data: { allowedRoles: ['JEFE_FINANACIERO','ADMIN','ASIS_FINANCIERO'] }},
  {path:'solicitante',component:SolicitanteComponent, canActivate: [HasRoleGuard],
  canLoad: [HasRoleGuard],
  data: { allowedRoles: ['JEFE_FINANACIERO','ADMIN','ASIS_FINANCIERO'] }},
  {path: 'solictud-aprobar', component:SolicitudValeAprobarComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudesRoutingModule { }
