import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserData } from 'src/app/interfaces';
import { UserSettingsService } from 'src/app/services/http-requests/user-settings.service';
import { UserServicesService } from 'src/app/services/user-services.service';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css'],
})
export class PersonalDataComponent implements OnInit, OnDestroy {
  userForm = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    email: new FormControl(''),
  });

  @Output() isSavedPassword = new EventEmitter();
  @Output() popupMess = new EventEmitter<string>();

  private subscription: Subscription = new Subscription();

  constructor(
    private userServices: UserServicesService,
    private userSettingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.subscription = this.userServices.getUserData().subscribe((data) => {
      if (data) {
        this.userForm.patchValue({
          name: data.name,
          surname: data.surname,
          email: data.email,
        });
      }
    });
  }

  onSubmit() {
    const formValue = {
      name: this.userForm.value.name!,
      surname: this.userForm.value.surname!,
      email: this.userForm.value.email!,
    };
    this.userSettingsService.patchUserSettings(formValue).subscribe(
      (response) => {
        this.userServices.updateUserData(response);
        this.isSavedPassword.emit();
        this.popupMess.emit('Dane zostały poprawnie zmienione.');
      },
      (error) => {
        if (error.status === 400) {
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
