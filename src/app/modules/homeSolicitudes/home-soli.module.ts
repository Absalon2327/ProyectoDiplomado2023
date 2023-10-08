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




@NgModule({
  declarations: [
    HomeUserComponent,
    HomeJefeComponent,
    HomeSecreComponent,
    HomeDecanoComponent
  ],
  imports: [
    CommonModule,
    HomeSoliRoutingModule,
    LayoutsModule,
    ChartsModule,
    SharedModule,
    WidgetModule
  ],
  exports: [
    HomeUserComponent,
    HomeJefeComponent,
    HomeSecreComponent,
    HomeDecanoComponent
  ]
})
export class HomeSoliModule { }
