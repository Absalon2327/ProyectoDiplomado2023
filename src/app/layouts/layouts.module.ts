import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SimplebarAngularModule } from 'simplebar-angular';
import { NgbDropdownModule, NgbModalModule, NgbModule,  } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';

import { UIModule } from '../shared/ui/ui.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { VerticalComponent } from './vertical/vertical.component';
import { LanguageService } from '../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './topbar/modal/modal.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [LayoutComponent, SidebarComponent, TopbarComponent, FooterComponent, VerticalComponent, ModalComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    NgbDropdownModule,
    ClickOutsideModule,
    FormsModule,
    NgbModule,
    NgbModalModule,
    ReactiveFormsModule,
    UIModule,
    SimplebarAngularModule,
    NgxMaskModule.forRoot(), //para las mascaras
  ],
  providers: [LanguageService],
  exports:[ModalComponent]
})
export class LayoutsModule { }
