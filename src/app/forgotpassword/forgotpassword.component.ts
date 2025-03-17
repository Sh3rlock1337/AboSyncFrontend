import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit{
  @ViewChild('passwordForgotForm') passwordForgotForm!: NgForm;
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

  userData = {
    email: '',
  }
  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }


  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      
    } else {
    }
  }
      sendBackToLoginPage(): void {
        this.router.navigate(['']);
      }

  forgotPasswordButton() {
    if (this.passwordForgotForm.valid) {
      //wenn ein @ zeichen in dem string enthalten ist
      if (this.userData.email.includes("@")) {
        this.authService.postForgotPassword(this.userData.email).subscribe(data => {
          this.navigateAfterDelay();
        });
      } else {
      }
    } else {
    }
  }

  navigateAfterDelay() {
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 450); // Delay in milliseconds
  }
}
