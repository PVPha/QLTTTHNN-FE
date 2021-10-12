import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfoRecruit } from 'src/app/info-recruit';
import { RequestApiService } from 'src/app/services/request-api.service';

@Component({
  selector: 'app-detail-recruit',
  templateUrl: './detail-recruit.component.html',
  styleUrls: ['./detail-recruit.component.css']
})
export class DetailRecruitComponent implements OnInit {
  recruit: InfoRecruit[] = [];
  html: string = '<h1>h1</h1>';

  constructor(
    private requestApiService: RequestApiService,
    private route: ActivatedRoute,
    // private location: Location
  ) { }

  ngOnInit(): void {
    this.getDataByID()
  }

  getDataByID(): void{

    const ID = parseInt(this.route.snapshot.paramMap.get('ID')!,10);
    this.requestApiService.getDataRecruitmentById(ID).subscribe(value => {
      this.recruit = value;
      console.log(value)
    }, err => {
      console.log(err);
    })
  }

  onSubmit(ID:number, id_recruit: string, department: string, position: string, require: string, describe: string, amount: string, time: string, location: string, benefit: string){
    const newRecruitment = {
            ID: ID,
            id_recruit: id_recruit,
            department: department,
            position: position,
            require: require,
            describe: describe,
            amount: amount,
            time: time,
            location: location,
            benefit: benefit,
          }
    const toJson = JSON.stringify(newRecruitment);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('recruitment', toJson)
    this.requestApiService.updateDataRecruitment(formData).subscribe(res => {
      console.log(res);
    },
    err => {
      console.log(err);
    });
    }
}
