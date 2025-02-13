import { Routes } from '@angular/router';
import { LoginComponent } from './pages/profile/login/login.component';
import { SignupComponent } from './pages/profile/signup/signup.component';
import { SettingsComponent } from './pages/profile/settings/settings.component';
import { SystemOverviewComponent } from './pages/systems/system-overview/system-overview.component';
import { NewPasswordComponent } from './pages/profile/new-password/new-password.component';
import { authGuard } from './guards/auth.guard';
import { DeniedAccessComponent } from './pages/denied-access/denied-access.component';
import { SendemailModifyPasswordComponent } from './pages/profile/sendemail-modify-password/sendemail-modify-password.component';
import { SystemsListComponent } from './pages/systems/systems-list/systems-list.component';
import { loginSignupGuard } from './guards/login-signup.guard';
import { SystemManagementComponent } from './pages/systems/system-management/system-management.component';
import { SystemReadonlyComponent } from './pages/systems/system-readonly/system-readonly.component';
import { SystemTicketsListComponent } from './pages/systems/system-tickets-list/system-tickets-list.component';
import { TicketNewComponent } from './pages/tickets/ticket-new/ticket-new.component';
import { TicketListComponent } from './pages/tickets/ticket-list/ticket-list.component';
import { TicketModifyComponent } from './pages/tickets/ticket-modify/ticket-modify.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginSignupGuard] },
  { path: 'sendemailModifyPassword', component: SendemailModifyPasswordComponent, canActivate: [loginSignupGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [loginSignupGuard] },
  { path: 'systemsList', component: SystemsListComponent, canActivate: [authGuard] },
  //{ path: 'systemModify/:id', component: SystemModifyComponent, canActivate: [authGuard] },
  { path: 'systemManagement', component: SystemManagementComponent, canActivate: [authGuard] },
  { path: 'systemManagement/:id', component: SystemManagementComponent, canActivate: [authGuard] },
  { path: 'profile/settings', component: SettingsComponent, canActivate: [authGuard] },
  //{ path: 'newSystem', component: SystemNewComponent, canActivate: [authGuard] },
  { path: 'systemOverview/:id', component: SystemOverviewComponent, canActivate: [authGuard] },
  { path: 'systemReadonly/:id', component: SystemReadonlyComponent, canActivate: [authGuard] },
  { path: 'newPassword/:token', component: NewPasswordComponent, canActivate: [loginSignupGuard]},
  { path: 'systemTicketsList/:id', component: SystemTicketsListComponent, canActivate: [authGuard] },
  // { path: 'newTicket', component: TicketNewComponent },
  // { path: 'newTicket/:id', component: TicketNewComponent },
  { path: 'deniedAccess', component: DeniedAccessComponent },
  { path: "ticketList", component: TicketListComponent },
  { path: "ticketNew", component: TicketNewComponent },
  { path: "ticketModify/:id", component: TicketModifyComponent },
  // da cancellare
  // { path: 'scannerTrial', component: ImgDecodeComponent },
  { path: '**', redirectTo: 'systemsList' }
];
