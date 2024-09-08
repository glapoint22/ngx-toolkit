import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http: HttpClient = inject(HttpClient);
  private readonly retryAttempts = 3;
  private readonly retryDelay = 2000;
  private retryConfig = {
    delay: (error: HttpErrorResponse, retryCount: number) => {
      if (retryCount < this.retryAttempts) {
        return timer(this.retryDelay);
      } else {
        return throwError(() => error);
      }
    }
  }




  public get<T>(url: string, params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> }): Observable<T> {
    return this.http.get<T>(url, { params }).pipe(
      retry(this.retryConfig),
      catchError(this.handleError)
    );
  }




  public post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body).pipe(
      retry(this.retryConfig),
      catchError(this.handleError)
    );
  }




  public put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body).pipe(
      retry(this.retryConfig),
      catchError(this.handleError)
    );
  }




  public delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url).pipe(
      retry(this.retryConfig),
      catchError(this.handleError)
    );
  }




  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message));
  }
}