import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/http-requests/category.service';
import { UserServicesService } from 'src/app/services/user-services.service';
import { UserData } from '../../interfaces';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css'],
})
export class AsideComponent implements OnInit, OnDestroy {
  @Input() isHide: boolean = false;
  @Output() onHideNav = new EventEmitter<void>();
  @Output() onActiveSettings = new EventEmitter<void>();
  @Output() onActiveGroup = new EventEmitter<void>();

  @ViewChild('categoryInput') categoryInput!: ElementRef;
  @ViewChild('taskInput') taskInput!: ElementRef;

  userData!: UserData;

  categoryJSON: any = { category: '' };
  isHideText: boolean = false;
  isActiveAdd: boolean = false;
  isActiveAnimation: boolean = false;
  isTaskOption: boolean = false;
  editedTaskId: string | null = null;
  activeNoteId: string | null = null;
  newCategory: string = '';
  updatedCategory: string = '';
  isAddingError: boolean = false;
  responseError: string = '';
  isUserDetailsShown: boolean = false;
  isUpdateCategoryError: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private userService: UserServicesService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscribeToUserData();
    const navPos = sessionStorage.getItem('navPosition');
    if (navPos) {
      this.isHideText = JSON.parse(navPos);
    }
  }

  toggleHide(): void {
    if (this.isHideText) {
      setTimeout(() => {
        this.isHideText = !this.isHideText;
      }, 500);
    } else {
      setTimeout(() => {
        this.isHideText = !this.isHideText;
      }, 500);
    }
    this.isActiveAdd = false;
    this.isActiveAnimation = false;
    this.onHideNav.emit();
  }

  onAddNewCategory(): void {
    if (this.isHideText) {
      this.onHideNav.emit();
      setTimeout(() => {
        this.isHideText = false;
        this.isActiveAdd = true;
        setTimeout(() => {
          this.categoryInput.nativeElement.focus();
        });
      }, 700);
    } else {
      this.isActiveAdd = true;
      this.isAddingError = false;
      this.responseError = '';
      setTimeout(() => {
        this.categoryInput.nativeElement.focus();
      });
    }
  }

  handleCategoryAction(): void {
    this.categoryJSON.category = this.newCategory;
    if (this.newCategory) {
      this.addNewCategory();
    } else {
      this.isActiveAdd = false;
    }
  }

  onInputSubmit(): void {
    this.handleCategoryAction();
  }

  addNewCategory(): void {
    this.categoryService.postCategory(this.categoryJSON).subscribe(
      (response) => {
        this.userService.updateUserData(response);
        this.userData.notes = response.notes;
        this.newCategory = '';
        this.isAddingError = false;
        this.isActiveAdd = false;
      },
      (error) => {
        error.status === 400
          ? (this.responseError = 'Kategoria juz istnieje')
          : error.error.error;
        this.isAddingError = true;
      }
    );
  }

  onDeleteCategory(noteId: string): void {
    this.categoryService.deleteCategory(noteId).subscribe(
      (response) => {
        this.userService.updateUserData(response);
        this.userData.notes = response.notes;
        this.isTaskOption = false;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  onUpdateCategory(updatedCategory: string, noteId: string) {
    this.categoryJSON.category = updatedCategory;
    this.categoryService.patchCategory(this.categoryJSON, noteId).subscribe(
      (response) => {
        this.userService.updateUserData(response);
        this.userData.notes = response.notes;
        this.isUpdateCategoryError = false;
        this.editedTaskId = null;
        this.router.navigate(['/' + updatedCategory]);
      },
      (error) => {
        error.status === 400
          ? (this.responseError = 'Kategoria juz istnieje')
          : error.error.error;
        this.isUpdateCategoryError = true;
      }
    );
  }

  onEdit(note: any): void {
    this.isTaskOption = true;
    this.activeNoteId = note._id;
  }

  onEditTask(note: any) {
    this.editedTaskId = note._id;
    this.updatedCategory = note.category;
    setTimeout(() => {
      this.taskInput.nativeElement.focus();
    });
  }

  onItemBlur(): void {
    this.isTaskOption = false;
    this.activeNoteId = null;
  }

  onCloseEdit(note: any): void {
    if (this.updatedCategory !== '') {
      this.onUpdateCategory(this.updatedCategory, note._id);
    }
  }

  onShowUserDetails() {
    this.isUserDetailsShown = !this.isUserDetailsShown;
  }

  openSettings() {
    this.onActiveSettings.emit();
  }

  openGroup() {
    this.onActiveGroup.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeToUserData(): void {
    this.subscription = this.userService.getUserData().subscribe((userData) => {
      if (userData) {
        this.userData = userData;
      }
    });
  }
}
