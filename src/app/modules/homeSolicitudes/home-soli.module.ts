import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeSoliRoutingModule } from './home-soli-routing.module';
import { HomeUserComponent } from './pages/home-user/home-user.component';
import { LayoutsModule } from 'src/app/layouts/layouts.module';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from 'src/app/shared/shared.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { HomeJefeComponent } from './pages/home-jefe/home-jefe.component';
import { HomeSecreComponent } from './pages/home-secre/home-secre.component';
import { HomeDecanoComponent } from './pages/home-decano/home-decano.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { HomeAdminComponent } from './pages/home-admin/home-admin.component';




@NgModule({
  declarations: [
    HomeUserComponent,
    HomeJefeComponent,
    HomeSecreComponent,
    HomeDecanoComponent,
    HomeAdminComponent
  ],
  imports: [
    CommonModule,
    HomeSoliRoutingModule,
    LayoutsModule,
    ChartsModule,
    SharedModule,
    WidgetModule,
    UIModule,],
  exports: [
    HomeUserComponent,
    HomeJefeComponent,
    HomeSecreComponent,
    HomeDecanoComponent,
    HomeAdminComponent
  ]
})
export class HomeSoliModule { }
