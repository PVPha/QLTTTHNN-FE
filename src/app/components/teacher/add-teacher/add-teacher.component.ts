import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RequestApiService } from 'src/app/services/request-api.service';
import { Teacher } from 'src/app/teacher';
@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css'],
})
export class AddTeacherComponent implements OnInit {
  img: string = '';
  constructor(
    private requestApiService: RequestApiService,
    private autService: AuthService,
    private router: Router
  ) {}
  id_temp: string = 'GV01';
  ngOnInit(): void {
    const token = this.autService.decodeToken();
    if (token.data.role > 1) {
      this.router.navigate(['/dashboard']);
    }
    this.requestApiService.getData('teacher/getData').subscribe((value) => {
      //this.dataSource.data = value;
      console.log(value);
      this.id_temp = 'GV0' + (parseInt(value[0].ID) + 1);
    });
  }

  file = new FormControl('');
  file_data: any;
  file_name: string = '';
  fileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      const imgOut = document.getElementById('imgOut');
      imgOut?.setAttribute('src', URL.createObjectURL(file));
      console.log('fileInfo', file.name, file.size, file.type);
      this.file_name = file.name;
      if (file.size / 1048576 <= 4) {
        let formData = new FormData();
        formData.append('file', file, file.name);
        this.file_data = formData;
      }
    }
  }

  onSubmit(
    id_tea: string,
    name_tea: string,
    type_tea: string,
    email: string,
    phone: string
  ) {
    const newTeacher = {
      id_tea: id_tea,
      name_tea: name_tea,
      type_tea: type_tea,
      email: email,
      phone: phone,
      image: this.file_name,
    };
    const toJson = JSON.stringify(newTeacher);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('teacher', toJson);

    this.requestApiService
      .insert(this.file_data, 'teacher/insertTeacher')
      .subscribe((res) => {
        console.log(res);
      });
    this.requestApiService.insert(formData, 'teacher/insertTeacher').subscribe(
      (value) => {
        console.log(value.ID);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
