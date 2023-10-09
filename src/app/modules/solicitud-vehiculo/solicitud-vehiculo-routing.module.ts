import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListarComponent} from "./pages/listar/listar.component";
import {MisSolicitudesComponent} from "./pages/mis-solicitudes/mis-solicitudes.component";
import {ListarAdminComponent} from "./pages/listar-admin/listar-admin.component";

const routes: Routes = [
  {
    path: 'listado',
    component: ListarComponent,
  },
  {
    path: 'mis-solicitudes',
    component: MisSolicitudesComponent,
  },
  {
    path: 'listar',
    component: ListarAdminComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudVehiculoRoutingModule { }
