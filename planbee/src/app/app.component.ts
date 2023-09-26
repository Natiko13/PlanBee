import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserServicesService } from './services/user-services.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { UserData } from './interfaces';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  userData!: UserData;

  private subscription: Subscription = new Subscription();

  constructor(
    private userServices: UserServicesService,
    private cookieService: CookieService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.userServices.theme$.subscribe((theme) => {
        if (theme === 'dark') {
          this.renderer.addClass(this.document.body, 'dark-theme');
        } else {
          this.renderer.removeClass(this.document.body, 'dark-theme');
        }
      })
    );

    const token = this.cookieService.get('userId');
    if (token) {
      this.subscription.add(
        this.userServices.getUserDataFromServer().subscribe(
          (data) => {
            this.userData = data;
            if (data.profileOptions.theme) {
              const theme = data.profileOptions.theme;
              localStorage.setItem('theme', JSON.stringify(theme));
              if (theme === 'dark') {
                this.renderer.addClass(this.document.body, 'dark-theme');
              } else {
                this.renderer.removeClass(this.document.body, 'dark-theme');
              }
            }
          },
          (error) => {
            this.router.navigate(['/login']);
          }
        )
      );
    } else {
      let storedTheme = JSON.parse(localStorage.getItem('theme') || 'null');
      if (storedTheme) {
        if (storedTheme === 'dark') {
          this.renderer.addClass(this.document.body, 'dark-theme');
        } else {
          this.renderer.removeClass(this.document.body, 'dark-theme');
        }
      } else {
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          this.renderer.addClass(this.document.body, 'dark-theme');
        }
      }
      this.router.navigate(['/login']);
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
