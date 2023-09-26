import { Component, EventEmitter, OnInit, Output, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/services/http-requests/group.service';
import { UserServicesService } from 'src/app/services/user-services.service';

@Component({
  selector: 'app-group-popup',
  templateUrl: './group-popup.component.html',
  styleUrls: ['./group-popup.component.css'],
})
export class GroupPopupComponent implements OnInit {
  @Output() isGroupActive = new EventEmitter<void>();
  group!: FormGroup;
  invalidEmails: string[] = [];

  @ViewChildren('emailInput') emailInputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private groupService: GroupService,
    private userService: UserServicesService
  ) {}

  ngOnInit() {
    this.group = this.fb.group({
      emails: this.fb.array([this.createEmail(true)]),
    });
  }

  get emails() {
    return this.group.get('emails') as FormArray;
  }

  createEmail(isRequired: boolean = false): FormGroup {
    return this.fb.group({
      email: [
        '',
        isRequired
          ? [Validators.required, Validators.email]
          : [Validators.email],
      ],
    });
  }

  addEmail() {
    if (this.emails.length < 4) {
      this.emails.push(this.createEmail());
      setTimeout(() => {
        this.emailInputs.last.nativeElement.focus();
      }, 0);
    }
  }
  

  onSubmit() {
    const emailsArray = this.group.value.emails
      .map((obj: { email: any }) => obj.email)
      .filter((email: string) => email && email.trim() !== '');

    const req = {
      collaboratorEmails: emailsArray,
    };

    this.groupService.newGroup(req).subscribe(
      (response) => {
        this.userService.updateUserData(response);
        this.invalidEmails = [];
        this.onClose();
        const newGroup = response.groups[response.groups.length - 1];
        this.router.navigate(['/group/' + newGroup.name + '/' + newGroup._id]);

        this.group.reset();
        this.emails.clear();
        this.emails.push(this.createEmail(true));
      },
      (error) => {
        console.error(error);
        if (error.error && error.error.error) {
          this.invalidEmails =
            error.error.error.match(/[\w\.-]+@[\w\.-]+\.\w+/g) || [];
        }
      }
    );
  }

  onClose() {
    this.group.reset();
    this.emails.clear();
    this.emails.push(this.createEmail(true));
    this.isGroupActive.emit();
  }
}
