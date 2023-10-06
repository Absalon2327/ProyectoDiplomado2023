import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';

import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from './saas/shared/shared.module'
import { NgbDropdownModule, NgbTooltipModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular';

import { DefaultComponent } from './default/default.component';
import { SaasComponent } from './saas/saas.component';
import { CryptoComponent } from './crypto/crypto.component';
import { BlogComponent } from './blog/blog.component';
import { EntradasalidaModule } from 'src/app/modules/entradasalida/entradasalida.module';
import { LayoutsModule } from 'src/app/layouts/layouts.module';
import { HomeFinancieroModule } from 'src/app/modules/home-financiero/home-financiero.module';


@NgModule({
  declarations: [DefaultComponent, SaasComponent, CryptoComponent, BlogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardsRoutingModule,
    UIModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbNavModule,
    WidgetModule,
    NgApexchartsModule,
    SharedModule,
    SimplebarAngularModule
    ,EntradasalidaModule,
    LayoutsModule,
    HomeFinancieroModule
  ]
})
export class DashboardsModule { }
