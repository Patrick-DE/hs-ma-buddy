import { Component, OnInit } from '@angular/core';
import { CalendarService, Appointment } from './calendar.service';
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
  openAppointments = [];
  constructor(private calendarService: CalendarService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.getEvents();
    this.getOpenAppointments();

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
        this.openAppointments = appointments.filter( appointment => appointment.status === false);
        console.log(this.openAppointments);
    }
    );
  }
  deny(appointment: Appointment) {
    this.calendarService.denyAppointment(appointment).pipe().subscribe( data => { this.getOpenAppointments(); }, error => {
      if (error.error.err) {
        this.alertService.error(error.error.err);
        } else {
          this.alertService.error('Backend down');
        }
  });
  }
  accept(appointment: Appointment) {
    this.calendarService.acceptAppointment(appointment).pipe().subscribe( data => {this.getOpenAppointments();
       this.getEvents(); }, error => {
      if (error.error.err) {
        this.alertService.error(error.error.err);
        } else {
          this.alertService.error('Backend down');
        }
    });
  }
}
