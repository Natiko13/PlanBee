import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AsideComponent } from './main/aside/aside.component';
import { HomeComponent } from './main/home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainComponent } from './main/main.component';
import { UserComponent } from './main/aside/user/user.component';
import { ContainerComponent } from './main/container/container.component';
import { HttpClientModule } from '@angular/common/http';
import { EditTasksComponent } from './main/edit-tasks/edit-tasks.component';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NgxEditorModule } from 'ngx-editor';
import { CalendarModule } from './main/calendar/calendar.module';
import { MiniCalendarComponent } from './main/mini-calendar/mini-calendar.component';
import { CalendarCreator } from './main/mini-calendar/calendar-creator.service';
import { GroupComponent } from './main/group/group.component';
import { SettingsComponent } from './main/settings/settings.component';
import { ThemeComponent } from './main/settings/theme/theme.component';
import { PersonalDataComponent } from './main/settings/personal-data/personal-data.component';
import { ChangePasswordComponent } from './main/settings/change-password/change-password.component';
import { GroupPopupComponent } from './main/group-popup/group-popup.component';
import { GroupDeleteComponent } from './main/group/group-delete/group-delete.component';
import { TrashComponent } from './main/trash/trash.component';
import { TrashDeleteConfirmComponent } from './main/trash/trash-delete-confirm/trash-delete-confirm.component';
import { InformationPopupComponent } from './information-popup/information-popup.component';
@NgModule({
  declarations: [
    AppComponent,
    AsideComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    UserComponent,
    ContainerComponent,
    EditTasksComponent,
    MiniCalendarComponent,
    GroupComponent,
    SettingsComponent,
    ThemeComponent,
    PersonalDataComponent,
    ChangePasswordComponent,
    GroupPopupComponent,
    GroupDeleteComponent,
    TrashComponent,
    TrashDeleteConfirmComponent,
    InformationPopupComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    CalendarModule,
    NgxEditorModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  providers: [CalendarCreator],
  bootstrap: [AppComponent],
})
export class AppModule {}
