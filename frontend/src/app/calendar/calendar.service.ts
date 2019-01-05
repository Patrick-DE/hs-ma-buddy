import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import {User} from '../_services/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  constructor(private http: HttpClient) { }
  getEventsforUser(): Observable<UserEvent[]> {
    return this.http.get<Appointment[]>('http://localhost:3000/appointment')
    .map((appointments) => {
    console.log(appointments);
      if (!appointments || appointments == null) {
        return [];
      }
      return appointments.map((appointment) => {
        return {
          start: new Date(appointment.start_date),
          end: new Date(appointment.end_date),
          title: appointment.description,
        };
      });
    });
  }
}
export interface UserEvent {
  start: Date;
  end?: Date;
  title: string;
}
export interface Appointment {
  user_id: string;
  start_date: string;
  end_date: string;
  description: string;
}
