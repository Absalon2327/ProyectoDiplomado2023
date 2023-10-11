import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProveedorRoutingModule } from "./proveedor-routing.module";
import { MostrarComponent } from "./pages/mostrar/mostrar.component";
import { TablaComponent } from "./pages/tabla/tabla.component";
import { ModalComponent } from "./components/modal/modal.component";
import { UIModule } from "src/app/shared/ui/ui.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { NgxMaskModule } from "ngx-mask";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
  declarations: [MostrarComponent, TablaComponent, ModalComponent],
  imports: [
    CommonModule,
    ProveedorRoutingModule,
    FormsModule,
    UIModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbModule,
    NgxMaskModule.forRoot(),
  ],
})
export class ProveedorModule {}
