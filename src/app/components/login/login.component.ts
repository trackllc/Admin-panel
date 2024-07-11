import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { throwError } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatCardModule,
        MatButtonModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public loginForm: FormGroup;
    public isShow = false;
    public logoUrl = './assets/img/logo.svg';

    constructor(
        private _authService: AuthenticationService,
        private _router: Router
    ) {
        this.isShow = !this._authService.isAuthenticated();
    }

    public ngOnInit(): void {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(6)]),
            password: new FormControl('', [Validators.required, Validators.minLength(3)])
        })
    }

    public onSubmit() {
        if (this.loginForm.invalid) return;
        this._authService.login(this.loginForm.value)
            .pipe(
                tap(token => token && this._router.navigate(['board'])),
                catchError((error: any) => {
                    error.error.description.includes("Password") && this.loginForm.controls['password'].setErrors({ 'passwordError': true });
                    error.error.description.includes("E-mail") && this.loginForm.controls['email'].setErrors({ 'emailError': true });
                    return throwError(() => error);
                })

            ).subscribe();
    }

}