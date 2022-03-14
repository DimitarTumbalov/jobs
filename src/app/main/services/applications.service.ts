import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Application} from "../models/application.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  private url = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {
  }

  getApplications$(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.url}?_expand=user`);
  }

  // getApplicationsByUserId$(userId: number = null): Observable<Application[]> {
  //   return this.http.get<Application[]>(`${this.url}?userId=${userId}`);
  // }
  //
  // getApplicationsByJobId$(jobId: number = null): Observable<Application[]> {
  //   return this.http.get<Application[]>(`${this.url}?jobId=${jobId}`);
  // }

  getApplication$(jobId: number, userId: number): Observable<Application | null> {
    const url = `${this.url}?jobId=${jobId}&userId=${userId}&_expand=user`

    return this.http.get<Application []>(url).pipe(
      map((response) => {
        const application = response.find(a => a?.jobId == jobId && a?.userId === userId);

        if (application)
          return application;
        else
          return null;
      })
    );
  }

  postApplication$(application: Application): Observable<Application> {
    return this.http.post<Application>(this.url, application);
  }

  putApplication$(application: Application): Observable<Application> {
    const url = `${this.url}/${application.id}`;

    return this.http.put<Application>(url, application);
  }

  deleteApplication$(id: number): Observable<void> {
    const url = `${this.url}/${id}`;

    return this.http.delete<void>(url);
  }
}
