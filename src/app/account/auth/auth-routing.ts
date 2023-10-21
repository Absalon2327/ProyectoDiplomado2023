import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';

import { LoginGuard } from 'src/app/core/guards/login.guard';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent, canActivate: [LoginGuard]
    },
    {
        path: 'reset-password',
        component: PasswordresetComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
