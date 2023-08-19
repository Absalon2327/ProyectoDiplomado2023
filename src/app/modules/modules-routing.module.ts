import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "../layouts/layout.component";
import {AuthGuard} from "../core/guards/auth.guard";

const routes: Routes = [
  { path: 'solicitud', loadChildren: () => import('./solicitud-vehiculo/solicitud-vehiculo.module').then(m => m.SolicitudVehiculoModule), }, //  canActivateChild: [AuthChildGuard]

  { path: 'asignacionVale', loadChildren: () => import('./asignacion-vales/asignacion-vales.module').then(m => m.AsignacionValesModule), canActivate: [AuthGuard] },

  //Ruta de empleado //
  { path: 'empleados', loadChildren: () => import('./empleado/empleado.module').then(m => m.EmpleadoModule), canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
