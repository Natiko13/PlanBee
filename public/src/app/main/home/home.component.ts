import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserServicesService } from 'src/app/services/user-services.service';
import { Group, Notes } from '../../interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  categoryName: string = '';
  category: Notes[] = [];
  groups: Group[] = [];

  private subscription: Subscription = new Subscription();

  constructor(private userService: UserServicesService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.userService.getUserData().subscribe((data) => {
        if (data !== null) {
          this.category = data.notes;
          this.groups = data.groups;
        }
      })
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
