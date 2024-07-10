import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class PageGuard implements CanActivate {
    constructor(
        private _authService: AuthenticationService,
        private _router: Router
    ) { }

    canActivate() {
        if (this._authService.isAuthenticated()) this._router.navigate(['board']);
        return true;
    }
}