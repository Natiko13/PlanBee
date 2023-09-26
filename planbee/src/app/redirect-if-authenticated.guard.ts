import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class RedirectIfAuthenticatedGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(): boolean {
    const userId = this.cookieService.get('userId');
    if (userId) {
      this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}
