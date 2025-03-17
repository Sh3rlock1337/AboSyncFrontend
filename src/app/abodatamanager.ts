import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class abodatamanager {
  private static id: number = 0;
  private static totalMonth: number = 0;


  constructor(private http: HttpClient) { }


  public static setTotalMonth(totalMonth: number) {
   // console.log("Total MOnd" + totalMonth);
    abodatamanager.totalMonth = totalMonth;
  }

  public static getTotalMonth() {
    //console.log("------------------------------------------------------------" + abodatamanager.totalMonth);
    return abodatamanager.totalMonth;
  }


  public static setAboID(aboid: number) {
    // Logik zum Setzen der Abo-ID
   // console.log("IDD" + aboid)
    abodatamanager.id = aboid;
  }

  public static getAboID() {
    return abodatamanager.id;
  }

}
