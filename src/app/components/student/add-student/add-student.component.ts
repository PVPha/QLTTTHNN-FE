import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RequestApiService } from 'src/app/services/request-api.service';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
})
export class AddStudentComponent implements OnInit {
  // id_recruit: string = '';
  // department: string = '';
  // position: string = '';
  // require: string = '';
  // describe: string = '';
  // amount: number = 0;
  // time: string = '';
  // location: string= '';
  // benefit: string = '';
  // approval: boolean = false;
  constructor(
    private requestApiService: RequestApiService,
    private autService: AuthService,
    private router: Router
  ) {}
  id_temp: string = 'HV01';
  ngOnInit(): void {
    // this.autService.getRole(' > 1');
    const token = this.autService.decodeToken();
    if (token.data.role > 1) {
      this.router.navigate(['/dashboard']);
    }
    this.requestApiService.getData('student/getData').subscribe((value) => {
      //this.dataSource.data = value;
      console.log(value);
      this.id_temp = 'HV0' + (parseInt(value[0].ID) + 1);
    });
  }
  respon: string = '';
  onSubmit(id_stu: string, name_stu: string, email: string, phone: string) {
    const newStudent = {
      id_stu: id_stu,
      name_stu: name_stu,
      email: email,
      phone: phone,
    };
    const toJson = JSON.stringify(newStudent);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('student', toJson);
    this.requestApiService.insert(formData, 'student/insertStudent').subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
