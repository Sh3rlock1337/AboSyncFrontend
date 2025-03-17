// session-expired.interceptor.ts

import { Injectable, ViewChild } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';

@Injectable()
export class SessionExpiredInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) { }
  public session: string = "";
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        (event) => {
          // Handle successful responses here if needed
        },
        (error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            // Redirect to the login page or another appropriate route
            this.authService.logout();
      //      console.log("interupter triggerted");
            this.session = "You're session expired!";
            this.router.navigate(['login/']);
          }
        }
      )
    );
  }
}
