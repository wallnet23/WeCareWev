import { Routes } from '@angular/router';
import { LoginComponent } from './pages/profile/login/login.component';
import { ModifyPasswordComponent } from './pages/profile/modify-password/modify-password.component';
import { SignupComponent } from './pages/profile/signup/signup.component';
import { BatterySystemComponent } from './pages/systems/battery-system/battery-system.component';
import { ModifySystemComponent } from './pages/systems/modify-system/modify-system.component';
import { SettingsComponent } from './pages/profile/settings/settings.component';
import { SystemNameComponent } from './pages/systems/system-name/system-name.component';
import { SystemOverviewComponent } from './pages/systems/system-overview/system-overview.component';
import { NewPasswordComponent } from './pages/profile/new-password/new-password.component';
import { AssistanceRequestListComponent } from './pages/systems/assistance-request-list/assistance-request-list.component';
import { AssistanceRequestComponent } from './pages/systems/assistance-request/assistance-request.component';
import { DeniedAccessComponent } from './pages/denied-access/denied-access.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'modifyPassword', component: ModifyPasswordComponent, canActivate: [authGuard]},
    { path: 'signup', component: SignupComponent },
    { path: 'batterySystem', component: BatterySystemComponent , canActivate: [authGuard]},
    { path: 'newSystem', component: ModifySystemComponent , canActivate: [authGuard]},
    { path: 'newSystem/:name', component: ModifySystemComponent, canActivate: [authGuard] },
    { path: 'profile/settings', component: SettingsComponent, canActivate: [authGuard] },
    { path: 'systemName', component: SystemNameComponent, canActivate: [authGuard] },
    { path: 'systemOverview/:name', component: SystemOverviewComponent , canActivate: [authGuard]},
    { path: 'newPassword', component: NewPasswordComponent , canActivate: [authGuard]},
    { path: 'assistanceRequestList', component: AssistanceRequestListComponent , canActivate: [authGuard]},
    { path: 'assistanceRequest/:id', component: AssistanceRequestComponent , canActivate: [authGuard]},
    { path: 'deniedAccess', component:  DeniedAccessComponent},
];
