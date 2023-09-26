import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserSettingsService } from '../../services/http-requests/user-settings.service';
import { UserServicesService } from '../../services/user-services.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  sequence,
} from '@angular/animations';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css'],
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
  ],
})
export class BackgroundComponent implements OnInit, OnDestroy {
  isOpenBackgroundSetting: boolean = false;
  background: string = '';
  bgArray: any[] = [];
  bgi: string = '';

  private subscription: Subscription = new Subscription();

  constructor(
    private userSettingsService: UserSettingsService,
    private useService: UserServicesService
  ) {
    this.bgArray = this.useService.avableBackgrounds;
  }

  ngOnInit() {
    this.subscription = this.useService.getUserData().subscribe((data) => {
      if (data && data.profileOptions && data.profileOptions.background) {
        this.bgi = data.profileOptions.background;
        this.background = this.bgi.slice(0, this.bgi.length - 4);
      }
    });
  }

  patchBackground(data: string) {
    const profileOptions = { profileOptions: { background: data } };
    this.userSettingsService
      .patchUserSettings(profileOptions)
      .subscribe((response) => {
        const bgi = response.profileOptions.background;
        this.background = bgi.slice(0, bgi.length - 4);
        this.useService.updateUserData(response);
        this.isOpenBackgroundSetting = false;
      });
  }

  onActiveBgSetting() {
    this.isOpenBackgroundSetting = !this.isOpenBackgroundSetting;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
