import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, HostBinding , ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],  // <-- Add a comma here
  providers: [MessageService],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('1s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class RegisterComponent implements OnInit {
  @ViewChild('registrationForm') registrationForm!: NgForm;
  @ViewChild('responseContainer') responseContainer!: ElementRef;
  @ViewChild('notification') notification!: ElementRef;

  userData = {
    username: '',
    email: '',
    password: '',
    password1: '',
    firmenname: '',
    first_name: '',
    last_name: '',
    street:'',
    postleitzahl: '',
    ort: '',
    land: ''
  };
  user: any;


  constructor(private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService, private router: Router) { }
  message: string = "";

  ngOnInit() {


  }



  hideElement() {

    if (this.validateForm() == true) {


      document.getElementById("username")!.style.display = "none";
      document.getElementById("password1")!.style.display = "none";
      document.getElementById("password")!.style.display = "none";
      document.getElementById("email")!.style.display = "none";
      document.getElementById("Hidebutton")!.style.display = "none";
      document.getElementById("logindetails")!.style.display = "none";



      document.getElementById("firmenname")!.style.display = "flex";
      document.getElementById("first_name")!.style.display = "flex";
      document.getElementById("last_name")!.style.display = "flex";
      document.getElementById("postleitzahl")!.style.display = "flex";
      document.getElementById("ort")!.style.display = "flex";
      document.getElementById("land")!.style.display = "flex";
      document.getElementById("buttonBack")!.style.display = "flex";
      document.getElementById("street")!.style.display = "flex";

      document.getElementById("companydetails")!.style.display = "unset";

      document.getElementById("registerButton")!.style.display = "unset";

    } else {
    }


  }
  areFieldsFilled() {
  const username = document.getElementById("username") as HTMLInputElement;
  const password = document.getElementById("password") as HTMLInputElement;
  const password1 = document.getElementById("password1") as HTMLInputElement;
  const email = document.getElementById("email") as HTMLInputElement;

  // Stellen Sie sicher, dass die Elemente existieren, bevor Sie auf .value zugreifen
  if (username && password && password1 && email) {
    return username.value.trim() !== "" &&
           password.value.trim() !== "" &&
           password1.value.trim() !== "" &&
           email.value.trim() !== "";
  }
  // Gibt false zurück, wenn eines der Elemente nicht existiert
  return false;
}
   validateForm() {
    const email = document.getElementById("email") as HTMLInputElement;
    const username = document.getElementById("username") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const password1 = document.getElementById("password1") as HTMLInputElement;

    // Überprüfen, ob die E-Mail und der Benutzername ausgefüllt sind
    if (!email.value.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Bitte geben Sie eine valide E-Mail an.',
        life: 3000,
      });
      if(this.areFieldsFilled() == true){
        document.getElementById("registerButton")!.style.display = "flex";

      }
      return false;
    }

    if (!username.value.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Bitte geben Sie einen Nutzernamen an.',
        life: 3000,
      });
      return false;
    }

    // Überprüfen, ob die Passwörter ausgefüllt sind
    if (!password.value.trim() || !password1.value.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Bitte füllen Sie beide Passwortfelder aus.',
        life: 3000,
      });
      return false;
    }

    // Überprüfen, ob die Passwörter übereinstimmen
    if (password.value !== password1.value) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Die Passwörter stimmen nicht überein.',
        life: 3000,
      });
      return false;
    }

    if (!email.value.includes('@') && !email.value.includes('@')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Keine valide E-Mail, bitte überprüfen Sie Ihre Eingabe.',
        life: 3000,
      });
      return false;
    }


    // Überprüfen, ob die Passwörter mindestens 8 Zeichen lang sind
    if (password.value.length < 8 || password1.value.length < 8) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Die Passwörter müssen mindestens 8 Zeichen lang sein.',
        life: 3000,
      });
      return false;
    }

    // Wenn alle Überprüfungen bestanden sind
    return true;
  return true;
}


  goBack() {
    document.getElementById("username")!.style.display = "flex";
    document.getElementById("password1")!.style.display = "flex";
    document.getElementById("password")!.style.display = "flex";
    document.getElementById("email")!.style.display = "flex";
    document.getElementById("Hidebutton")!.style.display = "";
    document.getElementById("logindetails")!.style.display = "";


    document.getElementById("firmenname")!.style.display = "none";
    document.getElementById("first_name")!.style.display = "none";
    document.getElementById("last_name")!.style.display = "none";
    document.getElementById("postleitzahl")!.style.display = "none";
    document.getElementById("street")!.style.display = "none";
    document.getElementById("ort")!.style.display = "none";
    document.getElementById("land")!.style.display = "none";
    document.getElementById("buttonBack")!.style.display = "none";
    document.getElementById("companydetails")!.style.display = "none";

    document.getElementById("registerButton")!.style.display = "none";
}



  // In your component class
  errorResponse: string = '';
  successMessage: string = '';


  // Modify your register() method
  register() {
    if (this.registrationForm.valid) {
      if (this.userData.firmenname == "") {
        this.userData.firmenname = "Privat";
      }

      this.http.post(this.authService.baseUrl + 'register/', this.userData, { withCredentials: true })
        .subscribe(
          (response: any) => {
            const detail = typeof response === 'object' && response.detail ? response.detail : response;
            if (detail === 'Successfully created') {
              this.successMessage = 'User successfully created!';
              this.errorResponse = '';
              this.registrationForm.reset();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Nutzer erfolgreich erstellt, Sie werden weitergeleitet...',
                life: 3000,
              });
              setTimeout(() => {
                this.router.navigate(['login']);
              }, 1500);

            } else {
              this.successMessage = '';
              this.errorResponse = detail;
            }
          },
          (error: any) => {
            this.successMessage = '';
            // Check if the error object has a property named 'error'
            if (error.error && error.error.error) {
              // Extract the specific error message and display it
              this.errorResponse = error.error.error;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: this.errorResponse,
                life: 3000, //
              });
            } else {
              // If the error structure is different, display a generic error message
              this.errorResponse = 'An unexpected error occurred';
            }
          }
        );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Bitte füllen sie alle benötigten Felder aus.',
        life: 3000, //
      });
    }
  }



  sendToRights(){

    window.scrollTo(0, 0);
    this.router.navigate(['/impressum'])

  }




  private displayResponse(response: any) {
    let detail = '';

    // Check if the response is an object and has a "detail" property
    if (typeof response === 'object' && response.detail) {
      detail = response.detail;
    } else {
      // If it's not an object or doesn't have a "detail" property, use the whole response
      detail = response;
    }

    // Update the content of the success and error message containers
    if (detail === 'Successfully created') {
      this.successMessage = 'User successfully created!';
      this.errorResponse = '';  // Clear any previous error message
    } else {
      this.successMessage = '';  // Clear any previous success message
      this.errorResponse = detail;
    }
  }
}
