import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { JWT_NAME } from '../../constants/jwt-name.constant';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private _authService: AuthenticationService,
  ) { }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = localStorage.getItem(JWT_NAME);

    if (accessToken) {
      request = this._addToken(request, accessToken);
    }

    return next.handle(request)
      .pipe(
        catchError((error) => {
          if (error.status === 401 && accessToken) {
            return this._handleTokenExpired(request, next);
          }
          return throwError(() => new Error('Error'));
        })
      );
  }

  private _addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private _handleTokenExpired(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return of(this._authService.logout())
      .pipe(
        switchMap(() => {
          const newAccessToken = localStorage.getItem(JWT_NAME);
          return next.handle(this._addToken(request, newAccessToken!));
        }),
        catchError((error) => {
          return throwError(() => new Error('Error handling expired access token'));
        })
      );
  }

}