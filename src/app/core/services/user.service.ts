import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private userSubject = new BehaviorSubject<any | null>(null);

    constructor(
        private _tokenService: TokenService,
        private _jwtHelper: JwtHelperService,
    ) {
       this.getUser().subscribe((data)=> console.log(data))
    }

    public getUser(): Observable<any> {
        return of(this._tokenService.isToken() && this._tokenService.getToken())
            .pipe(
                switchMap((jwt: any) => of(this._jwtHelper.decodeToken(jwt))
                    .pipe(
                        map((jwt: any) => jwt)
                    )
                ));
    }
}



