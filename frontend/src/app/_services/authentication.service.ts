import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient,
      private cookieService: CookieService) { }

    login(email: string, password: string) {
        return this.http.post<any>('http://localhost:3000/login', { email,
        password: password, tool_consumer_instance_guid: 'moodle.hs-mannheim.de' })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        this.cookieService.delete('token');
    }
    register(user: User) {
        return this.http.post(`http://localhost:3000/register`, user);
    }
}
export interface User {
    first_name: String;
    last_name: String;
    moodle_id: Number;
    email: String;
    password: String;
}
