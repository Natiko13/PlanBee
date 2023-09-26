import { Component, Input, OnInit } from '@angular/core';
import { AddNoteService } from '../services/http-requests/note.service';
import { UserServicesService } from '../services/user-services.service';

@Component({
  selector: 'app-information-popup',
  templateUrl: './information-popup.component.html',
  styleUrls: ['./information-popup.component.css'],
})
export class InformationPopupComponent {
  @Input() category: string = '';
  @Input() alertInfo: string = '';
  @Input() isSaved: boolean = false;
  @Input() isActiveConfirmationPopup: boolean = false;
  @Input() isDelete: boolean = false;
  @Input() isError: boolean = false;
  @Input() isPasswordMatch: boolean = false;
  @Input() isPopupTop: boolean = false;

  constructor(
    private noteService: AddNoteService,
    private userService: UserServicesService
  ) {}

  onRestoreNote() {
    const lastDeletedNote = JSON.parse(
      sessionStorage.getItem('lastDeletedNote') || '{}'
    );

    if (lastDeletedNote && lastDeletedNote.noteId) {
      this.noteService.restoreNote(lastDeletedNote).subscribe((response) => {
        this.isDelete = false;
        this.alertInfo = 'Pomyślnie przywrócono ' + this.category;
        setTimeout(() => {
          this.isActiveConfirmationPopup = false;
        }, 3000);

        this.userService.updateUserData(response);
        sessionStorage.removeItem('lastDeletedNote');
      });
    }
  }
}
