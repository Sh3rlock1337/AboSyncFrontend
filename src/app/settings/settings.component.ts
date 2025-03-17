import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { kategoriesItem } from '../kategoriesItem';
import { ImageService } from '../image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [ConfirmationService, MessageService],

})


export class SettingsComponent implements OnInit {
  passwordForm: FormGroup;
  public isAuthenticated = false;
  user: any;
  registrationModelData: any;
  companyData: any;
  pricingsList: any;
  items: any;
  password: string = "";
  password2: string = "";
  message: string = "";
  globalMailNotification: any;
  isStaff: any;

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();

  }
  getAuthenticated() {
    return this.isAuthenticated;
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.sendBackToLoginPage();
    } else {

      this.authService.getLoggedInUser().subscribe(data => {
        this.user = data;
        this.authService.getCompanyData(this.user.id).subscribe((companyData) => {
          this.companyData = companyData;
        });
        this.authService.getRegistrationModelData(this.user.id).subscribe(data => {
          this.registrationModelData = data;
          const emailverificationString = this.registrationModelData.emailverification.toString();
          if (emailverificationString == "0") {
            this.setAuthenticated(false);
            this.router.navigate(['verification']);




          } else {


            this.setAuthenticated(true);
            this.authService.isUserStaff().subscribe(data => {
              this.isStaff = data;

              if (this.isStaff.message == true) {
                this.authService.admingetMailNotificationActive().subscribe(data => {

                  this.globalMailNotification = data;

                });
              }

            });



          }
        });
      });
    }

  }




  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Wollen Sie wirklich Ihren Account löschen?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",


      accept: () => {
        this.messageService.add({ severity: 'error', summary: 'Confirmed', detail: 'Ihr Account wird gelöscht!...'});
        //delete account method

        this.authService.deleteAccount().subscribe(data => {

          setTimeout(() => {
            this.logout();
            this.router.navigate(['landing']);
          }, 3000);
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Ihr Account wird nicht gelöscht!' });

      }
    });
  }

  manageabo() {
    this.authService.getAboStripe().subscribe(
      (data: any) => {
        // Prüfen, ob die Antwort eine URL enthält
        if (data && data.url) {
          // Wenn eine URL vorhanden ist, führe die Weiterleitung durch
          const checkoutUrl = data.url; // Type assertion ist hier nicht mehr notwendig
          window.location.href = checkoutUrl;
        } else {
          // Wenn keine URL in der Antwort enthalten ist, gebe eine Fehlermeldung aus
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Nutzer Besitzt keine Rechnungen!',
            life: 3000, //
          });
        }
      },
      (error) => {
        // Fehlerbehandlung für den Fall, dass der Request selbst fehlschlägt
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Request failed with error. Please contact support!',
          life: 3000,
        });
      }
    );


  }

  switchStatus() {
    if (this.isStaff.message == true) {
      this.authService.adminChangeMailNotificationStatus().subscribe(data => {

        this.authService.admingetMailNotificationActive().subscribe(data => {

          this.globalMailNotification = data;

        });
      });
    }
  }

  onMailNotificationChange(event: any) {
    // Der neue Status des Schalters
    const isMailNotificationOn = event.target.checked;
    // Aktualisiere companyData.mailnotification
    this.companyData.mailnotification = isMailNotificationOn;
    this.authService.changeMailNotificationStatus().subscribe(data => {

    });
    // TODO: Hier Code, um die Änderung zum Backend zu senden
    // z.B. this.authService.updateCompanyData(this.user.id, this.companyData);
  }
  onSubmit() {

    if (this.password.length >= 8 && this.password2.length >= 8) {
      if (this.password === this.password2) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Ihr Passwort wurde erfolgreich geändert! Sie werden ausgeloggt... ',
          life: 3000,
        });
        this.authService.postresetpassword(this.password).subscribe(data => {
          setTimeout(() => {
            this.logout();
          }, 3000);

        });
        // Proceed with backend submission or other actions
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ihre Passwörter stimmen nicht überein!',
          life: 3000,
        });
        // Handle error, show message to user
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ihr neues Password, muss mindestens 8 Zeichen haben!',
        life: 3000,
      });
    }
  }
  constructor(private authService: AuthService,
    private router: Router,
    private kategories: kategoriesItem,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService

  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]], // example validation
      password2: ['', Validators.required]
    });
  }

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        // Erfolgreich ausgeloggt
        // Hier kannst du weitere Aktionen nach dem Ausloggen hinzufügen
        this.sendBackToLoginPage();
      },
      (error) => {
        console.error('Logout failed:', error);
      }
    );
  }
  setAuthenticated(status: boolean) {
    this.isAuthenticated = status;
  }
  sendBackToLoginPage(): void {
    this.router.navigate(['']);
  }
}
