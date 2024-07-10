import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatBadge } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [
        MatIconModule,
        MatMenu,
        MatMenuModule,
        MatBadge,
        NgIf,
        MatTooltip,
        MatToolbar,
    ],
})
export class HeaderComponent implements OnInit, OnDestroy {

    @Input() public title: string | undefined;
    @Input() public logotypeUrl: string | undefined;

    public userName: string | undefined;
    public inProcess: boolean | undefined;

    private _destroy$ = new Subject<boolean>();

    constructor(
        private _authService: AuthenticationService,
        private _userService: UserService,
    ) {
        this._watchForUserChanges();
    }

    public ngOnInit(): void { }

    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }

    public onLogout(): void {
        this._authService.logout();
    }

    private _watchForUserChanges() {
        combineLatest([this._authService.isAuth$, this._userService.getUser()])
            .pipe(
                takeUntil(this._destroy$))
            .subscribe(([isAuth, user]) => {
                this._initUserData(isAuth, user);
            });
    }

    private _initUserData(isAuth: boolean, user: any): void {
        this.userName = isAuth ? user.email : undefined;

    }
}
