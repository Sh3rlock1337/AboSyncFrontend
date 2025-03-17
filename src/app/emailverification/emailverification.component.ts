import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-emailverification',
  templateUrl: './emailverification.component.html',
  styleUrls: ['./emailverification.component.scss'],
  providers: [MessageService],
})
export class EmailverificationComponent implements OnInit {
  @ViewChild('emailCodeForm') emailCodeForm!: NgForm;
  user: any;
  registrationModelData: any;
  emailVerificationCode: any;
  userData = {
    code: ''
  };
  constructor(private authService: AuthService, private router: Router, private http: HttpClient, private messageService: MessageService,) { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  resendMail() {
    this.authService.resendMail().subscribe({
      next: (data) => {
        // Dies wird ausgeführt, wenn der Aufruf erfolgreich war
        console.log('Erfolg:', data);
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Neue E-Mail wird gesendet....',
          life: 3000, // Lebensdauer der Benachrichtigung in Millisekunden (optional)

        });
      },
      error: (error) => {
        // Dies wird ausgeführt, wenn ein Fehler auftritt
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ein Fehler ist aufgetreten',
          life: 3000, // Lebensdauer der Benachrichtigung in Millisekunden (optional)

        });
      }
    });

  }

  send() {

    if (this.emailCodeForm.valid) {
      this.authService.getLoggedInUser().subscribe(data => {
        this.user = data;

        this.authService.getRegistrationModelData(this.user.id).subscribe(data => {
          this.registrationModelData = data;
          const emailverificationString = this.registrationModelData.emailverification.toString();

          if (emailverificationString == "0") {

            this.authService.getEmailCode(this.user.id, this.userData.code).subscribe(data => {
              this.emailVerificationCode = data;
              if(this.emailVerificationCode.response == "wrongcode"){
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Falscher Code, probieren Sie es erneut',
                  life: 3000,

                });


              } else if(this.emailVerificationCode.response == "successfull") {

                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Erfolgreich verifiziert! Sie werden weitergeleitet...',
                  life: 3000,

                });
                setTimeout(() => {
                  this.router.navigate(['subscription']);
                }, 3000);

              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error!',
                  life: 3000,

                });
              }






              //ANFANG

            });








          } else {
            this.sendBackToLoginPage();
          }
        });
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Sie müssen einene Code eingeben.',
        life: 3000,

      });
    }
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.sendBackToLoginPage();
    } else {
      this.authService.getLoggedInUser().subscribe(data => {
        this.user = data;
        this.authService.getRegistrationModelData(this.user.id).subscribe(data => {
          this.emailVerificationCode = data;
          if(this.emailVerificationCode.emailverification == 0){

          } else {
            this.router.navigate(['dashboard']);
          }
        });



      });

    }


  }

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        // Erfolgreich ausgeloggt
        this.sendBackToLoginPage();
      },
      (error) => {
      }
    );
  }

  sendBackToLoginPage(): void {
    this.router.navigate(['login']);
  }

  private getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(';').shift()!;
    return '';
  }
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
