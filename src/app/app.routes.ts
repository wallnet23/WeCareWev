import { Routes } from '@angular/router';
import { LoginComponent } from './pages/profile/login/login.component';
import { ModifyPasswordComponent } from './pages/profile/modify-password/modify-password.component';
import { SignupComponent } from './pages/profile/signup/signup.component';
import { BatterySystemComponent } from './pages/systems/battery-system/battery-system.component';
import { NewSystemComponent } from './pages/systems/new-system/new-system.component';
import { SettingsComponent } from './pages/profile/settings/settings.component';
import { SystemNameComponent } from './pages/systems/system-name/system-name.component';
import { SystemOverviewComponent } from './pages/systems/system-overview/system-overview.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'modifyPassword', component: ModifyPasswordComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'batterySystem', component: BatterySystemComponent },
    { path: 'newSystem', component: NewSystemComponent },
    { path: 'newSystem/:name', component: NewSystemComponent },
    { path: 'profile/settings', component: SettingsComponent },
    { path: 'systemName', component: SystemNameComponent },
    { path: 'systemOverview/:name', component: SystemOverviewComponent },
];
