import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSettingsService } from 'src/app/services/http-requests/user-settings.service';
import { UserServicesService } from 'src/app/services/user-services.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  @Output() isSavedPassword = new EventEmitter();
  @Output() popupMess = new EventEmitter<string>();
  userForm!: FormGroup;
  error: boolean = false;
  matchPass: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userServices: UserServicesService,
    private userSettings: UserSettingsService
  ) {}

  ngOnInit() {
    this.onValidation();

    this.userForm.controls['password'].valueChanges.subscribe(() => {
      this.checkPasswordsMatch();
    });

    this.userForm.controls['repeatedPassword'].valueChanges.subscribe(() => {
      this.checkPasswordsMatch();
    });
  }

  checkPasswordsMatch() {
    const password = this.userForm.controls['password'].value;
    const repeatedPassword = this.userForm.controls['repeatedPassword'].value;

    this.matchPass = password !== repeatedPassword;
  }

  onValidation() {
    this.userForm = this.formBuilder.group(
      {
        currentPassword: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('^(?=.*[A-Z])(?=.*\\d).{8,}$'),
          ],
        ],
        repeatedPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')!.value === g.get('repeatedPassword')!.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    const formValue = {
      currentPassword: this.userForm.value.currentPassword!,
      newPassword: this.userForm.value.password!,
    };
    this.userSettings.patchUserSettings(formValue).subscribe(
      (response) => {
        this.userServices.updateUserData(response);
        this.error = false;
        this.popupMess.emit('Hasło zostało poprawnie zmienione.');
        this.isSavedPassword.emit();
      },
      (error) => {
        if (error.status === 400) {
          this.error = true;
        }
      }
    );
  }
}
