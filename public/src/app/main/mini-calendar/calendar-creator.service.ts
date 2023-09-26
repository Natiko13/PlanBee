import { Day } from './day.model';

export class CalendarCreator {
  private currentYear: number;
  private currentMonthIndex: number;
  public firstDay: any;

  constructor() {
    let date = new Date();
    this.currentYear = date.getFullYear();
    this.currentMonthIndex = date.getMonth();
  }

  public getCurrentMonth(): Day[] {
    return this.getMonth(this.currentMonthIndex, this.currentYear);
  }

  public getMonth(monthIndex: number, year: number): Day[] {
    let days = [];

    let firstday = this.createDay(1, monthIndex, year, true);
    let countDaysInPrevMonth = new Date(year, monthIndex, 0).getDate();
    let firstDayWeekNumber = firstday.weekDayNumber;
    let prevMonthStartDay = countDaysInPrevMonth - (firstDayWeekNumber - 2);
    this.firstDay = firstday;

    //create previous month days
    for (let i = prevMonthStartDay; i <= countDaysInPrevMonth; i++) {
      days.push(
        this.createDay(
          i,
          monthIndex - 1,
          monthIndex === 0 ? year - 1 : year,
          false
        )
      );
    }
    days.push(firstday);
    //

    // create current month day
    let countDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    for (let i = 2; i <= countDaysInMonth; i++) {
      days.push(this.createDay(i, monthIndex, year, true));
    }
    //

    // create next month day
    let remainingDays = 42 - days.length;

    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        this.createDay(
          i,
          monthIndex + 1,
          monthIndex === 11 ? year + 1 : year,
          false
        )
      );
    }
    //

    return days;
  }

  public getMonthName(monthIndex: number): string {
    switch (monthIndex) {
      case 0:
        return 'Styczeń';
      case 1:
        return 'Luty';
      case 2:
        return 'Marzec';
      case 3:
        return 'Kwiecień';
      case 4:
        return 'Maj';
      case 5:
        return 'Czerwiec';
      case 6:
        return 'Lipiec';
      case 7:
        return 'Sierpień';
      case 8:
        return 'Wrzesień';
      case 9:
        return 'Październik';
      case 10:
        return 'Listopad';
      case 11:
        return 'Grudzień';
      default:
        return '|' + monthIndex;
    }
  }

  public getWeekDayName(weekDay: number): string {
    switch (weekDay) {
      case 0:
        return 'Nd';
      case 1:
        return 'Pon';
      case 2:
        return 'Wt';
      case 3:
        return 'Śr';
      case 4:
        return 'Czw';
      case 5:
        return 'Pt';
      case 6:
        return 'Sb';

      default:
        return '';
    }
  }

  private createDay(
    dayNumber: number,
    monthIndex: number,
    year: number,
    isCurrentMonth: boolean
  ) {
    let day = new Day();

    day.monthIndex = monthIndex;
    day.month = this.getMonthName(monthIndex);

    day.number = dayNumber;
    day.year = year;

    let jsWeekDay = new Date(year, monthIndex, dayNumber).getDay();
    day.weekDayNumber = jsWeekDay === 0 ? 7 : jsWeekDay;

    day.weekDayName = this.getWeekDayName(day.weekDayNumber);
    day.currentMonth = isCurrentMonth;
    return day;
  }
}
