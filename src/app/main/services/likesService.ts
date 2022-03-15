import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Like} from "../models/like.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  private url = `${environment.apiUrl}/likes`;

  constructor(private http: HttpClient) {
  }

  getLike$(userId: number, jobId: number): Observable<Like | null> {
    const url = `${this.url}?userId=${userId}&jobId=${jobId}`

    return this.http.get<Like[]>(url).pipe(
      map((response) => {
        const like = response?.find(l => l?.userId === userId && l?.jobId === jobId);

        if (like) {
          return like;
        } else {
          return null;
        }

      })
    );
  }

  postLike$(like: Like): Observable<Like> {
    return this.http.post<Like>(this.url, like);
  }

  deleteLike$(id: number): Observable<void> {
    const url = `${this.url}/${id}`;

    return this.http.delete<void>(url);
  }
}
