import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CalendarComponent } from './main/calendar/calendar.component';
import { ContainerComponent } from './main/container/container.component';
import { EditTasksComponent } from './main/edit-tasks/edit-tasks.component';
import { HomeComponent } from './main/home/home.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { RedirectIfAuthenticatedGuard } from './redirect-if-authenticated.guard';
import { GroupComponent } from './main/group/group.component';
import { TrashComponent } from './main/trash/trash.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [RedirectIfAuthenticatedGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [RedirectIfAuthenticatedGuard],
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
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
    ],
  },
  {
    path: ':category/:id',
    component: EditTasksComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
