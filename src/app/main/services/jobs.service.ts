import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Job} from "../models/job.model";

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  private url = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {
  }

  getJobs$(typeId: number = null, categoryId: number = null): Observable<Job[]> {
    let finalUrl = `${this.url}?_expand=jobType&_expand=jobCategory&_expand=user&_embed=likes&_embed=applications`;

    if (typeId != null)
      finalUrl = finalUrl + `&jobTypeId=${typeId}`

    if (categoryId != null)
      finalUrl = finalUrl + `&jobCategoryId=${categoryId}`

    return this.http.get<Job[]>(finalUrl);
  }

  getJob$(id: number): Observable<Job> {
    const url = `${this.url}/${id}?_expand=user&_expand=jobCategory&_expand=jobType&_embed=likes&_embed=applications`;

    return this.http.get<Job>(url);
  }

  postJob$(job: Job): Observable<Job> {
    return this.http.post<Job>(this.url, job);
  }

  updateJob$(job: Job): Observable<Job> {
    const url = `${this.url}/${job.id}`;

    return this.http.put<Job>(url, job);
  }

  deleteBook$(id: number): Observable<void> {
    const url = `${this.url}/${id}`;

    return this.http.delete<void>(url);
  }
}
