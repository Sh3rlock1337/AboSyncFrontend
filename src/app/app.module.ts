// app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; // Importiere HttpClientModule
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { EmailverificationComponent } from './emailverification/emailverification.component';
import { SessionExpiredInterceptor } from './sessionexpire.interceptor';
import { AddinvoiceComponent } from './addinvoice/addinvoice.component';
import { AbodetailsComponent } from './abodetails/abodetails.component';
import { SettingsComponent } from './settings/settings.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@NgModule({
  declarations: [AppComponent, LoginComponent, DashboardComponent, RegisterComponent, EmailverificationComponent, AddinvoiceComponent, AbodetailsComponent, SettingsComponent, ForgotpasswordComponent, ResetpasswordComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, FormsModule, HttpClientModule, ToastModule, TabViewModule, ProgressSpinnerModule, ConfirmDialogModule, ConfirmPopupModule], // Füge HttpClientModule zu den imports hinzu
  providers: [
   {
      provide: HTTP_INTERCEPTORS,
     useClass: SessionExpiredInterceptor,
      multi: true,

    }

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
