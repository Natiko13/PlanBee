import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Event, NewEvent } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private postEventUrl = '/api/event';
  private deleteEventUrl = '/api/event';
  private patchEventUrl = '/api/event';

  constructor(private http: HttpClient) {}

  postEvent(credentials: NewEvent): Observable<any> {
    return this.http.post<any>(this.postEventUrl, credentials);
  }

  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete<any>(`${this.deleteEventUrl}/${eventId}`);
  }

  patchEvent(credentials: Event, eventId: string): Observable<any> {
    return this.http.patch<any>(
      `${this.patchEventUrl}/${eventId}`,
      credentials
    );
  }
}
