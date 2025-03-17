import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, of, tap, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit{
  uid: string = '';
  token: string = '';
  newPassword: string = '';
  newPasswordConfirm: string = '';
  succesResponse: string = "";
  errorResponse: string = '';
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.uid = params['uid'];
      this.token = params['token'];
      // Jetzt haben Sie UID und Token und können die Logik für das Zurücksetzen implementieren
    });
  }

  // Funktion zum Senden des neuen Passworts und des Tokens an Django
  resetPassword(newPassword: string, newPasswordConfirm: string) {
    if (newPassword != newPasswordConfirm) {
      this.errorResponse = "Passwords doesn't match!";
    } else {

      this.authService.resetforgottenpassword(newPassword, this.uid, this.token).subscribe(
        data => {
          this.succesResponse = "Password successfully changed!";
          this.navigateAfterDelay();
        },
        error => {
          // This block will execute on any HTTP error response
          if (error.status === 400) {
            this.errorResponse = "Token expired!"
            // Handle the bad request here, maybe set a variable to show an error message to the user
          }
        }
      );
    }
    
  }

  navigateAfterDelay() {
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 450); // Delay in milliseconds
  }
}
