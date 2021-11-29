import { leadingComment } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RequestApiService } from 'src/app/services/request-api.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css'],
})
export class AddCourseComponent implements OnInit {
  @Output() test = new EventEmitter();
  constructor(
    private requestApiService: RequestApiService,
    private autService: AuthService,
    private router: Router
  ) {}

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  id_temp: string = 'KH01';
  ngOnInit(): void {
    const token = this.autService.decodeToken();
    if (token.data.role > 1) {
      this.router.navigate(['/dashboard']);
    }
    this.requestApiService.getData('course/getData').subscribe((value) => {
      this.id_temp = 'KH0' + (parseInt(value[0].ID) + 1);
    });
  }

  onSubmit(
    id_course: string,
    name_course: string,
    type_course: string,
    money: string,
    timeStart: string,
    timeEnd: string,
    description: string
  ) {
    const data = {
      id_cou: id_course,
      name_cou: name_course,
      type_cou: type_course,
      money: money,
      time: timeStart + ' - ' + timeEnd,
      time_start: timeStart,
      time_end: timeEnd,
      description: description,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);

    const formData: FormData = new FormData();
    formData.append('course', toJson);
    this.requestApiService.insert(formData, 'course/insertCourse').subscribe(
      (value) => {
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
