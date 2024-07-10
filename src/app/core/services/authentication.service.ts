import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { map, switchMap, tap } from "rxjs/operators";
import { BehaviorSubject, Observable, of } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClientService } from './http-client.service';
import { LoginForm } from '../interfaces/login-form.interface';
import { JWT_NAME } from '../../constants/jwt-name.constant';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

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
        const formData = new FormData();
        formData.append('email', loginForm.email);
        formData.append('password', loginForm.password);
        return this._http.post<any>('https://api.track.bstrv.ru/v1/auth', formData)
            .pipe(
                map((obj) => {
                    this._tokenService.setToken(obj.data.access);
                    return obj.data.access;
                })
            );
    }

    public logout() {
        this._tokenService.removeToken();
        window.location.reload();
    }

    public isAuthenticated(): boolean {
        return !this._jwtHelper.isTokenExpired(this._tokenService.getToken());
    }

}