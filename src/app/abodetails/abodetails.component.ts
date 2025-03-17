import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { abodatamanager } from '../abodatamanager';
import { AuthService } from '../auth.service';
import { kategoriesItem } from '../kategoriesItem';
import { ImageService } from '../image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-abodetails',
  templateUrl: './abodetails.component.html',
  template: `<div [style.background-image]="imageUrl"> </div>`,
  styleUrls: ['./abodetails.component.scss']
})
export class AbodetailsComponent implements OnInit{

  public isAuthenticated = false;
  user: any;
  registrationModelData: any;
  companyData: any;
  kategorie: any;
 //  kategorieId: any; Zum Speichern der Kategorie-ID
  abodetails: any;
  items: any;
  price: number = 0; // Gesamtpreis pro Jahr mit beachtung der Abrechnungsintervalle
  imageUrl: SafeUrl | null = null;
  intervallAsString: string = "";
  newPriceStringOnIntervall: number = 0;
  gesamtPreisSeitBeginn: number = 0;
  vergangeneWochen: number = 0;
  vergangeneMonate: number = 0;
  tageBisZurNaechstenAbrechnung: number = 0;


  constructor(private authService: AuthService,
    private router: Router,
    private kategories: kategoriesItem,
    private abodatamanager: abodatamanager,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
  ) {
   
  }
  setAuthenticated(status: boolean) {
    this.isAuthenticated = status;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getAuthenticated() {
    return this.isAuthenticated;
  }

  checkIfLoggedIn() {
    if (!this.authService.isLoggedIn()) {
      this.sendBackToLoginPage();
    }
  }


  ngOnInit() {
    this.checkIfLoggedIn();
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
            if (abodatamanager.getAboID() == 0) {
              this.sendBackToLoginPage();
            }


            this.authService.getAboDetail(abodatamanager.getAboID()).subscribe(data => {
              this.abodetails = data;

              if (this.abodetails.rechnungsintervall.interval == 1) {
                this.intervallAsString = "Monatlich";
                this.newPriceStringOnIntervall = parseFloat((this.abodetails.preis / this.abodetails.rechnungsintervall.interval).toFixed(2));
              } else if (this.abodetails.rechnungsintervall.interval == 3) {
                this.newPriceStringOnIntervall = parseFloat((this.abodetails.preis / this.abodetails.rechnungsintervall.interval).toFixed(2));
                this.intervallAsString = "Vierteljährlich";
              } else if (this.abodetails.rechnungsintervall.interval == 6) {
                this.newPriceStringOnIntervall = parseFloat((this.abodetails.preis / this.abodetails.rechnungsintervall.interval).toFixed(2));
                this.intervallAsString = "Halbjährlich";
              } else if (this.abodetails.rechnungsintervall.interval == 12) {
                this.newPriceStringOnIntervall = parseFloat((this.abodetails.preis / this.abodetails.rechnungsintervall.interval).toFixed(2));
                this.intervallAsString = "Jährlich";
              }



              const imageId = this.abodetails.imageid; // Replace with the actual image ID you want to display
              this.imageService.getImage(imageId).pipe(
                catchError(error => {
                  if (error.status === 404) {
                    // Wenn ein 404-Fehler auftritt, behandeln Sie ihn und beenden Sie das Observable ohne Fehler
                    return of(null); // Gibt ein Observable aus, das null emittiert, um den Fehler still zu handhaben
                  }
                  // Für alle anderen Fehler, leiten Sie den Fehler weiter
                  throw error;
                })
              ).subscribe(blob => {
                if (blob) { // Stellen Sie sicher, dass das Blob nicht null ist
                  const objectURL = URL.createObjectURL(blob);
                  this.imageUrl = this.sanitizer.bypassSecurityTrustStyle(`url(${objectURL})`);
                } else {
                  // Hier können Sie entscheiden, was zu tun ist, wenn kein Bild gefunden wurde
                  // Zum Beispiel könnten Sie ein Standardbild setzen oder `imageUrl` leer lassen
                }
              },
                error => {
                  // Hier können Sie Fehler behandeln, die nicht 404 sind
                });

              // Extrahieren Sie die Werte aus dem abodetails-Objekt
              const abrechnungsDatumString: string = this.abodetails.abrechnungsdatum;
              const abrechnungsDatum: Date = this.parseDatum(abrechnungsDatumString);

              const preisString: string = this.abodetails.preis.toString();
              const preis: number = this.parsePreis(preisString);


              const intervallString: string = this.abodetails.rechnungsintervall.interval;
              const intervall: number = parseInt(intervallString);

              const heute: Date = new Date(); // Aktuelles Datum
              this.gesamtPreisSeitBeginn = this.berechneGesamtpreis(abrechnungsDatum, heute, intervall, preis);

              const startDatum: Date = new Date(this.abodetails.abrechnungsdatum);

              const tageDifferenz = (heute.getTime() - startDatum.getTime()) / (1000 * 3600 * 24);
              this.vergangeneWochen = Math.floor(tageDifferenz / 7);
              this.vergangeneMonate = tageDifferenz / 30.44; //

              this.berechneTageBisZurNaechstenAbrechnung(heute, startDatum);
              

            });           
          }

        });
      });
    
  }



  private berechneTageBisZurNaechstenAbrechnung(heute: Date, startDatum: Date): void {

    let naechstesAbrechnungsdatum: Date = new Date(startDatum);
    naechstesAbrechnungsdatum.setMonth(startDatum.getMonth() + this.abodetails.rechnungsintervall.interval);

    // Wenn das nächste Abrechnungsdatum in der Vergangenheit liegt, finde das nächste Datum
    while (naechstesAbrechnungsdatum <= heute) {
      naechstesAbrechnungsdatum.setMonth(naechstesAbrechnungsdatum.getMonth() + this.abodetails.rechnungsintervall.interval);
    }

    this.tageBisZurNaechstenAbrechnung = (naechstesAbrechnungsdatum.getTime() - heute.getTime()) / (1000 * 3600 * 24);
  }


  parseDatum(datumString: string): Date {
    const [jahr, monat, tag] = datumString.split('-').map(teil => parseInt(teil));
    return new Date(jahr, monat - 1, tag); // Monate sind 0-basiert in JavaScript/TypeScript
  }


  parsePreis(preisString: string): number {
    return parseFloat(preisString.replace(',', '.')); // Ersetzt Kommas durch Punkte für die Konvertierung
  }


  berechneGesamtpreis(start: Date, ende: Date, intervall: number, preis: number): number {
    const monate: number = (ende.getFullYear() - start.getFullYear()) * 12 + ende.getMonth() - start.getMonth();
    const aboZyklen: number = Math.floor(monate / intervall);
    return aboZyklen * preis;
  }


  deleteAbo() {
    this.authService.deleteAbo(abodatamanager.getAboID()).subscribe(data => {
    })
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


  sendBackToLoginPage(): void {
    this.router.navigate(['']);
  }
}
