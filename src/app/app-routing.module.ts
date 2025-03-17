// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './register/register.component';
import { EmailverificationComponent } from './emailverification/emailverification.component';
import { AddinvoiceComponent } from './addinvoice/addinvoice.component';
import { AbodetailsComponent } from './abodetails/abodetails.component';
import { SettingsComponent } from './settings/settings.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { AgbComponent } from './agb/agb.component';


const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'registration', component: RegisterComponent },
  { path: 'verification', component: EmailverificationComponent },
  { path: 'addInvoice', component: AddinvoiceComponent },
  { path: 'abodetails', component: AbodetailsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'reset-password/:uid/:token', component: ResetpasswordComponent },
  { path: 'landing', component: LandingpageComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: 'agb', component: AgbComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
