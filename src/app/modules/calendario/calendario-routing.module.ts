import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarioComponent } from './calendario/calendario.component';
import { HasRoleGuard } from 'src/app/core/guards/has-role.guard';

const routes: Routes = [
  { path: 'calendario', component: CalendarioComponent,
  canActivate: [HasRoleGuard],
  canLoad: [HasRoleGuard],
  data: { allowedRoles: ['SECR_DECANATO','ADMIN'] }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarioRoutingModule { }
