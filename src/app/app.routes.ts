import { Routes } from '@angular/router';
import { LoginComponent } from './pages/profile/login/login.component';
import { SignupComponent } from './pages/profile/signup/signup.component';
import { SettingsComponent } from './pages/profile/settings/settings.component';
import { SystemOverviewComponent } from './pages/systems/system-overview/system-overview.component';
import { NewPasswordComponent } from './pages/profile/new-password/new-password.component';
import { authGuard } from './guards/auth.guard';
import { DeniedAccessComponent } from './pages/denied-access/denied-access.component';
import { SendemailModifyPasswordComponent } from './pages/profile/sendemail-modify-password/sendemail-modify-password.component';
import { TicketsListComponent } from './pages/systems/tickets-list/tickets-list.component';
import { SystemNewComponent } from './pages/systems/system-new/system-new.component';
import { TicketComponent } from './pages/systems/ticket/ticket.component';
import { SystemTicketsListComponent } from './pages/systems/system-tickets-list/system-tickets-list.component';
import { SystemModifyComponent } from './pages/systems/system-modify/system-modify.component';
import { SystemsListComponent } from './pages/systems/systems-list/systems-list.component';
import { loginSignupGuard } from './guards/login-signup.guard';
import { TicketNewComponent } from './pages/systems/ticket-new/ticket-new.component';
import { WarrantyExtensionComponent } from './pages/warranty/warranty-extension/warranty-extension.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent , canActivate: [loginSignupGuard]},
    { path: 'sendemailModifyPassword', component: SendemailModifyPasswordComponent, canActivate: [loginSignupGuard]},
    { path: 'signup', component: SignupComponent, canActivate: [loginSignupGuard]},
    { path: 'systemsList', component: SystemsListComponent, canActivate: [authGuard]},
    { path: 'systemModify/:id', component: SystemModifyComponent, canActivate: [authGuard] },
    { path: 'profile/settings', component: SettingsComponent, canActivate: [authGuard] },
    { path: 'newSystem', component: SystemNewComponent, canActivate: [authGuard] },
    { path: 'systemOverview/:id', component: SystemOverviewComponent, canActivate: [authGuard] },
    { path: 'newPassword', component: NewPasswordComponent, canActivate: [authGuard] },
    { path: 'systemTicketsList/:id', component: SystemTicketsListComponent, canActivate: [authGuard] },
    { path: 'ticket/:id', component: TicketComponent, canActivate: [authGuard] },
    { path: 'ticketsList', component: TicketsListComponent, canActivate: [authGuard] },
    { path: 'newTicket', component: TicketNewComponent, canActivate: [authGuard] },
    { path: 'warrantyExtension', component:  WarrantyExtensionComponent, canActivate: [authGuard]},
    { path: 'deniedAccess', component:  DeniedAccessComponent},
    { path: '**', redirectTo: 'systemsList'}
];
