import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Login } from '../models/login.model';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import {Register} from "../models/register.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private client: HttpClient) {
  }

  login$(data: Login): Observable<User | null> {
    console.log('login')
    return this.client.get<User[]>(`${environment.apiUrl}/users`).pipe(
      map((response: User[]) => {
        const user = response.find(u => u.email === data.email && u.password === data.password);

        if (user)
          return user;
        else
          return null;
      })
    );
  }

  register$(user: User): Observable<User> {
    return this.client.post<User>(`${environment.apiUrl}/users`, user);
  }

  logout(): void {
    console.log('logout')
    localStorage.removeItem('loggedUser');
  }

  getUserByEmail$(email: String): Observable<User | null> {
    return this.client.get<User[]>(`${environment.apiUrl}/users`).pipe(
      map((response: User[]) => {
        const user = response.find(u => u.email === email);

        if (user)
          return user;
        else
          return null;
      })
    );
  }

  storeUserData(user: User): void {
    console.log('storeUserData')
    delete user.password;
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }

  getUserFromStorage(): User {
    return JSON.parse(localStorage.getItem('loggedUser') || '{}');
  }
}
