import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>('http://localhost:3000/login', { user_id: username,
        password: password, tool_consumer_instance_guid: 'moodle.hs-mannheim.de' })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
    register(user: User) {
        return this.http.post(`http://localhost:3000/user`, user);
    }
}
export interface User {
    first_name: String;
    last_name: String;
    moodle_id: Number;
    email: String;
    password: String;
}
