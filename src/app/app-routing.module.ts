import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { Page404Component } from './extrapages/page404/page404.component';

const routes: Routes = [
  { path: 'solicitudes', component: LayoutComponent, loadChildren: () => import('./modules/solicitudes/solicitudes.module').then(m => m.SolicitudesModule)},//canActivate: [AuthGuard]
  { path: 'AcercaDeAyuda', component: LayoutComponent, loadChildren: () => import('./modules/acerca-de-ayuda/acerca-de-ayuda.module').then(m => m.AcercaDeAyudaModule)},//canActivate: [AuthGuard]
 
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  // tslint:disable-next-line: max-line-length

  // Ruta hacia los modulos
  { path: '', component: LayoutComponent, loadChildren: () => import('./modules/modules.module').then(m => m.ModulesModule), canActivate: [AuthGuard], canLoad: [AuthGuard] },
  { path: 'pages', loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule), canActivate: [AuthGuard], canLoad: [AuthGuard] },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
