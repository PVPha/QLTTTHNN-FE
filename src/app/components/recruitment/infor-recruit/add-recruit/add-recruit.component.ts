import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RequestApiService } from 'src/app/services/request-api.service';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-add-recruit',
  templateUrl: './add-recruit.component.html',
  styleUrls: ['./add-recruit.component.css'],
})
export class AddRecruitComponent implements OnInit {
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

  ngOnInit(): void {
    // this.autService.getRole(' > 1');
    const token = this.autService.decodeToken();
    if (token.data.role > 1) {
      this.router.navigate(['/dashboard']);
    }
  }
  // onSubmit(){
  //   const newRecruitment = {
  //     id_recruit: this.id_recruit,
  //     department: this.department,
  //     position: this.position,
  //     require: this.require,
  //     describe: this.describe,
  //     amount: this.amount,
  //     time: this.time,
  //     location: this.location,
  //     benefit: this.benefit,
  //     approval: this.approval
  //   }
  // }
  respon: string = '';
  onSubmit(
    id_recruit: string,
    department: string,
    position: string,
    // require: string,
    // describe: string,
    amount: string,
    // time: string,
    // location: string,
    // benefit: string
  ) {
    const newRecruitment = {
      id_recruit: id_recruit,
      department: department,
      position: position,
      // require: require,
      // describe: describe,
      amount: amount,
      // time: time,
      // location: location,
      // benefit: benefit,
      approval: false,
    };
    const toJson = JSON.stringify(newRecruitment);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('recruitment', toJson);
    // formData.append('id_recruit', this.id_recruit);
    // formData.append('department', this.department);
    // formData.append('position', this.position);
    // formData.append('require', this.require);
    // formData.append('describe', this.describe);
    // formData.append('amount', this.amount);
    // formData.append('time', this.time);
    // formData.append('location', this.location);
    // formData.append('benefit', this.benefit);
    // formData.append('approval', this.approval);
    this.requestApiService.insertDataRecruitment(formData).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
