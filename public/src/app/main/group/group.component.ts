import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  Group,
  UserData,
  UpdateGroupName,
  RemoveMemberFromGroup,
  AddMembersToGroup,
} from 'src/app/interfaces';
import { GroupService } from 'src/app/services/http-requests/group.service';
import { UserServicesService } from 'src/app/services/user-services.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit, OnDestroy {
  @ViewChild('changingGroupNameInput') changingGroupNameInput!: ElementRef;

  isChangingGroupName: boolean = false;
  groupId: string = '';
  groupName: string = '';
  errorMess: string = '';
  isMenageGroupMembers: boolean = false;
  newMembers: string[] = [];
  removedMembers: string[] = [];
  addMemberInputValue = '';
  invalidMemberInput: boolean = false;
  isInvalidMail: boolean = false;
  toggleSettings: boolean = false;
  groupDeletePopup: boolean = false;

  userData!: UserData;
  group: Group = {
    name: '',
    members: [],
    notes: [],
    tasks: [],
  };

  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private userService: UserServicesService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.loadRoutingParams();
  }

  async onSendChangesToServer() {
    this.invalidMemberInput = false;
    this.isInvalidMail = false;
    const addMemberL = this.newMembers.length;
    const removeMemberL = this.removedMembers.length;

    if (addMemberL > 0 && removeMemberL > 0) {
      console.log('Both add and remove');
      await this.onRemoveGroupMembers(this.removedMembers);
      await this.onAddNewMembers(this.newMembers);
    } else if (addMemberL > 0) {
      console.log('Adding only');
      await this.onAddNewMembers(this.newMembers);
    } else if (removeMemberL > 0) {
      console.log('Removing only');
      await this.onRemoveGroupMembers(this.removedMembers);
    } else {
      this.onMenageGroupMembers();
      this.addMemberInputValue = '';
      console.log('No changes to send');
      return;
    }

    this.isMenageGroupMembers = false;
  }

  onCheckIfMemberExistAndAdd(mail: string) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailPattern.test(mail)) {
      this.groupService.checkIfMemberExist(mail).subscribe(
        (data) => {
          this.newMembers.push(mail);
          this.addMemberInputValue = '';
          this.errorMess = '';
          this.isInvalidMail = false;
        },
        (error) => {
          console.log(error);
          this.onCheckError(error);
        }
      );
    } else {
      this.errorMess = 'Proszę podać poprawny adres e-mail';
      this.isInvalidMail = true;
      this.invalidMemberInput = true;
    }
  }

  onRemoveMemberBeforeSend(memberName: string) {
    const memberIndex = this.newMembers.indexOf(memberName);
    this.newMembers.splice(memberIndex, 1);
  }

  onRemoveMember(mail: string, index: number) {
    this.group.members.splice(index, 1);
    this.removedMembers.push(mail);
  }

  toggleGroupNameInput() {
    this.isChangingGroupName = !this.isChangingGroupName;
    setTimeout(() => {
      this.changingGroupNameInput.nativeElement.focus();
    });
  }

  onMenageGroupMembers() {
    this.isMenageGroupMembers = !this.isMenageGroupMembers;
    this.toggleSettings = false;
  }

  onToggleSettings() {
    this.toggleSettings = !this.toggleSettings;
  }

  onBlur(item: string) {
    if (item === 'settings') {
      this.toggleSettings = false;
    } else {
      this.onChangeGroupName();
      this.isChangingGroupName = false;
    }
  }

  onCheckError(error: any) {
    this.isInvalidMail = true;
    this.invalidMemberInput = true;
    if (error.status === 404) {
      this.errorMess = 'Podany adres e-mail nie istnieje';
    } else if (error.status === 400) {
      this.errorMess = 'Błędnie wypełniono pole.';
    } else {
      this.errorMess = 'Coś poszło nie tak.';
    }
  }

  onToggleGroupDeleteConfirmation() {
    this.groupDeletePopup = !this.groupDeletePopup;
    this.toggleSettings = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadRoutingParams() {
    this.route.params.subscribe((params) => {
      this.groupName = params['groupName'];
      this.groupId = params['groupId'];

      if (this.userData) {
        this.findGroupById(this.userData);
      }
    });
  }

  private findGroupById(userData: UserData) {
    const foundGroup = userData.groups.find(
      (data) => data._id === this.groupId
    );
    if (foundGroup) {
      this.group = foundGroup;
    }
  }

  private getUserData() {
    this.subscription.add(
      this.userService.getUserData().subscribe((data) => {
        if (data) {
          this.userData = data;
          this.findGroupById(data);
        }
      })
    );
  }

  private onChangeGroupName() {
    const request: UpdateGroupName = {
      groupId: this.groupId,
      newName: this.groupName,
    };
    this.groupService.updateGroupName(request).subscribe(
      (response) => {
        this.userService.updateUserData(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private onAddNewMembers(addedEmails: string[]) {
    console.log(addedEmails);
    const request: AddMembersToGroup = {
      groupId: this.groupId,
      newMembers: addedEmails,
    };

    this.groupService.addMembersToGroup(request).subscribe(
      (response) => {
        this.newMembers = [];
        this.userService.updateUserData(response);
      },
      (error) => {
        this.onCheckError(error);
        console.error(error);
      }
    );
  }

  private onRemoveGroupMembers(removedEmails: string[]) {
    const request: RemoveMemberFromGroup = {
      groupId: this.groupId,
      membersEmail: removedEmails,
    };
    this.groupService.removeMember(request).subscribe(
      (response) => {
        this.userService.updateUserData(response);
      },
      (error) => {
        this.onCheckError(error);
        console.error(error);
      }
    );
  }
}
