import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, catchError, filter, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Notes, UserData, Event, Note } from '../interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserServicesService {
  // Indicates if the user is logged in
  private loggedIn: boolean = false;

  // Observables for user data, notes, and events
  private userData: BehaviorSubject<UserData | null> =
    new BehaviorSubject<UserData | null>(null);
  userData$ = this.userData.asObservable().pipe(shareReplay(1));

  private theme: BehaviorSubject<string> = new BehaviorSubject<string>('light');
  theme$ = this.theme.asObservable();

  private notes: BehaviorSubject<Notes[] | null> = new BehaviorSubject<
    Notes[] | null
  >(null);
  private event: BehaviorSubject<Event[] | null> = new BehaviorSubject<
    Event[] | null
  >(null);

  public avableBackgrounds: any[] = [
    'bg.png',
    'bg1.png',
    'bg2.png',
    'bg3.png',
    'bg4.png',
    'bg5.png',
    'bg6.png',
    'bg7.png',
    'bg8.png',
    'bg9.png',
    'bg10.png',
    'bg11.png',
    'bg12.png',
    'bg13.png',
    'bg14.png',
    'bg15.png',
    'bg16.png',
    'bg17.png',
    'bg18.png',
    'bg19.png',
    'bg20.png',
    'bg21.png',
    'bg22.png',
    'bg23.png',
    'bg24.png',
    'bg25.png',
    'bg26.png',
    'bg27.png',
    'bg28.png',
  ];
  public avableAvatars: any[] = [
    'Avatar1.png',
    'Avatar2.png',
    'Avatar3.png',
    'Avatar4.png',
    'Avatar5.png',
    'Avatar6.png',
    'Avatar7.png',
    'Avatar8.png',
    'Avatar9.png',
    'Avatar10.png',
    'Avatar11.png',
    'Avatar12.png',
    'Avatar13.png',
    'Avatar14.png',
    'Avatar15.png',
    'Avatar16.png',
    'Avatar17.png',
    'Avatar18.png',
    'Avatar19.png',
    'Avatar20.png',
    'Avatar21.png',
  ];

  constructor(private http: HttpClient, private router: Router) {}

  // Fetches user data from the server
  getUserDataFromServer(): Observable<UserData> {
    return this.http.get<UserData>('/api/getUserData').pipe(
      map((response) => {
        this.userData.next(response);
        this.notes.next(response.notes);
        this.event.next(response.calendar);
        this.loggedIn = true;
        if (response.profileOptions.theme) {
          this.theme.next(response.profileOptions.theme);
        }
        return response;
      }),
      // Handle any errors during the fetch
      catchError((error) => {
        this.loggedIn = false;
        this.userData.error(error);
        this.router.navigate(['/login']);
        return of(null);
      }),
      // Filter out null responses
      filter((response): response is UserData => response !== null)
    );
  }

  // Checks if the user is logged in
  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  // Returns the observable for user data
  getUserData(): Observable<UserData | null> {
    return this.userData.asObservable().pipe(
      tap((userData) => {
        if (
          userData &&
          userData.profileOptions &&
          userData.profileOptions.theme
        ) {
          this.theme.next(userData.profileOptions.theme);
        }
      })
    );
  }

  // Updates the loggedIn status
  updateLoggedIn(data: boolean) {
    this.loggedIn = data;
  }

  // Updates user data
  updateUserData(data: UserData) {
    this.userData.next(data);
  }
}
