import {
  trigger,
  state,
  style,
  transition,
  animate,
  sequence,
} from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserData } from 'src/app/interfaces';
import { CategoryService } from 'src/app/services/http-requests/category.service';
import { AddNoteService } from 'src/app/services/http-requests/note.service';
import { UserServicesService } from 'src/app/services/user-services.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      state(
        'closed',
        style({
          height: '0',
          opacity: 0,
        })
      ),
      transition('closed => open', [
        style({ overflow: 'hidden' }),
        sequence([
          animate('0.3s ease', style({ height: '*', opacity: 1 })),
          style({ overflow: 'visible' }),
        ]),
      ]),
      transition('open => closed', [
        style({ overflow: 'hidden' }),
        sequence([
          animate('0.3s ease', style({ height: '0', opacity: 0 })),
          style({ overflow: 'hidden' }),
        ]),
      ]),
    ]),
  ],
})
export class TrashComponent implements OnInit, OnDestroy {
  toggleStates: { [key: string]: boolean } = {};
  isActivePopup: boolean = false;
  userData!: UserData;
  selectedItem = {
    category: '',
    title: '',
    content: '',
    id: '',
  };

  constructor(
    private userService: UserServicesService,
    private noteService: AddNoteService,
    private categoryService: CategoryService
  ) {}

  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.userService.getUserData().subscribe((data) => {
        if (data) {
          this.userData = data;
          this.userData.trash.forEach((item) => {
            if (this.toggleStates[item._id] === undefined) {
              this.toggleStates[item._id] = false;
            }
          });
        }
      })
    );
  }

  onRestoreNote(trashCategory: string, id: string) {
    const credentials = {
      originalCategory: trashCategory
        ? trashCategory
        : this.selectedItem.category,
      noteId: id ? id : this.selectedItem.id,
    };

    this.noteService.restoreNote(credentials).subscribe(
      (response) => {
        this.userService.updateUserData(response);
        this.selectedItem = {
          category: '',
          title: '',
          content: '',
          id: '',
        };
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onRestoreAllNote(categoryName: string) {
    const categoryNameObj = { originalCategory: categoryName };
    this.categoryService.restoreCategoryFromTrash(categoryNameObj).subscribe(
      (response) => {
        this.userService.updateUserData(response);
        this.selectedItem = {
          category: '',
          title: '',
          content: '',
          id: '',
        };
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onToggleOpen(id: string) {
    this.toggleStates[id] = !this.toggleStates[id];
  }

  onTogglePopup() {
    this.isActivePopup = !this.isActivePopup;
  }

  onSelectItem(category: any, item: any) {
    this.selectedItem = {
      category: category.originalCategory,
      title: item.title,
      content: item.content,
      id: item._id,
    };
  }

  handleEmptyTrash() {
    this.selectedItem = {
      category: '',
      title: '',
      content: '',
      id: '',
    };
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
