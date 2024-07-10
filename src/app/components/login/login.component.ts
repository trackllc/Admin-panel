import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

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
            email: new FormControl('test@mail.kz', [Validators.required, Validators.email, Validators.minLength(6)]),
            password: new FormControl('Password1', [Validators.required, Validators.minLength(3)])
        })
    }

    public onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }
        this._authService.login(this.loginForm.value)
            .pipe(
                map(token => token && this._router.navigate(['board']))

            ).subscribe();
    }

}