import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor, Toolbar } from 'ngx-editor';
import { Subscription } from 'rxjs/internal/Subscription';
import { GroupService } from 'src/app/services/http-requests/group.service';
import { AddNoteService } from 'src/app/services/http-requests/note.service';
import { UserServicesService } from 'src/app/services/user-services.service';
import {
  Notes,
  Note,
  NewNote,
  UpdatedNote,
  DeleteNote,
  GroupsItemsAction,
  RestoreNote,
} from '../../interfaces';

@Component({
  selector: 'app-edit-tasks',
  templateUrl: './edit-tasks.component.html',
  styleUrls: ['./edit-tasks.component.css'],
})
export class EditTasksComponent implements OnInit, OnDestroy {
  colorPresets = ['red', '#FF0000', 'rgb(255, 0, 0)'];
  editor!: Editor;
  category = '';
  id = '';
  title = '';
  editorContent = '';
  groupName = '';
  groupId = '';

  alertInfo: string = '';
  notes: Notes[] = [];
  note: Note[] = [];
  isNewNote = true;
  isSaved = false;
  isDelete = false;
  isError = false;
  isActiveConfirmationPopup: boolean = false;

  groupDetails!: GroupsItemsAction;

  private subscription = new Subscription();
  private timeoutId: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServicesService,
    private noteService: AddNoteService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.initializeRouteParams();
    this.initializeEditor();
    this.subscribeToUserData();
  }

  toolbar: Toolbar = [
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear'],
  ];

  saveOrUpdateNote() {
    if (this.isNewNote) {
      this.addNewNote();
    } else {
      this.onPatchNote();
    }
  }

  addNewNote() {
    const newNote: NewNote = {
      category: this.category,
      title: this.title,
      content: this.editorContent,
    };

    if (this.groupName && this.groupId) {
      this.groupDetails = {
        groupId: this.groupId,
        category: this.category,
      };
      this.groupService.addItemToGroup(this.groupDetails, newNote).subscribe(
        (response) => {
          this.isNewNote = false;
          this.userService.updateUserData(response.user);
          console.log(response);
          const newItemId = response.newItem._id;
          this.router.navigate([
            '/group/' +
              this.groupName +
              '/' +
              this.groupId +
              '/' +
              this.category +
              '/' +
              newItemId,
          ]);
          this.onCheckPopupStatus('Post');
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      this.noteService.postNotes(newNote).subscribe(
        (response) => {
          this.isNewNote = false;
          this.userService.updateUserData(response.user);
          this.notes = response.notes;
          const newNoteId = response.newNote._id;
          this.router.navigate([this.category + '/' + newNoteId]);
          this.onCheckPopupStatus('Post');
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }

  onPatchNote() {
    const updatedNote: UpdatedNote = {
      _id: this.id,
      category: this.category,
      title: this.title,
      content: this.editorContent,
    };
    if (this.groupName && this.groupId) {
      this.groupDetails = {
        groupId: this.groupId,
        category: this.category,
      };
      this.groupService
        .editItemInGroup(this.groupDetails, updatedNote)
        .subscribe(
          (response) => {
            this.isSaved = true;
            this.userService.updateUserData(response);
            this.notes = response.notes;
            this.onCheckPopupStatus('Patch');
            setTimeout(() => {
              this.isSaved = false;
            }, 3000);
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    } else {
      this.noteService.patchNotes(updatedNote).subscribe(
        (response) => {
          this.isSaved = true;
          this.userService.updateUserData(response);
          this.notes = response.notes;
          this.onCheckPopupStatus('Patch');
          setTimeout(() => {
            this.isSaved = false;
          }, 3000);
          setTimeout(() => {
            this.isActiveConfirmationPopup = false;
            this.isSaved = false;
          }, 2000);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }

  onDeleteNote() {
    const noteObject: DeleteNote = {
      category: this.category,
      noteId: this.id,
    };
    this.deleteNote(noteObject);
  }

  onDeleteNoteAside(id: string) {
    const noteObject: DeleteNote = {
      category: this.category,
      noteId: id,
    };
    this.deleteNote(noteObject);
  }

  onNoteClick(note: Note): void {
    this.title = note.title;
    this.id = note._id;
    this.editorContent = note.content;
    sessionStorage.setItem('taskId', note._id);
    this.checkIfNewNote();
  }

  onNewNote() {
    this.title = '';
    this.editorContent = '';
    this.id = '';
    this.isNewNote = true;
    sessionStorage.removeItem('taskId');
  }

  checkIfNewNote() {
    if (this.title === '') {
      this.isNewNote = true;
      this.onNewNote();
    } else {
      this.isNewNote = false;
    }
  }

  findNoteCategory() {
    this.note = this.notes
      .filter(
        (category) =>
          category &&
          category.category &&
          category.category.toLowerCase().includes(this.category.toLowerCase())
      )
      .map((category) => category.note)
      .flat();
    this.findNoteContentById(this.id);
  }

  getTimeDifference(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s temu`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m temu`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h temu`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d temu`;
  }

  getTimeDifferenceFromNow(addedTime: Date | string): string {
    if (addedTime instanceof Date) {
      return this.getTimeDifference(addedTime);
    } else if (typeof addedTime === 'string') {
      const date = new Date(addedTime);
      if (!isNaN(date.getTime())) {
        return this.getTimeDifference(date);
      }
    }
    return '';
  }

  navigateToNote(note: Note) {
    this.router.navigate([this.category + '/' + note._id]);
    this.title = note.title;
    this.editorContent = note.content;
  }

  navigateToGroupTask(note: Note) {
    this.router.navigate([
      '/group/' +
        this.groupName +
        '/' +
        this.groupId +
        '/' +
        this.category +
        '/' +
        note._id,
    ]);
    this.title = note.title;
    this.editorContent = note.content;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
    this.subscription.unsubscribe();
    sessionStorage.removeItem('taskId');
    sessionStorage.removeItem('lastDeletedNote');
    this.groupId = '';
    this.groupName = '';
  }

  private initializeRouteParams(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id') || '';
      this.category = params.get('category') || '';
      this.groupName = params.get('groupName') || '';
      this.groupId = params.get('groupId') || '';
    });
  }

  private findNoteContentById(id: string): void {
    if (!id) {
      const taskId = sessionStorage.getItem('taskId');
      if (!taskId) {
        return;
      }
    }
    const selectedNote = this.note.find((n) => n._id === id);
    if (selectedNote) {
      this.title = selectedNote.title;
      this.editorContent = selectedNote.content;
    }

    this.checkIfNewNote();
  }

  private initializeEditor(): void {
    this.editor = new Editor();
  }

  private subscribeToUserData(): void {
    this.subscription.add(
      this.userService.getUserData().subscribe((user) => {
        if (user) {
          if (this.groupName && this.groupId) {
            const group = user.groups.find(
              (group) => group._id === this.groupId
            );
            if (group) {
              if (this.category === 'notes') {
                this.note = group.notes;
                this.findNoteContentById(this.id);
              } else {
                this.note = group.tasks;
                this.findNoteContentById(this.id);
              }
            }
          } else {
            this.notes = user.notes;
            this.findNoteCategory();
          }
        }
      })
    );
  }

  private deleteNote(noteObject: DeleteNote) {
    this.isDelete = true;

    if (this.groupName && this.groupId) {
      const groupDetails: GroupsItemsAction = {
        groupId: this.groupId,
        category: noteObject.category,
        taskId: noteObject.noteId,
      };
      this.groupService.deleteItemFromGroup(groupDetails).subscribe(
        (response) => {
          this.userService.updateUserData(response);

          if (this.note && this.note.length > 0) {
            const lastNote = this.note[this.note.length - 1];
            this.navigateToGroupTask(lastNote);
          } else {
            this.title = '';
            this.editorContent = '';
            this.router.navigate([
              '/group/' +
                this.groupName +
                '/' +
                this.groupId +
                '/' +
                this.category,
              '',
            ]);
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      const localStorageData: RestoreNote = {
        originalCategory: noteObject.category,
        noteId: noteObject.noteId,
      };
      sessionStorage.setItem(
        'lastDeletedNote',
        JSON.stringify(localStorageData)
      );
      this.noteService.deleteNotes(noteObject).subscribe(
        (response) => {
          this.userService.updateUserData(response);
          this.notes = response.notes;

          if (this.note && this.note.length > 0) {
            const lastNote = this.note[this.note.length - 1];
            this.navigateToNote(lastNote);
          } else {
            this.title = '';
            this.editorContent = '';
            this.router.navigate([this.category, '']);
          }
          this.onCheckPopupStatus('Delete');
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }

  private onCheckPopupStatus(status: string) {
    clearTimeout(this.timeoutId);
    this.isActiveConfirmationPopup = true;

    if (status === 'Post') {
      this.alertInfo = 'Pomyślnie utworzono nowe ' + this.category;

      this.timeoutId = setTimeout(() => {
        this.isActiveConfirmationPopup = false;
      }, 3000);
    } else if (status === 'Delete') {
      this.alertInfo = 'Pomyślnie usunięto ' + this.category;

      this.timeoutId = setTimeout(() => {
        this.isActiveConfirmationPopup = false;
        setTimeout(() => {
          this.isDelete = false;
        }, 1000);
      }, 3000);
    } else if (status === 'Patch') {
      this.isDelete = false;
      this.alertInfo = 'Pomyślnie zapisano ' + this.category;

      this.timeoutId = setTimeout(() => {
        this.isActiveConfirmationPopup = false;
      }, 3000);
    }
  }
}
