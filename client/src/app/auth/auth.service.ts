import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import Amplify, { Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';

@Injectable()
export class CognitoAuthService {

    public loggedIn: BehaviorSubject<boolean>;
    public userInfo: any;

    constructor(
        private router: Router
    ) {
        Amplify.configure(environment.amplify);
        this.loggedIn = new BehaviorSubject<boolean>(false);
    }

    public getToken(): Observable<any> {
        return from(Auth.currentSession()).pipe(
            map (session => {
                return session.getIdToken().getJwtToken();
            })
        );
    }

    /** signup */
    public signUp(email, password): Observable<any> {
        return from(Auth.signUp({
            username: email,
            password: password,
            attributes: {
                email: email
            }
        }));
    }

    /** confirm code */
    public confirmSignUp(email, code): Observable<any> {
        return from(Auth.confirmSignUp(email, code));
    }

    /** signin */
    public signIn(email, password): Observable<any> {
        return from(Auth.signIn(email, password))
            .pipe(
                tap(() => {
                    this.loggedIn.next(true);
                })
            );
    }

    /** get authenticat state */
    public isAuthenticated(): Observable<boolean> {
        return from(Auth.currentAuthenticatedUser())
            .pipe(
                map((result) => {
                    this.userInfo = result;

                    this.loggedIn.next(true);
                    return true;
                }),
                catchError(error => {
                    console.error(error);
                    this.loggedIn.next(false);
                    this.userInfo = null;
                    return of(false);
                }));
    }

    /** signout */
    public signOut() {
        from(Auth.signOut())
            .subscribe(
                () => {
                    this.loggedIn.next(false);
                    this.userInfo = null;
                    this.router.navigate(['/login']);
                },
                error => console.error(error)
            );
    }
}
