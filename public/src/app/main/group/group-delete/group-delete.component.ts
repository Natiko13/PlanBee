import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupService } from 'src/app/services/http-requests/group.service';
import { UserServicesService } from 'src/app/services/user-services.service';
import { Group } from 'src/app/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-delete',
  templateUrl: './group-delete.component.html',
  styleUrls: ['./group-delete.component.css'],
})
export class GroupDeleteComponent {
  @Input() groupName: string = '';
  @Input() groupId: string = '';
  @Output() groupDeletePopup = new EventEmitter<void>();
  group!: Group[];

  constructor(
    private router: Router,
    private userService: UserServicesService,
    private groupService: GroupService
  ) {}

  onCancelDelete() {
    this.groupDeletePopup.emit();
  }

  onDeleteGroup() {
    this.groupService.deleteGroup(this.groupId).subscribe(
      (response) => {
        this.userService.updateUserData(response);
        this.group = response.groups;
        this.groupDeletePopup.emit();

        if (this.group && this.group.length > 0) {
          const lastGroup = this.group[this.group.length - 1];
          this.router.navigate([
            '/group/' + lastGroup.name + '/' + lastGroup._id,
          ]);
        } else {
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
