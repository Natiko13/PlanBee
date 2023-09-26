import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserSettings } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  private patchUserUrl = '/api/userSettings';

  constructor(private http: HttpClient) {}

  patchUserSettings(credentials: UserSettings): Observable<any> {
    return this.http.patch<any>(this.patchUserUrl, credentials);
  }
}
