import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginComponent } from '../components/users/login/login.component';
import { User } from '../user';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = 'http://localhost:8080/hrm/HRM-BE/token/signIn';
  private apiChange = 'http://localhost:8080/hrm/HRM-BE/token/changePass';
  public userLogin = new BehaviorSubject('');
  currentUser = this.userLogin.asObservable();
  // private loggedUserSubject: BehaviorSubject<User>;
  // public loggedInUser: Observable<any>;
  // public getLoggedUser = JSON.parse(localStorage.getItem('loggedInUser') || '');
  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) {
    // this.loggedUserSubject = new BehaviorSubject(this.getLoggedUser);
    // this.loggedInUser = this.loggedUserSubject.asObservable();
  }

  //#region

  public setToken(token: string) {
    localStorage.setItem('token', token);
  }

  // public removeToken() {
  //   localStorage.removeItem('token');
  // }
  public decodeToken() {
    const helper = new JwtHelperService();
    const decodeJwt = helper.decodeToken(this.getToken() || '');
    return decodeJwt;
  }

  public getToken() {
    return localStorage.getItem('token');
  }
  public getRole() {
    const token = this.decodeToken();
    if (token.data.role > 1) {
      this.router.navigate(['/dashboard']);
    }
  }
  // public isLoggedIn(): boolean {
  //   return this.getToken() !== null;
  // }

  // public logout() {
  //   this.removeToken();
  //   this.router.navigate(['/']);
  // }

  // public login(backUrl: string): void {
  //   this.openDialog(backUrl);
  // }

  // private openDialog(backUrl: string): void {
  //   const dialogRef = this.dialog.open(LoginComponent, {
  //     width: '100%',
  //     data: { username: '', password: '' },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log('AuthService: afterClosed', result);
  //     const username = result?.data?.username;
  //     const password = result?.data?.password;
  //     if (!!username && !!password) {
  //       this.authLogin(username, password).subscribe(
  //         (token) => {
  //           console.log('AuthService: login, token = ', token, backUrl);
  //           localStorage.setItem('token', token);
  //           this.router.navigate([backUrl]);
  //         },
  //         (error) => {
  //           console.log('AuthService: failed', error);
  //         }
  //       );
  //     } else {
  //       this.openDialog(backUrl);
  //     }
  //   });
  // }
  // public authLogin(username: string, password: string): Observable<any> {
  //   console.log('AuthService: authLogin: ', username, password);
  //   const data = {
  //     userName: username,
  //     passWord: password
  //   }
  //   const toJson = JSON.stringify(data);
  //   const formData: FormData = new FormData();
  //   formData.append('login', toJson);
  //   const httpParams = new HttpParams();
  //   // const payload = { username, password };
  //   return this.http.post(this.api, formData).pipe(map( (data => {
  //     console.log('DataService: login', data);
  //   })
  //   ))
  //   // return (
  //   //   this.http
  //   //     .post(this.api, formData)
  //   //     // .pipe(delay(3000))
  //   //     .pipe( map(data => {
  //   //       console.log('DataService: login', data);
  //   //       return data;
  //   //     }))
  //   //     // .pipe(catchError(this.handleError))
  //   // );
  // }

  // handleError(error: HttpErrorResponse): Observable<any> {
  //   let errorMessage = 'Unknown error!';
  //   if (error.error instanceof ErrorEvent) {
  //     // Client-side errors
  //     errorMessage = `Error: ${error.error.message}`;
  //   } else {
  //     // Server-side errors
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   // window.alert(errorMessage);
  //   console.log('Error', errorMessage);
  //   return throwError(errorMessage);
  // }
  //#endregion

  loginUser(userName: string, passWord: string) {
    const data = {
      userName: userName,
      passWord: passWord,
    };
    const toJson = JSON.stringify(data);
    const formData: FormData = new FormData();
    formData.append('login', toJson);
    return this.http.post<any>(this.api, formData).pipe(
      map((response) => {
        // localStorage.setItem('loggedInUser', JSON.stringify(response));
        // this.loggedUserSubject.next(response);
        this.router.navigate(['/dashboard']);
        console.log(response);
        return response;
      })
    );
  }

  changePass(passWord: string, newPassWord: string, id_user: string) {
    const data = {
      passWord: passWord,
      newPassWord: newPassWord,
      id_user: id_user,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);

    const formData: FormData = new FormData();
    formData.append('change', toJson);
    return this.http.post<any>(this.apiChange, formData).pipe(
      map((response) => {
        // localStorage.setItem('loggedInUser', JSON.stringify(response));
        // this.loggedUserSubject.next(response);
        // this.router.navigate(['/dashboard']);
        console.log(response);
        return response;
      })
    );
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
    // this.loggedUserSubject.next(null);
  }
  // public get loggedInUserValue(){
  //   return this.loggedUserSubject.value;
  // }
}

// export interface user {
//   id_user: string,
//   fullName: string,
//   token: string
// }
