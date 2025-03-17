import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from '../image.service';
import { kategoriesItem } from '../kategoriesItem';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})

export class SubscriptionComponent implements OnInit{
  registrationModelData: any;
  companyData: any;
  public isAuthenticated = false;
  user: any;
  constructor(private authService: AuthService,
    private router: Router,
    private kategories: kategoriesItem,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
  ) {

    
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
          if(this.registrationModelData.subvalue == 0){
              
          } else {
            this.router.navigate(['dashboard'])
          }

        });
    });
    }
  }

  settings(): void {
    this.router.navigate(['settings/']);
  }

  onBasic(): void{
    this.authService.getAboInformation("basic").subscribe(data => {
      const checkouturl = (data as any).url; // Type assertion here
      window.location.href = checkouturl;
      
    });
    
  }
  onPremium(): void {
    this.authService.getAboInformation("premium").subscribe(data => {
        const checkouturl = (data as any).url; // Type assertion here
        window.location.href = checkouturl;

      });
  }

  sendBackToLoginPage(): void {
    this.router.navigate(['']);
  }
  isAdmin(): boolean {
    if (this.user.is_staff) {

      // Hier sollten Sie Code hinzufügen, wenn Sie innerhalb des if-Blocks etwas ausführen möchten
    }
  
    console.log(this.user.is_superuser);
    return this.user.is_superuser;
  }
  getAuthenticated() {
    return this.isAuthenticated;
  }
  setAuthenticated(status: boolean) {
    this.isAuthenticated = status;
  }

}
