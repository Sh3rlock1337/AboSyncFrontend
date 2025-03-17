// dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { kategoriesItem } from '../kategoriesItem';
import { abodatamanager } from '../abodatamanager';
import { ImageService } from '../image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';

interface ListItem {
  index: number;
  link: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService],
})

export class DashboardComponent implements OnInit {

  public isAuthenticated = false;
  user: any;
  registrationModelData: any;
  companyData: any;
  pricingsList: any;
  items: any;
  monthOpen: any;
  totalYearPrice: number = 0; // Gesamtpreis pro Jahr mit beachtung der Abrechnungsintervalle
  totalRestYearPrice = 0;
  imageUrl: SafeUrl | null = null;
  listItems: ListItem[] = [];
  purchaseLevel = 0;
  aboCounter = 0;


  avarageYearOnMonth = 0; // Runtergerechnet auf 12 Monate der Jahresbetrag
  totalMonthPrice = 0; // Gesamtpreis pro Monat mit beachtung der AB Intervalle
  totalrestMonthPrice: number = 0; // Gesamtpreis pro Monat mit beachtung der AB Intervalle und Tage
  nextBillingDates: Date[] = []; // Daten der nächsten Abrechnung
    static myString: string;
    abosInfos: any;

  constructor(private authService: AuthService,
    private router: Router,
    private kategories: kategoriesItem,
    private abodatamanager: abodatamanager,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
  ) { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();

  }

  setVariable(aboid: number, montly: number) {
    // Stelle sicher, dass die Methode `setAboID` existiert und korrekt definiert ist in `AbodatamanagerService`
    abodatamanager.setAboID(aboid);
    abodatamanager.setTotalMonth(montly);
  }


  getAuthenticated() {
    return this.isAuthenticated;
  }
  setAuthenticated(status: boolean) {
    this.isAuthenticated = status;
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


  isAdmin(): boolean {
    if (this.user.is_staff) {

      // Hier sollten Sie Code hinzufügen, wenn Sie innerhalb des if-Blocks etwas ausführen möchten
    }

    return this.user.is_superuser;
  }


  // Hier kannst du weitere Methoden oder Logik für dein Dashboard hinzufügen

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.sendBackToLoginPage();
    } else {

      this.authService.getLoggedInUser().subscribe(data => {
        this.user = data;
       // console.log("registration model ");
        this.authService.getCompanyData(this.user.id).subscribe((companyData) => {
          this.companyData = companyData;
         // console.log("CompanyData");
         // console.log(this.companyData);
        });
        this.authService.getRegistrationModelData(this.user.id).subscribe(data => {
          this.registrationModelData = data;
         // console.log("registration model ");
         // console.log(this.registrationModelData);
          const emailverificationString = this.registrationModelData.emailverification.toString();
          if (emailverificationString == "0") {
            this.setAuthenticated(false);
            this.router.navigate(['verification']);
          } else {
            this.setAuthenticated(true);
            this.setPurchaseLevel(this.registrationModelData.subvalue)
            if(this.registrationModelData.subvalue == 0){

              this.router.navigate(['subscription']);
            }



            //console.log(" verified")
            this.authService.getAboList().subscribe(data => {
              this.pricingsList = data;
              this.aboCounter = this.pricingsList.length

             // console.log(this.pricingsList);
              //console.log("image" + this.pricingsList[0].imageid);
              for (let i = 0; i < this.pricingsList.length; i++) {
                // Zugriff auf das Element mit this.pricingsList[i]



                if (this.pricingsList[i].imageid != 0) {

                  const imageId = this.pricingsList[i].imageid;
                  this.imageService.getImage(imageId).subscribe(blob => {
                    const objectURL = URL.createObjectURL(blob);
                    this.listItems.push({
                      index: i,
                      link: objectURL // Speichern des originalen objectURL Strings
                    });
                  });

                }

              }

              this.totalYearPrice = 0;
              this.totalMonthPrice = 0;
              this.totalrestMonthPrice = 0;
              this.monthOpen = 0
              this.totalRestYearPrice = 0;

              //Berechne den Gesamtpreis und setze die Daten für die nächste Abrechnung
              this.calculateBillingInfo();
              this.authService.getAllAbosforInfo().subscribe(data => {

                this.abosInfos = data;
                let total = 0; // Zwischensumme für die Berechnung

                this.abosInfos.forEach((abo: { name: string; abrechnungsdatum: string; preis: string; status: string; }) => {
                  if (abo.status == "red" || abo.status == "yellow") {
                    total += Number(abo.preis); // Konvertiere den Preis in eine Zahl und addiere ihn zur Zwischensumme
                  }
                });

                // Addiere die Zwischensumme zu this.monthOpen und runde das Ergebnis
                this.monthOpen += total;
                this.monthOpen = Number(this.monthOpen.toFixed(2)); // Runde auf zwei Dezimalstellen und konvertiere zurück in eine Zahl
              });
            });
          }

        });
      });
    }

  }


  getLinkForPricing(index: number) {
    const item = this.listItems.find(item => item.index === index);
    return item ? this.sanitizer.bypassSecurityTrustStyle(`url(${item.link})`) : this.sanitizer.bypassSecurityTrustStyle('url(/assets/images/defaultbackground.png)');
  }



  addPriceForYear(rechnungsbeginn: string, rechnungsintervall: number, preis: number) {
    // Konvertiere rechnungsbeginn in ein Datum-Objekt
    const startDate = new Date(rechnungsbeginn);

    // Aktuelles Datum ermitteln
    const currentDate = new Date();

    // Berechne das nächste Fälligkeitsdatum
    const nextDueDate = new Date(startDate);
    nextDueDate.setMonth(startDate.getMonth() + rechnungsintervall);

    // Prüfe, ob das nächste Fälligkeitsdatum im aktuellen Jahr liegt
    if (nextDueDate.getFullYear() === currentDate.getFullYear()) {
      //console.log('Das Abo ist für dieses Jahr noch offen. Preis: ' + preis);

      this.totalRestYearPrice += +preis; // Füge den Preis zur jährlichen Gesamtsumme hinzu
      this.totalRestYearPrice = parseFloat(this.totalRestYearPrice.toFixed(2));

    } else {
    }
}
  loadImages(imageid: number) {
  }

  addPriceIfAboOpen(rechnungsbeginn: string, rechnungsintervall: number, preis: number) {
    // Konvertiere rechnungsbeginn in ein Datum-Objekt
    const startDate = new Date(rechnungsbeginn);
    startDate.setHours(0, 0, 0, 0); // Setze die Zeit auf Mitternacht
  //  console.log("startDate" + startDate);
    // Aktuelles Datum ermitteln
    const currentDate = new Date();
  //  console.log("CurrentDate" + currentDate);
    currentDate.setHours(0, 0, 0, 0); // Setze die Zeit auf Mitternacht

    // Berechne das nächste Fälligkeitsdatum
    let nextDueDate = new Date(startDate);
    nextDueDate.setMonth(startDate.getMonth() + rechnungsintervall);
  //  console.log("NEXTDUE date" + nextDueDate);

    // Stelle sicher, dass das Datum nicht über den Monat hinausgeht
    if (startDate.getDate() !== nextDueDate.getDate()) {
      nextDueDate = new Date(nextDueDate.getFullYear(), nextDueDate.getMonth(), 0);
    }
    if (currentDate <= startDate && currentDate < nextDueDate) {
      this.totalrestMonthPrice += +preis; // Füge den Preis zur Gesamtsumme hinzu

      this.totalrestMonthPrice = parseFloat(this.totalrestMonthPrice.toFixed(2));
    } else {
    }
  }



  getChunks(array: any[], chunkSize: number): any[][] {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  calculateBillingInfo() {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfNextYear = new Date(currentYear + 1, 0, 1);


    this.pricingsList.forEach((pricing: { abrechnungsdatum: string | number | Date; rechnungsintervall: { interval: any; }; preis: number; }) => {
   //   console.log("abrechnungsdatum: " + pricing.abrechnungsdatum);
    //  console.log("rechnungsinterval: " + pricing.rechnungsintervall.interval);
     // console.log("preis" + pricing.preis);
      let abrechnungsdatumString = typeof pricing.abrechnungsdatum === 'string'
        ? pricing.abrechnungsdatum
        : pricing.abrechnungsdatum instanceof Date
          ? pricing.abrechnungsdatum.toISOString().split('T')[0]
          : new Date(pricing.abrechnungsdatum).toISOString().split('T')[0];


      this.addPriceIfAboOpen(abrechnungsdatumString, pricing.rechnungsintervall.interval, pricing.preis);




      let dateString = pricing.abrechnungsdatum.toString().trim();
      const parts = dateString.split('-');
      let abrechnungsdatum = new Date(+parts[0], +parts[1] - 1, +parts[2]);

      if (isNaN(abrechnungsdatum.getTime())) {
        return; // Ungültiges Datum überspringen
      }

      let interval = pricing.rechnungsintervall.interval;
      let nextBillingDate = new Date(abrechnungsdatum);

      // Erhöhe das Abrechnungsdatum, bis es nach dem heutigen Datum liegt
      while (nextBillingDate <= currentDate) {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + interval);
      }

      // Überprüfe, ob das nächste Abrechnungsdatum im passenden Intervall liegt
      while ((nextBillingDate.getFullYear() - abrechnungsdatum.getFullYear()) * 12 + nextBillingDate.getMonth() - abrechnungsdatum.getMonth() < interval) {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      }

      this.nextBillingDates.push(nextBillingDate);


      //---

      // Berechne, wie oft pro Jahr abgerechnet wird
      let abrechnungenProJahr = 12 / pricing.rechnungsintervall.interval;

      // Berechne die jährlichen Kosten für dieses Abonnement
      let yearkost = pricing.preis * abrechnungenProJahr;
      if (nextBillingDate > currentDate ) {
        this.totalYearPrice += yearkost
        this.totalYearPrice = parseFloat(this.totalYearPrice.toFixed(2));
      }


      //---

      if (this.isPaymentDueThisMonth(abrechnungsdatumString, pricing.rechnungsintervall.interval)) {
        this.totalMonthPrice += +pricing.preis; // Füge den vollen Preis hinzu, wenn fällig
        this.totalMonthPrice = parseFloat(this.totalMonthPrice.toFixed(2));

      }
      // Addiere den berechneten Preisanteil zum Gesamtpreis des Monats und runde das Ergebnis

      //---

      //console.log("ENDE REST OF MONTH: " + this.totalrestMonthPrice);
    });

  }


  isPaymentDueThisMonth(rechnungsbeginn: string, rechnungsintervall: number) {
    const startDate = new Date(rechnungsbeginn);
    startDate.setHours(0, 0, 0, 0); // Setze die Zeit auf Mitternacht

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Setze die Zeit auf Mitternacht

    // Wenn das Abonnement monatlich ist, ist es jeden Monat fällig.
    if (rechnungsintervall === 1) {
      return true;
    }

    // Berechne die Anzahl der Monate seit dem Startdatum bis zum aktuellen Datum
    const monthsDiff = (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
      (currentDate.getMonth() - startDate.getMonth());

    // Wenn die Differenz ein Vielfaches des Intervalls ist, ist die Zahlung fällig
    return monthsDiff % rechnungsintervall === 0;
  }




  logout(): void {
    this.authService.logout().subscribe(
      () => {
        // Erfolgreich ausgeloggt
        // Hier kannst du weitere Aktionen nach dem Ausloggen hinzufügen
        this.sendBackToLoginPage();
      },
      (error) => {
      }
    );
  }
  sendBackToLoginPage(): void {
    this.router.navigate(['']);
  }


  setPurchaseLevel(level: number): void {
    this.purchaseLevel = level
  }

  addInvoice(): void {
    if (this.purchaseLevel == 1) {
      if (this.aboCounter >= 5) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Maximale Anzahl an Abos erreicht!',
          life: 3000, // Lebensdauer der Benachrichtigung in Millisekunden (optional)
        });
      } else {
        this.router.navigate(['addInvoice'])
      }
    } else if (this.purchaseLevel == 2) {
      this.router.navigate(['addInvoice'])

    }
  }
}




