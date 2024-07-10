import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private _authService: AuthenticationService,
        private _router: Router
    ) { }

    canActivate() {
        this._authService.isAuth$.next(this._authService.isAuthenticated());
        if(this._authService.isAuthenticated()) return true;
        this._router.navigate(['login']);
        this._authService.removeToken();
        return false;
    }
}