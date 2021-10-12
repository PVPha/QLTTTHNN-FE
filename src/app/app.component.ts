import { Component, Inject, Input, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RequestApiService } from './services/request-api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'HRM-FE';
  user: any;
  // @ViewChild(AuthService) child: any;
  constructor(private authService: AuthService, public dialog: MatDialog) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const token = this.authService.decodeToken();
    this.authService.currentUser.subscribe((user) => (this.user = user));
    this.user = localStorage.getItem('user');
  }
  openDialogChangePass(): void {
    const dialogRef = this.dialog.open(DialogChangePass, {
      width: '70%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      alert(result.data);
    });
  }
  // ngAfterViewInit(): void {
  //   //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //   //Add 'implements AfterViewInit' to the class.
  //   const token = this.child.decodeToken();
  //   console.log(token.data);
  // }
  // userLogin(user: any){
  //   // const token = this.authService.getToken();
  //   // const helper = new JwtHelperService();
  //   // const decodeJwt = helper.decodeToken(token || '');
  //   // console.log(decodeJwt);
  //   this.user = user;
  //   console.log(user);

  // }
  logout() {
    this.user = '';
    this.authService.logoutUser();
  }
}

@Component({
  selector: 'dialog-detailTraining',
  templateUrl: './components/users/login/dialog-changePass.component.html',
  styleUrls: ['./components/users/login/login.component.css'],
})
export class DialogChangePass {
  data: any;
  user = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required]),
  });
  constructor(
    public dialogRef: MatDialogRef<DialogChangePass>,
    private requestApiService: RequestApiService,
    private autService: AuthService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const token = this.autService.decodeToken();
    this.data = token.data;
    console.log(this.data);
  }
  error: string = '';
  login(passWord: string, newPassWord: string) {
    if (passWord !== '' && newPassWord !== '') {
      console.log(this.data);

      this.autService.changePass(passWord, newPassWord, this.data.id).subscribe(
        (data) => {
          console.log(data);
          // if (data != 'error') {
          //   this.autService.setToken(data.token);
          //   const token = this.autService.decodeToken();
          //   this.autService.userLogin.next(token.data.fullName);
          //   localStorage.setItem('user', token.data.fullName);
          //   console.log(token.data);
          this.dialogRef.close({
            data: data,
          });
          // }
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.error = 'vui lòng nhập đủ thông tin đăng nhập';
    }
  }
}
