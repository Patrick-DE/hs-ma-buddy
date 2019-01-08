import { Component, OnInit } from '@angular/core';
import { CalendarService } from './calendar.service';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  viewDate: Date = new Date();
  events = [];
  weekStartsOn = 1;
  appointments = [];
  constructor(private calendarService: CalendarService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.getEvents();

  }
  getEvents() {
     this.calendarService.getEventsforUser().subscribe(
       userEvents => {
         this.events = userEvents; },
       error => {
        if (error.error.err) {
          this.alertService.error(error.error.err);
          } else {
            this.alertService.error('Backend down');
          }
    });
  }
  getOpenAppointments() {
    this.calendarService.getAppointmentsForUser().subscribe( appointments => {
        this.appointments = appointments.filter( appointment => appointment.status === false);
    }
    );
  }
}
