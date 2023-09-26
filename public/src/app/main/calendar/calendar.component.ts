import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  Calendar,
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  EventInput,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { EventsService } from '../../services/http-requests/events.service';
import { Event, NewEvent } from '../../interfaces';
import { UserServicesService } from 'src/app/services/user-services.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localePl from '@angular/common/locales/pl';
import plLocale from '@fullcalendar/core/locales/pl';

import { FullCalendarComponent } from '@fullcalendar/angular';

registerLocaleData(localeEn);
registerLocaleData(localePl);

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  category = 'kalendarz';
  popupVisible = false;
  isAllDay = false;
  bgi = '';
  eventId = '';
  title = '';
  localization = '';
  description = '';
  startDate = '';
  startHour = '';
  endDate = '';
  endHour = '';
  calendarApi!: any;
  editing = false;
  isColorOpen = false;
  colorClass: string = 'yellow-90';
  color: string = '#ffeeb7';
  currentObject!: EventApi;
  currentEvents: EventApi[] = [];
  sortedEvents: any[] = [];
  calendar: any[] = [];

  userLocale: string = navigator.language;
  private subscription: Subscription = new Subscription();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private eventsService: EventsService,
    private userService: UserServicesService
  ) {}

  ngOnInit(): void {
    this.subscription = this.userService.getUserData().subscribe((data) => {
      if (data) {
        this.calendar = data.calendar;
        this.sortEventsByDate();
      }
    });
  }
  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    buttonText: {
      today: 'Dzisiaj',
      month: 'Miesiąc',
      week: 'Tydzień',
      day: 'Dzień',
      list: 'Lista',
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
    },
    locale: plLocale,
    displayEventEnd: true,
    progressiveEventRendering: true,
    eventDisplay: 'eventDisplay',
    firstDay: 1,
    dayHeaderFormat: { weekday: 'long' },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: false,
    dayMaxEvents: true,
    eventTextColor: '#000',
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events: this.loadEvents.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
  };

  async loadEvents(): Promise<EventInput[]> {
    return new Promise<EventInput[]>((resolve) => {
      this.subscription = this.userService.getUserData().subscribe(
        (data) => {
          const apiArr: EventInput[] = [];
          if (data?.calendar) {
            this.calendar = data.calendar;
            this.sortEventsByDate();
            data.calendar.forEach((el) => {
              apiArr.push({
                id: el._id,
                title: el.title,
                start: el.start,
                end: el.end,
                allDay: el.allDay,
                localization: el.localization,
                description: el.description,
                color: el.color,
                eventClass: el.eventClass,
              });
              resolve(apiArr);
            });
          }
        },
        (error) => console.error(error)
      );
    });
  }

  addNewEvent() {
    const newEvent: NewEvent = {
      title: this.title,
      start: this.isAllDay
        ? this.startDate
        : `${this.startDate}T${this.startHour}`,
      end: this.isAllDay ? this.startDate : `${this.endDate}T${this.endHour}`,
      allDay: this.isAllDay,
      localization: this.localization,
      description: this.description,
      color: this.color,
      eventClass: this.colorClass,
    };
    this.eventsService.postEvent(newEvent).subscribe(
      (response) => {
        this.calendarApi.addEvent({
          id: response.addedEvent._id,
          title: response.addedEvent.title,
          start: response.addedEvent.start,
          end: response.addedEvent.end,
          allDay: response.addedEvent.allDay,
          localization: response.addedEvent.localization,
          description: response.addedEvent.description,
          color: response.addedEvent.color,
          eventClass: this.colorClass,
        });
        this.resetFormFields();
        this.togglePopup();
        this.userService.updateUserData(response.user);
      },
      (error) => console.error('Error:', error)
    );
  }

  saveEditedEvent() {
    if (this.currentObject) {
      const updatedEvent: Event = {
        _id: this.eventId,
        title: this.title,
        start: this.isAllDay
          ? this.startDate
          : `${this.startDate}T${this.startHour}`,
        end: this.isAllDay ? this.startDate : `${this.endDate}T${this.endHour}`,
        allDay: this.isAllDay,
        localization: this.localization,
        description: this.description,
        color: this.color,
        eventClass: this.colorClass,
      };
      this.eventsService
        .patchEvent(updatedEvent, this.currentObject.id)
        .subscribe(
          (res) => {
            const response = res.calendar;
            this.userService.updateUserData(res.user);

            this.updateEventProperties(updatedEvent);
            this.togglePopup();
          },
          (error) => console.error('Error:', error)
        );
    }
  }

  deleteEvent() {
    if (this.currentObject) {
      this.eventsService.deleteEvent(this.currentObject.id).subscribe(
        (response) => {
          this.userService.updateUserData(response.user);

          this.currentObject.remove();
          this.togglePopup();
        },
        (error) => console.error('Error:', error)
      );
    }
  }

  handleEventDrop(dropInfo: any) {
    const event = dropInfo.event;
    const updatedEvent: Event = {
      _id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      allDay: event.allDay,
      localization: event.extendedProps['localization'],
      description: event.extendedProps['description'],
      color: event.backgroundColor,
      eventClass: event.extendedProps['eventClass'],
    };

    this.eventsService.patchEvent(updatedEvent, event.id).subscribe(
      (response) => {
        this.userService.updateUserData(response.user);
      },
      (error) => {
        console.error('Error updating event:', error);
        event.revert();
      }
    );
  }

  togglePopup() {
    this.popupVisible = !this.popupVisible;
    this.resetFormFields();
    if (this.isAllDay) this.isAllDay = false;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.resetFormFields();
    this.editing = false;
    this.togglePopup();
    this.setStartAndEndDates(selectInfo);
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.resetFormFields();
    this.editing = true;
    this.currentObject = clickInfo.event;
    this.togglePopup();
    this.setEventDetails(clickInfo.event);
  }

  handleEventClickApi(event: EventApi) {
    this.resetFormFields();
    this.editing = true;
    this.togglePopup();
    this.setEventDetails(event);
  }

  handleEventClickList(event: Event) {
    const foundEvent = this.findEventById(event._id);
    if (foundEvent) {
      this.handleEventClickApi(foundEvent);
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  resetFormFields() {
    this.isAllDay = false;
    this.title = '';
    this.description = '';
    this.localization = '';
  }

  hendleChangeDate() {
    if (this.startDate > this.endDate) {
      this.endDate = this.startDate;
    }
  }

  onOpenSelectColor() {
    this.isColorOpen = true;
  }

  onSelectColor(color: string, colorClass: string) {
    this.isColorOpen = false;
    this.color = color;
    this.colorClass = colorClass;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private findEventById(eventId: string): EventApi | undefined {
    return this.currentEvents.find((event) => event.id === eventId);
  }

  private setStartAndEndDates(selectInfo: DateSelectArg) {
    if (selectInfo.allDay) {
      this.calendarApi = selectInfo.view.calendar;
      this.startDate = selectInfo.startStr;
      this.endDate = selectInfo.endStr;

      const endDate = new Date(this.endDate);
      endDate.setDate(endDate.getDate() - 1);
      this.endDate = endDate.toISOString().slice(0, 10);

      const now = new Date();
      this.startHour = this.formatHour(now, 1);
      this.endHour = this.formatHour(now, 2);
    } else {
      this.calendarApi = selectInfo.view.calendar;
      this.startDate = selectInfo.startStr.slice(0, 10);
      this.endDate = selectInfo.endStr.slice(0, 10);

      this.startHour = selectInfo.startStr.slice(11, 16);
      this.endHour = selectInfo.endStr.slice(11, 16);
    }
    this.calendarApi.unselect();
  }

  private sortEventsByDate() {
    this.sortedEvents = this.calendar;
    if (this.sortedEvents) {
      this.sortedEvents.sort((a, b) => {
        const dateA = new Date(a.start).getTime();
        const dateB = new Date(b.start).getTime();
        return dateA - dateB;
      });
    }
  }

  private formatHour(date: Date, hoursToAdd: number): string {
    date.setHours(date.getHours() + hoursToAdd);
    date.setMinutes(0);
    return date.toLocaleString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private setEventDetails(event: EventApi) {
    this.currentObject = event;
    this.title = event.title;
    this.localization = event.extendedProps['localization'];
    this.description = event.extendedProps['description'];
    this.startDate = event.startStr.slice(0, 10);
    this.endDate = event.endStr.slice(0, 10);
    this.startHour = event.startStr.slice(11, 16);
    this.endHour = event.endStr.slice(11, 16);
    this.isAllDay = event.allDay;
    this.eventId = event.id;
    this.color = event.backgroundColor;
    this.colorClass = event.extendedProps['eventClass'];
  }

  private updateEventProperties(response: Event) {
    this.currentObject.setProp('title', response.title);
    this.currentObject.setStart(new Date(response.start));
    this.currentObject.setEnd(new Date(response.end));
    this.currentObject.setAllDay(response.allDay);
    this.currentObject.setExtendedProp('localization', response.localization);
    this.currentObject.setExtendedProp('description', response.description);
    this.currentObject.setProp('backgroundColor', response.color);
    this.currentObject.setExtendedProp('eventClass', response.eventClass);
  }
}
