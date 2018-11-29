import { Component, OnInit } from '@angular/core';
import { CognitoAuthService } from '../auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private auth: CognitoAuthService) { }

    public loginForm: FormGroup;

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.loginForm = this.fb.group({
            'email': ['', Validators.required],
            'password': ['', Validators.required]
        });
    }

    onSubmitLogin(value: any) {
        const email = value.email, password = value.password;
        this.auth.signIn(email, password)
            .subscribe(() => {
                    this.router.navigate(['/']);
                },
                error => {
                    console.log(error);
                });
    }
}
