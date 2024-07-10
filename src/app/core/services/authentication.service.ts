import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClientService } from './http-client.service';
import { LoginForm } from '../interfaces/login-form.interface';
import { JWT_NAME } from '../../constants/jwt-name.constant';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    public isAuth$ = new BehaviorSubject<boolean>(false);

    constructor(
        private _http: HttpClientService,
        private _jwtHelper: JwtHelperService,
        private _tokenService: TokenService,

    ) {
    }

    public login(loginForm: LoginForm) {
        return this._http.post<any>(`${environment.apiUri}v1/auth`, loginForm)
            .pipe(
                tap((obj) => {
                    this._tokenService.setToken(obj.data.access);
                    return obj.data.access;
                })
            );
    }
    public removeToken() {
        this._tokenService.removeToken();
    }

    public logout() {
        this.removeToken();
        window.location.reload();
    }

    public isAuthenticated(): boolean {
        return !this._jwtHelper.isTokenExpired(this._tokenService.getToken());
    }

}