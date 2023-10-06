import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "../core/guards/auth.guard";

const routes: Routes = [
  { path: 'solicitud-vehiculo', loadChildren: () => import('./solicitud-vehiculo/solicitud-vehiculo.module').then(m => m.SolicitudVehiculoModule), canActivate: [AuthGuard]}, //  canActivateChild: [AuthChildGuard]

  { path: 'solicitud-vale-paginacion', loadChildren: () => import('./solicitud-vale-paginacion/solicitud-vale-paginacion.module').then(m => m.SolicitudValePaginacionModule), canActivate: [AuthGuard]}, //  canActivateChild: [AuthChildGuard]

  { path: 'asignacion-vale', loadChildren: () => import('./asignacion-vales/asignacion-vales.module').then(m => m.AsignacionValesModule), canActivate: [AuthGuard] },
  { path: 'entrasalida', loadChildren: () => import('./entradasalida/entradasalida.module').then(m => m.EntradasalidaModule), canActivate: [AuthGuard] },
  { path: 'compra',  loadChildren: () => import('./compra/compra.module').then(m => m.CompraModule) },
  { path: 'proveedor', loadChildren: () => import('./proveedor/proveedor.module').then(m => m.ProveedorModule) },
  { path: 'devolucion-vale',  loadChildren: () => import('./devolucion-vale/devolucion-vale.module').then(m => m.DevolucionValeModule) },
  { path: 'home-financiero',  loadChildren: () => import('./home-financiero/home-financiero.module').then(m => m.HomeFinancieroModule) },

  //Ruta de empleado //
  { path: 'empleados', loadChildren: () => import('./empleado/empleado.module').then(m => m.EmpleadoModule), canActivate: [AuthGuard] },

  { path: 'vehiculo', loadChildren: () => import('./vehiculo/vehiculo.module').then(m => m.VehiculoModule), canActivate: [AuthGuard] },
  { path: 'cargo', loadChildren: () => import('./cargo/cargo.module').then(m => m.CargoModule)},
  {  path: 'depto', loadChildren: () => import('./depto/depto.module').then(m => m.DeptoModule)},
  { path: 'calendario', loadChildren: () => import('./calendario/calendario.module').then(m => m.CalendarioModule) },
  { path: 'dashboard', loadChildren: () => import('./../pages/dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: '', loadChildren: () => import('./../pages/dashboards/dashboards.module').then(m => m.DashboardsModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
