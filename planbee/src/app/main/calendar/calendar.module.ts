import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { BackgroundComponent } from '../background/background.component';

@NgModule({
  declarations: [CalendarComponent, BackgroundComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    MatSlideToggleModule,
    FormsModule,
  ],
  exports: [CalendarComponent, BackgroundComponent],
})
export class CalendarModule {}
