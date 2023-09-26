import { Component, OnInit } from '@angular/core';
import { UserSettingsService } from 'src/app/services/http-requests/user-settings.service';
import { UserServicesService } from 'src/app/services/user-services.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  sequence,
} from '@angular/animations';
import { UserData } from 'src/app/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.css'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          height: '264px',
          opacity: 1,
          display: 'grid',
        })
      ),
      state(
        'closed',
        style({
          height: '0px',
          opacity: 0,
          display: 'none',
        })
      ),
      transition('closed => open', [
        style({ opacity: 0, height: '0px' }),
        sequence([
          animate('0s', style({ display: 'grid' })),
          animate('0.1s', style({ opacity: 1 })),
          animate('0.3s', style({ height: '264px' })),
        ]),
      ]),
      transition('open => closed', [
        sequence([
          animate('0.3s', style({ height: '0px' })),
          animate('0.1s', style({ opacity: 0 })),
          animate('0s', style({ display: 'none' })),
        ]),
      ]),
    ]),
    trigger('openCloseAvatar', [
      state(
        'open',
        style({
          height: '170px',
          opacity: 1,
          display: 'grid',
        })
      ),
      state(
        'closed',
        style({
          height: '0px',
          opacity: 0,
          display: 'none',
        })
      ),
      transition('closed => open', [
        style({ opacity: 0, height: '0px' }),
        sequence([
          animate('0s', style({ display: 'grid' })),
          animate('0.1s', style({ opacity: 1 })),
          animate('0.3s', style({ height: '170px' })),
        ]),
      ]),
      transition('open => closed', [
        sequence([
          animate('0.3s', style({ height: '0px' })),
          animate('0.1s', style({ opacity: 0 })),
          animate('0s', style({ display: 'none' })),
        ]),
      ]),
    ]),
  ],
})
export class ThemeComponent implements OnInit {
  bgArray: any[] = [];
  avatarsArray: any[] = [];
  background: string = '';
  avatar = '';
  userTheme = '';
  isOpenBackgroundSettings: boolean = false;
  isOpenAvatarSettings: boolean = false;
  userData!: UserData;

  subsciption: Subscription = new Subscription();

  constructor(
    private userSettingsService: UserSettingsService,
    private userService: UserServicesService
  ) {
    this.bgArray = this.userService.avableBackgrounds;
    this.avatarsArray = this.userService.avableAvatars;
  }

  ngOnInit(): void {
    this.subsciption.add(
      this.userService.getUserData().subscribe((data) => {
        if (data) {
          this.userData = data;
          this.userTheme = data.profileOptions.theme || 'light';
        }
      })
    );
  }

  patchBackground(data: string, type: number) {
    if (type === 1) {
      const profileOptions = { profileOptions: { avatar: data } };
      this.userSettingsService
        .patchUserSettings(profileOptions)
        .subscribe((response) => {
          this.avatar = response.profileOptions.avatar;
          this.userService.updateUserData(response);
          this.isOpenAvatarSettings = false;
        });
    } else if (type === 2) {
      const profileOptions = { profileOptions: { background: data } };
      this.userSettingsService
        .patchUserSettings(profileOptions)
        .subscribe((response) => {
          const bgi = response.profileOptions.background;
          this.background = bgi.slice(0, bgi.length - 4);
          this.userService.updateUserData(response);
          this.isOpenBackgroundSettings = false;
        });
    } else if (type === 3) {
      const profileOptions = { profileOptions: { theme: data } };
      this.userSettingsService
        .patchUserSettings(profileOptions)
        .subscribe((response) => {
          const theme = response.profileOptions.theme;
          localStorage.setItem('theme', JSON.stringify(theme));
          this.userService.updateUserData(response);
        });
    }
  }
  onActiveSetting(item: string) {
    if (item === 'avatar') {
      this.isOpenAvatarSettings = !this.isOpenAvatarSettings;
    } else {
      this.isOpenBackgroundSettings = !this.isOpenBackgroundSettings;
    }
  }

  onBlur(item: string) {
    if (item === 'avatar') {
      this.isOpenAvatarSettings = false;
    } else {
      this.isOpenBackgroundSettings = false;
    }
  }
}
