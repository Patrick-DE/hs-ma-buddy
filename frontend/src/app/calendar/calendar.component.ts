import { Component, OnInit } from '@angular/core';
import { CalendarService } from './calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  viewDate: Date = new Date();
  events = [];
  weekStartsOn = 1;
  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.getEvents();

  }
  getEvents() {
     this.calendarService.getEventsforUser().subscribe(userEvents => this.events = userEvents);
  }
}
