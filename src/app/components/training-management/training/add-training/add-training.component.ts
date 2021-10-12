import { leadingComment } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RequestApiService } from 'src/app/services/request-api.service';

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.css'],
})
export class AddTrainingComponent implements OnInit {
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
  id_training_temp: string = 'DT1';
  ngOnInit(): void {
    const token = this.autService.decodeToken();
    if (token.data.role > 1) {
      this.router.navigate(['/dashboard']);
    }
    this.requestApiService.getDataTraining().subscribe((value) => {
      this.id_training_temp = 'DT' + (parseInt(value[0].ID) + 1);
    });
  }

  onSubmit(
    id_training: string,
    name: string,
    start: string,
    end: string,
    location: string,
    trainers: string,
    content: string
  ) {
    const data = {
      id_training: id_training,
      name: name,
      time: start + ' - ' + end,
      location: location,
      trainers: trainers,
      content: content,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);

    const formData: FormData = new FormData();
    formData.append('training', toJson);
    this.requestApiService.insertDataTraining(formData).subscribe(
      (value) => {
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
