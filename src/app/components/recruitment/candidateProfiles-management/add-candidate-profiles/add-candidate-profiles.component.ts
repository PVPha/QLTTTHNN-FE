import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RequestApiService } from 'src/app/services/request-api.service';

@Component({
  selector: 'app-add-candidate-profiles',
  templateUrl: './add-candidate-profiles.component.html',
  styleUrls: ['./add-candidate-profiles.component.css'],
})
export class AddCandidateProfilesComponent implements OnInit {
  img: string = '';
  constructor(
    private requestApiService: RequestApiService,
    private autService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.autService.decodeToken();
    if (token.data.role > 1) {
      this.router.navigate(['/dashboard']);
    }
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
    id_candidate: string,
    fullName: string,
    sex: string,
    dateOfBirth: string,
    phoneNumber: string,
    email: string,
    address: string,
    position: string,
    exp: string,
    skill: string,
    education: string,
    languageSkill: string
  ) {
    const newCandidate = {
      id_candidate: id_candidate,
      fullName: fullName,
      sex: sex,
      dateOfBirth: dateOfBirth,
      phoneNumber: phoneNumber,
      email: email,
      address: address,
      position: position,
      exp: exp,
      skill: skill,
      education: education,
      languageSkill: languageSkill,
      status: 'chờ',
      image: this.file_name,
    };
    const toJson = JSON.stringify(newCandidate);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('candidate', toJson);

    this.requestApiService
      .uploadFileCandidate(this.file_data)
      .subscribe((res) => {
        console.log(res);
      });
    this.requestApiService.insertDataCandidate(formData).subscribe(
      (value) => {
        console.log(value.ID);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
