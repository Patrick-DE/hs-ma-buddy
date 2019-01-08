import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import {User} from '../_services/authentication.service';
import { DealerService } from '../dealers/dealer.service';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  constructor(private http: HttpClient) { }
  getEventsforUser(): Observable<UserEvent[]> {
    return this.http.get<Appointment[]>('http://localhost:3000/appointment')
    .map((appointments) => {
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
  getAppointmentsForUser(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>('http://localhost:3000/appointment');
  }
  sendAppointment(appointment: any) {
    return this.http.post(`http://localhost:3000/appointment`, appointment
    );
  }
  getBlocks(): Observable<Block[]> {

    return this.http.get<Block[]>('http://localhost:3000/block');
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
  status: Boolean;
  block_id: String;
  buddy_id: String;
  category_id: String;
  room: String;
  urgency: Boolean;
}
export interface Block {
  id: String;
  start_date: Number;
  end_date: Number;
}
export interface CreateAppointment {
  description: string;
  status: Boolean;
  block_id: String;
  buddy_id: String;
  category_id: String;
  room: String;
  urgency?: Boolean;
}

