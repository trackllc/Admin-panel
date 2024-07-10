import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { JWT_NAME } from '../../constants/jwt-name.constant';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private _isBrowser: boolean;

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
    ) {
        this._isBrowser = isPlatformBrowser(platformId);
    }

    public setToken(token: string): void {
        this._isBrowser && localStorage.setItem(JWT_NAME, token)
    }

    public removeToken(): void {
        this._isBrowser && localStorage.removeItem(JWT_NAME)
    }

    public getToken(): string | null {
        return this._isBrowser ? localStorage.getItem(JWT_NAME) : '';
    }

    public isToken(): boolean {
        return !!this.getToken();
    }
}


