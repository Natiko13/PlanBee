import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddNoteService } from 'src/app/services/http-requests/note.service';
import { UserServicesService } from 'src/app/services/user-services.service';

@Component({
  selector: 'app-trash-delete-confirm',
  templateUrl: './trash-delete-confirm.component.html',
  styleUrls: ['./trash-delete-confirm.component.css'],
})
export class TrashDeleteConfirmComponent {
  @Output() isActivePopup = new EventEmitter<void>();
  @Output() emptyTrashEvent = new EventEmitter<void>();


  constructor(
    private userService: UserServicesService,
    private noteService: AddNoteService
  ) {}

  onEmptyTrash() {
    this.noteService.emptyTrash().subscribe(
      (response) => {
        this.userService.updateUserData(response);
        this.isActivePopup.emit();
        this.emptyTrashEvent.emit();

      },
      (error) => {
        console.error(error);
      }
    );
  }

  onClosePopup() {
    this.isActivePopup.emit();
  }
}
