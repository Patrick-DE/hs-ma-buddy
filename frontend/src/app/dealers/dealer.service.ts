import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DealerService {

  constructor(
    private http: HttpClient
  ) { }

  getDealers(): Observable<Dealer[]> {
    return this.http.get<Dealer[]>('http://localhost:3000/buddy');
}
}
export interface Dealer {
  moodle_id: number;
  first_name: String;
  last_name: String;
  mobile: String;
  email2: String;
  available: boolean;
  room: String;
  blocked: boolean;
  away: boolean;
  away_reason: String;
}
