import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkIsLoggedIn();
  }

  checkIsLoggedIn() {
    this.http.get<boolean>('/api/user/isLoggedIn').subscribe((isLoggedIn: boolean) => {
      this.isLoggedInSubject.next(isLoggedIn);
    });
  }
  getUserInfo(): Observable<any> {
    return this.http.get('/api/user/info');
  }
  
  login() {
    // Redirect to the backend login route
    window.location.href = '/auth/google';
  }
}
