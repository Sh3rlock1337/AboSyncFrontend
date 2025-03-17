import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class kategoriesItem {
  constructor(private http: HttpClient, private authService: AuthService) { }
  private apiUrl = this.authService.baseUrl + 'kategories/';

}
