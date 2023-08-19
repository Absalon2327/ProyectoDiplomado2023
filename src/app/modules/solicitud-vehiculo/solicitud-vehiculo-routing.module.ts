import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListarComponent} from "./pages/listar/listar.component";

const routes: Routes = [
  {
    path: 'vehiculo',
    component: ListarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudVehiculoRoutingModule { }
