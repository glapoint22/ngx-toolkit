import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authEventSubject = new Subject<void>();
  private token: string | null = null;

  public get authEvent$() {
    return this.authEventSubject.asObservable();
  }

  public getToken(): string | null {
    const token = this.token || localStorage.getItem('token');
  
    if (token && !this.isTokenExpired(token)) {
      this.token = token;
      return this.token;
    }
  
    return null;
  }


  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }




  public clearToken(): void {
    localStorage.removeItem('token');
  }


  private isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    } catch (e) {
      console.error('Error parsing token:', e);
      return true; // Assume the token is expired if it can't be parsed
    }
  }

  public triggerAuthEvent() {
    this.authEventSubject.next();
  }
}