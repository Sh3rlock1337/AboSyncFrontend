import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  

  constructor(private http: HttpClient, private authService: AuthService) { }

  uploadImage(formData: FormData) {
    return this.http.post(this.authService.baseUrl + "upload/", formData);
  }

  getImage(id: number) {
  return this.http.get(`${this.authService.baseUrl}image/${id}/`, { responseType: 'blob' });
}
}
