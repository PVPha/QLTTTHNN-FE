import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
export interface DialogData {
  username: string;
  password: string;
  token: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Output() userLogin: EventEmitter<any> = new EventEmitter();
  userName: string = '';
  passWord: string = '';
  constructor(
    private authService: AuthService // public dialogRef: MatDialogRef<LoginComponent>, // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}

  //validator

  user = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  errUsername() {
    if (this.user.value.username.hasError('required')) {
      return 'vui lòng nhập tên đăng nhập';
    }
    return 'vui lòng nhập tên đăng nhập';
    // return this.uesername.hasError('email') ? 'Not a valid email' : '';
  }

  errPassword() {
    if (this.user.value.password.hasError('required')) {
      return 'vui lòng nhập mật khẩu';
    }

    return 'vui lòng nhập mật khẩu';
  }

  error: string = '';
  login(userName: string, passWord: string) {
    console.log(userName, passWord);
    if (userName !== '' && passWord !== '') {
      this.authService.loginUser(userName, passWord).subscribe(
        (data) => {
          if (data != 'error') {
            this.authService.setToken(data.token);
            const token = this.authService.decodeToken();
            this.authService.userLogin.next(token.data.fullName);
            localStorage.setItem('user', token.data.fullName);
            console.log(token.data);
            this.userLogin.emit(token.data);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.error = 'vui lòng nhập đủ thông tin đăng nhập';
    }

    // const data = {
    //   userName: userName,
    //   passWord: passWord
    // }
    // const toJson = JSON.stringify(data);
    // const formData: FormData = new FormData();
    // formData.append('login', toJson);

    // this.authService.authLogin(userName, passWord).subscribe(data => {
    //   console.log('DialogLoginComponent: login, data = ', data);
    //       // if (Object.prototype.hasOwnProperty.call(data, 'error')) {
    //       //   console.log('loginComponent: login: error', data);
    //       // } else {
    //       //   this.data.token = data;
    //       //   console.log('DialogLoginComponent: this.data', this.data);
    //       //   this.dialogRef.close({ data: this.data });
    //       // }
    //       this.data.token = data;
    //         console.log('DialogLoginComponent: this.data', this.data);
    //         this.dialogRef.close({ data: this.data });
    //     },
    //     (error) => {
    //       console.log('AuthService: failed', error);
    //     }
    // )
  }
}
