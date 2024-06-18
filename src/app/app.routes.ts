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
import { TicketsComponent } from './pages/systems/tickets/tickets.component';
import { authGuard } from './guards/auth.guard';
import { DeniedAccessComponent } from './pages/denied-access/denied-access.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'modifyPassword', component: ModifyPasswordComponent, canActivate: [authGuard]},
    { path: 'signup', component: SignupComponent },
    { path: 'batterySystem', component: BatterySystemComponent },
    { path: 'modifySystem/:name', component: ModifySystemComponent },
    { path: 'profile/settings', component: SettingsComponent },
    { path: 'newSystem', component: SystemNameComponent },
    { path: 'systemOverview/:name', component: SystemOverviewComponent },
    { path: 'newPassword', component: NewPasswordComponent },
    { path: 'assistanceRequestList', component: AssistanceRequestListComponent },
    { path: 'assistanceRequest/:id', component: AssistanceRequestComponent },
    { path: 'ticketsList', component: TicketsComponent },
    { path: 'deniedAccess', component:  DeniedAccessComponent},
];
