import { Component, OnDestroy, OnInit } from '@angular/core';
import { Login, UserData } from '../interfaces';
import { Router } from '@angular/router';

import { UserAccessService } from '../services/http-requests/user-access.service';
import { UserServicesService } from '../services/user-services.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  emailValue: string = '';
  passwordValue: string = '';
  errorInfo: string = '';
  rememberMe: boolean = false;
  processing: boolean = false;
  done: boolean = false;
  userData: UserData | null = null;
  isError: boolean = false;
  isActiveAlert: boolean = false;
  isPopupTop: boolean = true;
  showPassword: boolean = false;

  private subscription: Subscription = new Subscription();
  constructor(
    private userAccessService: UserAccessService,
    private userService: UserServicesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.userService.getUserData().subscribe((data) => {
      if (data !== null) {
        this.userData = data;
      }
    });
  }

  onToggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin(f: any) {
    this.processing = true;

    setTimeout(() => {
      const loginData: Login = {
        email: this.emailValue,
        password: this.passwordValue,
        rememberMe: this.rememberMe,
      };

      this.userAccessService.login(loginData).subscribe(
        (response) => {
          this.isError = false;
          this.isActiveAlert = false;
          this.processing = false;
          this.done = true;
          this.userService.updateUserData(response.userData);
          this.userService.updateLoggedIn(true);
          this.userService.getUserData().subscribe();
          setTimeout(() => {
            setTimeout(() => {
              localStorage.setItem(
                'User',
                JSON.stringify({
                  name: response.userData.name,
                })
              );
              this.router.navigate(['/home']);
            }, 1000);
          }, 1000);
        },
        (error) => {
          this.isError = true;
          this.isActiveAlert = true;
          this.processing = false;
          if (error.status === 404 || error.status === 400) {
            this.errorInfo = 'E-mail lub hasło jest nieprawidłowe.';
          } else {
            this.errorInfo = error.error.error;
          }
        }
      );
    }, 1000);
  }

  get borderColor(): string {
    return this.emailValue
      ? 'var(--yellow40)'
      : this.errorInfo
      ? '#d0312d'
      : '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
