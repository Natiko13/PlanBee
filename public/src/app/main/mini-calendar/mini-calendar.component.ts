import { Component, OnInit } from '@angular/core';
import { CalendarCreator } from './calendar-creator.service';
import { Day } from './day.model';

@Component({
  selector: 'app-mini-calendar',
  templateUrl: './mini-calendar.component.html',
  styleUrls: ['./mini-calendar.component.css'],
})
export class MiniCalendarComponent implements OnInit {
  public monthDays!: Day[];

  public monthNumber!: number;
  public year!: number;

  public weekDaysName: string[] = [];

  public currentDate: Date = new Date();

  constructor(public calendarCreator: CalendarCreator) {}

  ngOnInit(): void {
    this.setMonthDays(this.calendarCreator.getCurrentMonth());

    this.weekDaysName.push('Pon');
    this.weekDaysName.push('Wt');
    this.weekDaysName.push('Śr');
    this.weekDaysName.push('Czw');
    this.weekDaysName.push('Pt');
    this.weekDaysName.push('Sb');
    this.weekDaysName.push('Nd');
  }

  onNextMonth(): void {
    this.monthNumber++;
    if (this.monthNumber === 12) {
      this.monthNumber = 0;
      this.year++;
    }
    this.setMonthDays(
      this.calendarCreator.getMonth(this.monthNumber, this.year)
    );
  }

  onPreviousMonth(): void {
    this.monthNumber--;
    if (this.monthNumber < 0) {
      this.monthNumber = 11;
      this.year--;
    }
    this.setMonthDays(
      this.calendarCreator.getMonth(this.monthNumber, this.year)
    );
  }

  isCurrentDay(day: Day): boolean {
    return (
      day.number === this.currentDate.getDate() &&
      day.monthIndex === this.currentDate.getMonth() &&
      day.year === this.currentDate.getFullYear()
    );
  }

  private setMonthDays(days: Day[]): void {
    this.monthDays = days;
    this.monthNumber = this.monthDays[20].monthIndex; // tutaj przechowujesz indeks miesiąca
    this.year = this.monthDays[20].year; // i rok
  }
}
