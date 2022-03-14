import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Job} from "../models/job.model";
import {Like} from "../models/like.model";
import {Application} from "../models/application.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  private url = `${environment.apiUrl}/likes`;

  constructor(private http: HttpClient) {
  }

  getLikesByJob$(jobId: number): Observable<Like[]> {
    let finalUrl = `${this.url}?jobId=${jobId}`;

    return this.http.get<Like[]>(finalUrl);
  }

  getLike$(userId: number, jobId: number): Observable<Like | null> {
    const url = `${this.url}?userId=${userId}&jobId=${jobId}`

    return this.http.get<Like[]>(url).pipe(
      map((response) => {
        console.log(JSON.stringify(response))
        const like = response?.find(l => l?.userId === userId && l?.jobId === jobId);

        if (like){
          return like;
        }else{
          return null;
        }

      })
    );
  }

  postLike$(like: Like): Observable<Like> {
    return this.http.post<Like>(this.url, like);
  }

  putLike$(like: Like): Observable<Like> {
    const url = `${this.url}/${like.id}`;

    return this.http.put<Like>(url, like);
  }

  deleteLike$(id: number): Observable<void> {
    const url = `${this.url}/${id}`;

    return this.http.delete<void>(url);
  }
}
