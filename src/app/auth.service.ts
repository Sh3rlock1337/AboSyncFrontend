// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  //FOR local http://127.0.0.1:8000/api/
  //for public https://abosync.com/api/
  public baseUrl = 'https://abosync.com/api/';
    

  constructor(private http: HttpClient,
    private cookieService: CookieService, private router: Router) {
    // Initialisiere den Authentifizierungszustand beim Instanziieren des Dienstes
    this.isAuthenticated = this.hasAuthToken();
  }

  login(username?: string, password?: string): Observable<any> {
    // Füge eine Überprüfung hinzu, um sicherzustellen, dass die Parameter vorhanden sind
    const credentials = (username && password) ? { username, password } : null;

    // Setze das CSRF-Token im Header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.baseUrl + "login/", credentials, { headers: headers, withCredentials: true }).pipe(
      tap((response: any) => {
        const authToken = response.access_token;
        // Aktualisiere den Authentifizierungszustand nach erfolgreichem Login
        this.isAuthenticated = true;
     //   console.log(authToken);
        this.setAuthToken(authToken); // Speichere den Authentifizierungstoken

      })
    );
  }


//HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
  getAboInformation(aboType: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
    });
    const body = JSON.stringify({
      abo: aboType,
    });

    console.log(headers)
    return this.http.post(this.baseUrl + 'stripecheckout/', body, { headers: headers, withCredentials: true }).pipe(
      tap(data => {
        //console.log(data); // handle your response data here or remove this line

      }),
      catchError(error => {
    //    console.log("Session expired");
 //       console.error('Error:', headers); // handle the error here

        throw error; // re-throw the error so the subscriber knows that an error occurred
      })
    );
  }


  getAboStripe() {
    const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
    });
    console.log(headers)
    return this.http.get(this.baseUrl + 'stripemanager/', { headers: headers, withCredentials: true }).pipe(
      tap(data => {
        //console.log(data); // handle your response data here or remove this line

      }),
      catchError(error => {
    //    console.log("Session expired");
    //    console.error('Error:', headers); // handle the error here

        throw error; // re-throw the error so the subscriber knows that an error occurred
      })
    );
  }

  
//HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
  getAboList() {
    const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
    });
//    console.log(headers)
    return this.http.get(this.baseUrl + 'abolist/', { headers: headers, withCredentials: true }).pipe(
      tap(data => {
        //console.log(data); // handle your response data here or remove this line

      }),
      catchError(error => {
   //     console.log("Session expired");
   //     console.error('Error:', headers); // handle the error here

        throw error; // re-throw the error so the subscriber knows that an error occurred
      })
    );
  }




  logout(): Observable<any> {
    // Füge hier den Code für den Logout hinzu, z. B. das Löschen des Tokens
    // Beachte, dass dies je nach deiner Backend-Implementierung variieren kann

    // Hier ein Beispiel, wie du den Token aus dem localStorage entfernen könntest
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken()
    });
    // Setze den Authentifizierungszustand auf false
    this.isAuthenticated = false;
    this.removeAuthToken();
 //   console.log(headers);
    // Hier kannst du auch eine API-Anfrage an den Server senden, um den Logout durchzuführen
    return this.http.post(this.baseUrl + 'logout/', null, { headers: headers, withCredentials: true }).pipe(
      tap(() => {
   //     console.log('Logout successful');
        // this.removeCookies();  // Call function to remove cookies
        
      })
    );
  }

   admingetMailNotificationActive(): Observable<any> {
    const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
    });
   // console.log(headers)
    return this.http.get(this.baseUrl + "getMailNotifier/", { headers: headers, withCredentials: true, responseType: 'json' }).pipe(
      tap(data => {

      }),
      catchError(error => {
        if (error.status === 403) {
    //      console.log("Access forbidden", error);
          // Sie können hier Ihre Logik ausführen, z.B. den Benutzer informieren
          return of(null); // Gibt ein Observable mit einem Null-Wert zurück
        } else {
     //     console.error('Error:', error);
          // Führen Sie hier Ihre Fehlerbehandlungslogik aus
          return EMPTY; // Gibt ein leeres Observable zurück, das nichts ausgibt und sofort vervollständigt wird
        }

      })
    );
  }
  isUserStaff(): Observable<any> {
    const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
    });
   // console.log(headers)
    return this.http.get(this.baseUrl + "getStaff/", { headers: headers, withCredentials: true, responseType: 'json' }).pipe(
      tap(data => {

      }),
      catchError(error => {
        if (error.status === 403) {
    //      console.log("Access forbidden", error);
          // Sie können hier Ihre Logik ausführen, z.B. den Benutzer informieren
          return of(null); // Gibt ein Observable mit einem Null-Wert zurück
        } else {
    //      console.error('Error:', error);
          // Führen Sie hier Ihre Fehlerbehandlungslogik aus
          return EMPTY; // Gibt ein leeres Observable zurück, das nichts ausgibt und sofort vervollständigt wird
        }

      })
    );
  }

  adminChangeMailNotificationStatus(): Observable<any> {
    const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
    });
 //   console.log(headers)
    return this.http.get(this.baseUrl + "setMailNotifier/", { headers: headers, withCredentials: true, responseType: 'json' }).pipe(
      tap(data => {

      }),
      catchError(error => {
        if (error.status === 403) {
    //      console.log("Access forbidden", error);
          // Sie können hier Ihre Logik ausführen, z.B. den Benutzer informieren
          return of(null); // Gibt ein Observable mit einem Null-Wert zurück
        } else {
    //      console.error('Error:', error);
          // Führen Sie hier Ihre Fehlerbehandlungslogik aus
          return EMPTY; // Gibt ein leeres Observable zurück, das nichts ausgibt und sofort vervollständigt wird
        }

      })
    );
  }

  changeMailNotificationStatus(): Observable<any> {
    // Set the CSRF-Token in the header
    const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
    });
    return this.http.get(this.baseUrl + "changeMailNotifier/", { headers: headers, withCredentials: true, responseType: 'json' }).pipe(
      tap(data => {

      }),
      catchError(error => {
   //     console.error('Error:', headers); // handle the error here
        throw error; // re-throw the error so the subscriber knows that an error occurred
      })
    );
  }

  postresetpassword(password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken()
    });

    // Erstellen des Body als JSON-Objekt
    const body = JSON.stringify({
      password: password,
    });

    console.log(headers);
    // Senden der API-Anfrage an den Server
    return this.http.post(this.baseUrl + 'resetpassword/', body, { headers: headers, withCredentials: true }).pipe(
      tap(() => {
    //    console.log('Successfull');
      })
    );
  }

  postnewabo(price: number, interval: number, nameofabo: string, kategorie: number, startdate: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken()
    });

    // Erstellen des Body als JSON-Objekt
    const body = JSON.stringify({
      preis: price,
      rechnungsintervall: interval,
      kategorie: kategorie,
      abrechnungsdatum: startdate,
      name: nameofabo
    });

    console.log(headers);
    // Senden der API-Anfrage an den Server
    return this.http.post(this.baseUrl + 'abopost/', body, { headers: headers, withCredentials: true }).pipe(
      tap(() => {
   //     console.log('Successfull');
      })
    );
  }

  getRegistrationModelData(id: number) {
    const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
    });
    return this.http.get(this.baseUrl + 'registrationmodel/' + id + '/', { headers: headers, withCredentials: true }).pipe(
      tap(data => {
   //     console.log(data);
      }),
      catchError(error => {
    //    console.log("")
        throw "";
      })
    )

  }


  deleteAccount(): Observable<any> {

    // Erstellen des Body als JSON-Objekt
    const body = JSON.stringify({
     
    });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken()
    });
    // Senden der API-Anfrage an den Server
    return this.http.post(this.baseUrl + 'deleteAccount/', body, { headers: headers, responseType: 'json' }).pipe(
      tap(data => {
     //   console.log("ACCOUTN GELÖSCHT!!!!!!!!!!!!!")
      }),
      catchError(error => {
        // Sie können hier Ihre Logik ausführen, z.B. den Benutzer informieren
        throw error; // Gibt ein Observable mit einem Null-Wert zurück


      })
    );
  }


  postForgotPassword(email: string): Observable<any> {
   
    // Erstellen des Body als JSON-Objekt
    const body = JSON.stringify({
      email: email,
    });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    // Senden der API-Anfrage an den Server
    return this.http.post(this.baseUrl + 'forgotpassword/', body, { headers: headers, responseType: 'json' }).pipe(
      tap(data => {
       
      }),
      catchError(error => {
          // Sie können hier Ihre Logik ausführen, z.B. den Benutzer informieren
        throw error; // Gibt ein Observable mit einem Null-Wert zurück
        

      })
    );
  }



  resetforgottenpassword(pass: string, uid: string, token: string): Observable<any> {

    // Erstellen des Body als JSON-Objekt
    const body = JSON.stringify({
      'new_password': pass,
      uid: uid,
      token: token,
    });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  //  console.log(body)
    // Senden der API-Anfrage an den Server
    return this.http.post(this.baseUrl + 'resetforgottenpassword/', body, { headers: headers, responseType: 'json' }).pipe(
      tap(data => {
  //      console.log(data)
      }),
      catchError(error => {
        // Sie können hier Ihre Logik ausführen, z.B. den Benutzer informieren
        throw error; // Gibt ein Observable mit einem Null-Wert zurück


      })
    );
  }

  getAllAbosforInfo(): Observable<any> {
    // Set the CSRF-Token in the header
    const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
    });
 //   console.log(headers)
    return this.http.get(this.baseUrl + "getallAbos/", { headers: headers, withCredentials: true, responseType: 'json' }).pipe(
      tap(data => {

   //     console.log("LOGGEDIN USER DATA")
  //      console.log(data); // handle your response data here or remove this line
      }),
      catchError(error => {
  //      console.error('Error:', headers); // handle the error here
        throw error; // re-throw the error so the subscriber knows that an error occurred
      })
    );
  }

  resendMail(): Observable<any> {
    // Set the CSRF-Token in the header
    const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
    });
 //   console.log(headers)
    return this.http.get(this.baseUrl + "resendmail/", { headers: headers, withCredentials: true, responseType: 'json' }).pipe(
      tap(data => {

    //    console.log("LOGGEDIN USER DATA")
   //     console.log(data); // handle your response data here or remove this line
      }),
      catchError(error => {
   //     console.error('Error:', headers); // handle the error here
        throw error; // re-throw the error so the subscriber knows that an error occurred
      })
    );
  }

  getEmailCode(id: number, input: string): Observable<any> {
    // Set the CSRF-Token in the header
    const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
      'Content-Type': 'application/json',
    });
    
    const body = JSON.stringify({
      'input': input,
    });
    return this.http.post(this.baseUrl + 'emailcodes/' + id + '/', body, { headers: headers, withCredentials: true }).pipe(
      tap(data => {

      }),
      catchError(error => {
        throw error; // re-throw the error so the subscriber knows that an error occurred
      })
    );
  }


  




  deleteAbo(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
    });
   // console.log(headers)
    if (id == 0) {
      return throwError('Invalid ID');
    }
    return this.http.delete(this.baseUrl + 'abo/' + id + '/', { headers: headers, withCredentials: true }).pipe(
      tap(data => {
  //      console.log(data); // handle your response data here or remove this line

      }),
      catchError(error => {
   //     console.log("Session expired");
   //     console.error('Error:', headers); // handle the error here

        throw error; // re-throw the error so the subscriber knows that an error occurred
      })
    );
  }

  getAboDetail(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
    });
  //  console.log(headers)
    if (id == 0) {
      return throwError('Invalid ID');
    }
    return this.http.get(this.baseUrl + 'abo/' + id + '/', { headers: headers, withCredentials: true }).pipe(
      tap(data => {
  //      console.log(data); // handle your response data here or remove this line

      }),
      catchError(error => {
    //    console.log("Session expired");
    //    console.error('Error:', headers); // handle the error here

        throw error; // re-throw the error so the subscriber knows that an error occurred
      })
    );
  }


  getKategorie(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
    });
    console.log(headers)
    if (id == 0) {
      return throwError('Invalid ID');
    }
    return this.http.get(this.baseUrl + 'kategorie/' + id + '/', { headers: headers, withCredentials: true }).pipe(
      tap(data => {
   //     console.log(data); // handle your response data here or remove this line

      }),
      catchError(error => {
   //     console.log("Session expired");
   //     console.error('Error:', headers); // handle the error here

        throw error; // re-throw the error so the subscriber knows that an error occurred
      })
    );
  }




  getCompanyData(id: number): Observable<any> {
    // Set the CSRF-Token in the header
    const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
      // 'X-SessionID': this.getCookie('sessionid')
    });
  //  console.log(headers)
    return this.http.get(this.baseUrl + 'company_data/' + id + '/', { headers: headers, withCredentials: true }).pipe(
      tap(data => {
   //     console.log(data); // handle your response data here or remove this line

      }),
      catchError(error => {
  //      console.log("Session expired");
       // console.error('Error:', headers); // handle the error here
        
        throw ""; // re-throw the error so the subscriber knows that an error occurred
      })
    );
  }

   getLoggedInUser(): Observable<any> {
     // Set the CSRF-Token in the header
      const headers = new HttpHeaders({
      'X-CSRFToken': this.getCookie('csrftoken'),
      'Authorization': 'Bearer ' + this.getAuthToken(),
     // 'X-SessionID': this.getCookie('sessionid')
    });
  //   console.log(headers)
     return this.http.get(this.baseUrl + "logged-in-user/", { headers: headers, withCredentials: true, responseType: 'json' }).pipe(
       tap(data => {
         // handle your response data here or remove this line
       }),
       catchError(error => {
         if (error.status === 302 || error.status === 401 || error.status==404) { // Überprüfen auf Redirect oder Unauthorized
           this.removeCookies();
           this.router.navigate(['/login']); // Umleitung zur Login-Seite
         }
         // Für andere Fehlerarten, geben Sie den Fehler zurück zum Subscriber
         return throwError(error);
       })
     );
  }




  private removeCookies(): void {
    localStorage.removeItem('authToken');
    // Add more lines to delete other cookies if needed
    this.deleteCookie("sessionid");
    this.deleteCookie("csrftoken")
  }

  private getCookies(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }


  deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  }


  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  private getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(';').shift()!;
    return '';
  }



  private hasAuthToken(): boolean {
    const authToken = this.getAuthToken();
    return authToken !== null && authToken !== undefined;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private setAuthToken(authToken: string): void {
    localStorage.setItem('authToken', authToken);
  }

  private removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }
}
