import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  @Output() isSettingsActive = new EventEmitter<boolean>();
  isActivePopup: boolean = false;
  popupMess: string = '';
  activeSettingIndex: number = 1;

  onSwitchSetting(index: number) {
    this.activeSettingIndex = index;
  }

  onToggleSettings() {
    this.isSettingsActive.emit();
  }

  receiveMessage($event: string) {
    this.popupMess = $event;
  }

  onSavedPasswordPopup() {
    this.isActivePopup = !this.isActivePopup;

    if (this.isActivePopup) {
      setTimeout(() => {
        this.isActivePopup = false;
      }, 3000);
    }
  }
}
