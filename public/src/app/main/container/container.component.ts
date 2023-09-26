import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserServicesService } from 'src/app/services/user-services.service';
import { Notes, Note } from '../../interfaces';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
})
export class ContainerComponent implements OnInit, OnDestroy {
  notes: Notes[] = [];
  note: Note[] = [];

  categoryName: string = '';

  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserServicesService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.userService.getUserData().subscribe((data) => {
        if (data !== null) {
          this.notes = data.notes;

          this.findNoteCategory();
        }
      })
    );

    this.route.params.subscribe((params) => {
      this.categoryName = params['category'];

      this.findNoteCategory();
    });
  }

  findNoteCategory() {
    this.note = this.notes
      .filter((category) => category.category.includes(this.categoryName))
      .map((category) => category.note)
      .flat();
  }

  onNoteClick(note: Note): void {
    this.router.navigate(['/' + this.categoryName, note.title], {
      state: { id: note._id },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
