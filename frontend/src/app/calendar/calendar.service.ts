import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  constructor(private http: HttpClient) { }

  getEventsforUser(): Observable<UserEvent[]> {
    const currentUserMoodleId = JSON.parse(localStorage.getItem('currentUser'));
    console.log(currentUserMoodleId.user._id);
    // this.http.get<Appointment[]>('http://localhost:3000/appointment');
    return of([{
      'start': new Date(2019, 0, 12),
      'end': new Date(2019, 0, 12 ),
      'title': 'dealing meth'
    },
    {'start': new Date(2019, 0, 13),
    'end': new Date(2019, 0, 13 ),
    'title': 'dealing klebstoff'}]);

  }

}
export interface UserEvent {
  start: Date;
  end?: Date;
  title: string;
}
export interface Appointment {
  user_id: String;
  start_time: Number;
  end_time: Number;
  description: String;
}
