import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { Register, Login } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserAccessService {
  private loginUrl = '/api/login';
  private logoutUrl = '/api/logout';
  private registerUrl = '/api/register';

  constructor(private http: HttpClient) {}

  login(credentials: Login): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials);
  }

  logout(): Observable<any> {
    return this.http.post<any>(this.logoutUrl, {});
  }

  register(registerData: Register): Observable<any> {
    return this.http.post<any>(this.registerUrl, registerData);
  }
}
