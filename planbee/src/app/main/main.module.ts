import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TrashComponent } from './trash/trash.component';
import { EditTasksComponent } from './edit-tasks/edit-tasks.component';
import { GroupComponent } from './group/group.component';
import { ContainerComponent } from './container/container.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'kalendarz',
    component: CalendarComponent,
  },
  {
    path: 'kosz',
    component: TrashComponent,
  },
  {
    path: 'group/:groupName/:groupId/:category/:id',
    component: EditTasksComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'group/:groupName/:groupId',
    component: GroupComponent,
  },
  {
    path: ':category/:id',
    component: EditTasksComponent,
  },
  {
    path: ':category',
    component: ContainerComponent,
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    CalendarComponent,
    TrashComponent,
    EditTasksComponent,
    GroupComponent,
    ContainerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainModule {}
