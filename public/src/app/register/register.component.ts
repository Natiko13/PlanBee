import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAccessService } from '../services/http-requests/user-access.service';
import { Register } from '../interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerGroup!: FormGroup;
  passwordMatch: boolean = true;
  processing: boolean = false;
  done: boolean = false;
  errorInfo: string = '';
  isError: boolean = false;
  isActiveAlert: boolean = false;
  isPopupTop: boolean = true;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userAccessService: UserAccessService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.onValidation();

    this.registerGroup.get('password')!.valueChanges.subscribe(() => {
      this.passwordMatch = this.checkPasswordsMatch();
      this.cdr.detectChanges();
    });

    this.registerGroup.get('repeatedPassword')!.valueChanges.subscribe(() => {
      this.passwordMatch = this.checkPasswordsMatch();
      this.cdr.detectChanges();
    });
  }

  onToggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onValidation() {
    this.registerGroup = this.formBuilder.group(
      {
        name: ['', Validators.required],
        surname: ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('^(?=.*[A-Z])(?=.*\\d).{8,}$'),
          ],
        ],
        repeatedPassword: ['', [Validators.required]],
        privacyPolicy: [false, Validators.requiredTrue],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  checkPasswordsMatch(): boolean {
    const password = this.registerGroup.get('password')!.value;
    const repeatedPassword = this.registerGroup.get('repeatedPassword')!.value;
    return password === repeatedPassword;
  }

  onRegister() {
    if (this.registerGroup.invalid) {
      return;
    }
    this.processing = true;

    setTimeout(() => {
      const name = this.registerGroup.get('name')!.value;
      const surname = this.registerGroup.get('surname')!.value;
      const email = this.registerGroup.get('email')!.value;
      const password = this.registerGroup.get('password')!.value;
      const privacyPolicy = this.registerGroup.get('privacyPolicy')!.value;

      const userData: Register = {
        name: name,
        surname: surname,
        email: email,
        password: password,
        privacyPolicy: privacyPolicy,
      };

      this.userAccessService.register(userData).subscribe(
        (response) => {
          this.isError = false;
          this.isActiveAlert = false;
          this.processing = false;
          this.done = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        (error) => {
          this.isError = this.isActiveAlert = true;
          this.processing = false;

          if (error.error.error === 'Email already in use.') {
            this.errorInfo = 'Adres e-mail już jest zarejestrowany.';
          } else if (error.srtatus === 400) {
            this.errorInfo = 'Niektóre pola są nieuzupełnione.';
          } else {
            this.errorInfo = error.error.error;
          }
        }
      );
    }, 1000);
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')!.value === g.get('repeatedPassword')!.value
      ? null
      : { mismatch: true };
  }
}
