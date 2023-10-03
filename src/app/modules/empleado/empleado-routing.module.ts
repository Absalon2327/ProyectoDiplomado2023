import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './pages/listar/listar.component';
import { HasRoleGuard } from 'src/app/core/guards/has-role.guard';

const routes: Routes = [
  { path: "listar", 
  component: ListarComponent,
  canActivate: [HasRoleGuard],
  canLoad: [HasRoleGuard],
  data: { allowedRoles: ['SECR_DECANATO','ADMIN'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadoRoutingModule { }
