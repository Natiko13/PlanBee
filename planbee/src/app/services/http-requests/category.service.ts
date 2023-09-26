import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoryUrl = '/api/category';
  private restoreCategoryUrl = '/api/restoreCategory';

  constructor(private http: HttpClient) {}

  postCategory(credentials: any): Observable<any> {
    return this.http.post<any>(this.categoryUrl, credentials);
  }

  patchCategory(credentials: any, id: string): Observable<any> {
    return this.http.patch<any>(`${this.categoryUrl}/${id}`, credentials);
  }

  deleteCategory(id: any): Observable<any> {
    return this.http.delete<any>(`${this.categoryUrl}/${id}`);
  }

  restoreCategoryFromTrash(categoryName: any): Observable<UserData> {
    return this.http.post<UserData>(this.restoreCategoryUrl, categoryName);
  }
}
