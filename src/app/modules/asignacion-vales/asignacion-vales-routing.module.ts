import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EncabezadoComponent } from "./pages/encabezado/encabezado.component";
import { HasRoleGuard } from "src/app/core/guards/has-role.guard";

const routes: Routes = [
  {
    path: "asignacion/:codigoAsignacion",
    component: EncabezadoComponent,
    canActivate: [HasRoleGuard],
    canLoad: [HasRoleGuard],
    data: { allowedRoles: ["JEFE_FINANACIERO", "ADMIN", "ASIS_FINANCIERO"] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignacionValesRoutingModule {}
