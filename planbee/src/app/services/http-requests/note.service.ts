import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Note,
  NewNote,
  DeleteNote,
  UserData,
  RestoreNote,
} from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AddNoteService {
  private noteUrl = '/api/note';
  private restoreNoteUrl = '/api/restoreNote';
  private emptyTrashUrl = '/api/emptyTrash';

  constructor(private http: HttpClient) {}

  postNotes(credentials: NewNote): Observable<any> {
    return this.http.post<any>(this.noteUrl, credentials);
  }

  deleteNotes(credentials: DeleteNote): Observable<any> {
    return this.http.request<any>('DELETE', this.noteUrl, {
      body: credentials,
    });
  }

  patchNotes(credentials: Note): Observable<any> {
    return this.http.patch<any>(`${this.noteUrl}`, credentials);
  }

  restoreNote(credencials: RestoreNote): Observable<UserData> {
    return this.http.post<UserData>(`${this.restoreNoteUrl}`, credencials);
  }

  emptyTrash():Observable<UserData>{
    return this.http.post<UserData>(`${this.emptyTrashUrl}`, null)
  }
}
