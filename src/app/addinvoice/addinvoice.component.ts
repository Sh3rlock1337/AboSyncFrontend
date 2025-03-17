import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { kategoriesItem } from '../kategoriesItem';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ImageService } from '../image.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-addinvoice',
  templateUrl: './addinvoice.component.html',
  styleUrls: ['./addinvoice.component.scss'],
  providers: [MessageService]
})
export class AddinvoiceComponent implements OnInit{
  private isAuthenticated: boolean = false;
  user: any;
  registrationModelData: any;
  companyData: any;
  pricingsList: any;
  items: any;
  buttonSichtbar: boolean = true;

  idAsInteger: number = 0;

  today: string ="";

  nameOfAbo: string = '';
  startDate: string = '';
  kategorieOfAbo: number = 0;
  priceOfAbo: number = 0;
  intervalOfAbo: number = 0;

  constructor(private authService: AuthService,
    private router: Router,
    private kategories: kategoriesItem,
    private imageService: ImageService,
    private messageService: MessageService,

  ) {
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];
  }
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;  // Speichern der ausgewählten Datei
    }
  }

  submitForm(): void {

    if(this.selectedText == "Unterhaltung"){
      this.kategorieOfAbo = 1;
    }
    if(this.selectedText == "Arbeiten"){
          this.kategorieOfAbo = 2;
        }
    if(this.selectedText == "Essen & Ausgehen"){
          this.kategorieOfAbo = 3;
        }
      if(this.selectedText == "Gaming"){
      this.kategorieOfAbo = 4;
    }
    if(this.selectedText == "Versicherungen"){
          this.kategorieOfAbo = 5;
    }
      if(this.selectedText == "Fitness"){
      this.kategorieOfAbo = 6;
    }

    if (this.selectedInterval == "1x Monatlich") {
      this.intervalOfAbo = 1;
    }
    if (this.selectedInterval == "alle 3 Monate") {
          this.intervalOfAbo = 2;
    }
    if (this.selectedInterval == "alle 6 Monate") {
          this.intervalOfAbo = 3;
    }
    if (this.selectedInterval == "alle 12 Monate") {
          this.intervalOfAbo = 4;
    }

    let konvertierteZahlAlsString: string = this.priceOfAbo.toString().replace(/,/g, '.');
    this.priceOfAbo = Number(konvertierteZahlAlsString);
    if (this.nameOfAbo != null && this.nameOfAbo != "" && this.startDate != null && this.kategorieOfAbo != 0 && this.priceOfAbo != 0 && this.intervalOfAbo != 0 && this.priceOfAbo>0) {
      if (this.selectedFile) {
        this.buttonSichtbar = false;
        const formData = new FormData();
        console.log(String(this.idAsInteger))
        formData.append('image_blob', this.selectedFile, this.selectedFile.name);
        formData.append('name', this.nameOfAbo); // Optional: Bildname
        formData.append('owner', String(this.idAsInteger)); // Konvertieren Sie die ID in einen String

        this.imageService.uploadImage(formData).subscribe(response => {
          //console.log('Bild erfolgreich hochgeladen:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Abo erfolgreich hinzugefügt',
            life: 3000, // Lebensdauer der Benachrichtigung in Millisekunden (optional)
            // Benutzerdefinierte CSS-Klasse für Erfolg
          });
          this.router.navigate(['dashboard/']);
          // Hier können Sie weitere Aktionen durchführen, nachdem das Bild hochgeladen wurde
        }, (error) => {
          console.error('Fehler beim Hochladen des Bildes:', error);
        });
      }

      this.authService.postnewabo(this.priceOfAbo, this.intervalOfAbo, this.nameOfAbo, this.kategorieOfAbo, this.startDate).subscribe(
        () => {
         // console.log("erfolgreich");
          if (this.selectedFile == null) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Abo erfolgreich hinzugefügt',
              life: 3000, // Lebensdauer der Benachrichtigung in Millisekunden (optional)
              // Benutzerdefinierte CSS-Klasse für Erfolg
            });
            this.router.navigate(['dashboard/']);
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );

    } else {
      //TODO: Fehlermeldung anzeigen
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Nicht alle benötigten Daten ausgefüllt!',
        life: 3000, // Lebensdauer der Benachrichtigung in Millisekunden (optional)
        // Benutzerdefinierte CSS-Klasse für Erfolg
      });
    }




  }
  intervals = [
    { value: 1, text: '1x Monatlich' },
    { value: 2, text: 'alle 3 Monate' },
    { value: 3, text: 'alle 6 Monate' },
    { value: 4, text: 'alle 12 Monate' },
    // Weitere Intervalle...
  ];
  selectedInterval: string | null = null;
  showDropdown: string | null = null;





  options = [
    { text: 'Unterhaltung', imgSrc: '/assets/svgs/unterhaltung.svg' },
    { text: 'Arbeiten', imgSrc: '/assets/svgs/arbeiten.svg' },
    { text: 'Essen & Ausgehen', imgSrc: '/assets/svgs/essen.svg' },
    { text: 'Gaming', imgSrc: '/assets/svgs/gaming.svg' },
    { text: 'Versicherungen', imgSrc: '/assets/svgs/versicherungen.svg' },
    { text: 'Fitness', imgSrc: '/assets/svgs/fitness.svg' },

    // Add other options here, each with its text and corresponding imgSrc
  ];
  selectedText: string | null = null;
  showOptions: boolean = false;
  selectedImage: string | null = null; // Add this line
  toggleDropdownKat(): void {
   this.showOptions = !this.showOptions;
  }

  selectOption(option: { text: string; imgSrc: string }): void {
    this.selectedText = option.text;
    this.selectedImage = option.imgSrc; // Add this line
    this.showOptions = false;
  }




  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();

  }
  toggleDropdown(dropdownType: string): void {
    this.showDropdown = this.showDropdown === dropdownType ? null : dropdownType;
  }
  selectInterval(interval: { value: number; text: string }): void {
    this.selectedInterval = interval.text;
    this.showDropdown = null;
  }

  hoverEffect() {
    const menuPoints = document.querySelectorAll('.menu-points');
    menuPoints.forEach((element) => {
      element.classList.add('hovered');
    });
  }

  removeHoverEffect() {
    const menuPoints = document.querySelectorAll('.menu-points');
    menuPoints.forEach((element) => {
      element.classList.remove('hovered');
    });
  }


  getAuthenticated() {
    return this.isAuthenticated;
  }
  setAuthenticated(status: boolean) {
    this.isAuthenticated = status;
  }




  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.sendBackToLoginPage();
    } else {
      this.authService.getLoggedInUser().subscribe(data => {
        this.user = data;

        this.authService.getCompanyData(this.user.id).subscribe((data) => {
          this.companyData = data;
          console.log(this.companyData)
          this.idAsInteger = this.companyData.userid;
        });
        this.authService.getRegistrationModelData(this.user.id).subscribe(data => {
          this.registrationModelData = data;
          this.checkForAbos(this.registrationModelData.subvalue);
          const emailverificationString = this.registrationModelData.emailverification.toString();
          if (emailverificationString == "0") {
            this.setAuthenticated(false);
            this.router.navigate(['verification']);
          } else {
            this.setAuthenticated(true);
            if(this.registrationModelData.subvalue == 0){
              this.router.navigate(['subscription']);
            }
          }
          });

      });

}


  }

  checkForAbos(subvalue: number): void {
    let abos = 0;

    this.authService.getAboList().subscribe(data => {
      this.pricingsList = data;
      abos = this.pricingsList.length
      if (subvalue == 0) {
        this.sendBackToLoginPage;
      } else if (subvalue == 1) {
        if (abos >= 5) {
          this.router.navigate(['dashboard/'])
        }
      }
    });

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
    this.router.navigate(['']);
  }

}

