import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Login} from '../models/login.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../models/user.model';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$: Observable<User>
  private currentUser: BehaviorSubject<User>

  private url = `${environment.apiUrl}/users`;

  constructor(private client: HttpClient) {
    this.currentUser = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser$ = this.currentUser.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUser.value;
  }

  login$(data: Login): Observable<User | null> {
    return this.client.get<User[]>(this.url).pipe(
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
    return this.client.post<User>(this.url, user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser.next(null);
  }

  getUser$(id: number): Observable<User> {
    return this.client.get<User>(`${this.url}/${id}`).pipe(
      map((response: User) => {

        if (response)
          return response;
        else
          return null;
      })
    );
  }

  updateUser$(user: User): Observable<User> {
    const url = `${this.url}/${user.id}`;

    return this.client.put<User>(url, user);
  }

  deleteUser$(id: number): Observable<void> {
    const url = `${this.url}/${id}`;

    return this.client.delete<void>(url);
  }

  getUserByEmail$(email: String): Observable<User | null> {
    return this.client.get<User[]>(this.url).pipe(
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
    delete user.password;
    localStorage.setItem('currentUser', JSON.stringify(user));

    this.currentUser.next(user);
  }
}
