import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListarComponent} from "./pages/listar/listar.component";
import {MisSolicitudesComponent} from "./pages/mis-solicitudes/mis-solicitudes.component";
import {ListarAdminComponent} from "./pages/listar-admin/listar-admin.component";
import { HasRoleGuard } from 'src/app/core/guards/has-role.guard';

const routes: Routes = [
  {
    path: 'listado',
    component: ListarComponent,
    canActivate: [HasRoleGuard],
    canLoad: [HasRoleGuard],
    data: {
      allowedRoles: [
        'SECR_DECANATO',
        'JEFE_DEPTO',
        'DECANO',
        'JEFE_FINANACIERO']
      }
  },
  {
    path: 'mis-solicitudes',
    component: MisSolicitudesComponent,
    canActivate: [HasRoleGuard],
    canLoad: [HasRoleGuard],
    data: {
      allowedRoles: [
        'SECR_DECANATO',
        'JEFE_DEPTO',
        'USER',
        'ASIS_FINANCIERO',
        'DECANO',
        'JEFE_FINANACIERO']
      }
  },
  {
    path: 'listar',
    component: ListarAdminComponent,
    canActivate: [HasRoleGuard],
    canLoad: [HasRoleGuard],
    data: { allowedRoles: ['ADMIN']}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudVehiculoRoutingModule { }
