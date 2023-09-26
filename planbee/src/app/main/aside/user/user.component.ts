import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserData } from 'src/app/interfaces';
import { UserAccessService } from 'src/app/services/http-requests/user-access.service';
import { UserServicesService } from 'src/app/services/user-services.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  userData!: UserData;
  @Output() hideDetails = new EventEmitter<void>();
  @Input() settings!: () => void;

  private subscription: Subscription = new Subscription();

  constructor(
    private userService: UserServicesService,
    private userAccesService: UserAccessService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.userService.getUserData().subscribe((data) => {
        if (data) {
          this.userData = data;
        }
      })
    );
  }

  onCloseUserDetails() {
    this.hideDetails.emit();
  }

  onLogout() {
    this.userAccesService.logout().subscribe(() => {
      location.reload();
    });
  }
}
