import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  sequence,
  AnimationEvent,
} from '@angular/animations';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          display: 'block',
        })
      ),
      state(
        'closed',
        style({
          opacity: 0,
          display: 'none',
        })
      ),
      transition('closed => open', [
        style({ display: 'block' }),
        sequence([animate('0.3s', style({ opacity: 1 }))]),
      ]),
      transition('open => closed', [
        sequence([animate('0.3s', style({ opacity: 0 }))]),
      ]),
    ]),
  ],
})
export class MainComponent implements OnInit {
  isHide: boolean = false;
  isOpenSettings: boolean = false;
  isOpenGroup: boolean = false;

  ngOnInit(): void {
    const navPos = sessionStorage.getItem('navPosition');
    if (navPos) {
      this.isHide = JSON.parse(navPos);
    }
  }

  onHideNav() {
    this.isHide = !this.isHide;
    sessionStorage.setItem('navPosition', String(this.isHide));
  }

  onActiveGroup() {
    this.isOpenGroup = !this.isOpenGroup;
  }

  onActiveSettings() {
    this.isOpenSettings = !this.isOpenSettings;
  }

  onAnimationEvent(event: AnimationEvent) {
    if (event.toState === 'closed') {
      this.isOpenSettings = false;
    }
  }
}
