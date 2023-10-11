import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MostrarComponent } from "./pages/mostrar/mostrar.component";
import { HasRoleGuard } from "src/app/core/guards/has-role.guard";

const routes: Routes = [
  {
    path: "",
    component: MostrarComponent,
    canActivate: [HasRoleGuard],
    canLoad: [HasRoleGuard],
    data: { allowedRoles: ["ASIS_FINANCIERO","JEFE_FINANACIERO" , "ADMIN"] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompraRoutingModule {}
