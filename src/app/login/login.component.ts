// login.component.ts

import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SessionExpiredInterceptor } from '../sessionexpire.interceptor';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorResponse: string = '';

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) { }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        // Erfolgreich eingeloggt
        this.authService.login();
        this.router.navigate(['/dashboard']);
      },
      (error) => {

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Falscher Nutzername oder Password!',
          life: 3000,
        });

      }
    );
  }

  passwordForgot() {
    this.router.navigate(['/forgotpassword']);
  }
}
