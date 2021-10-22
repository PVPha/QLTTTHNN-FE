import { ViewChild, Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { elementAt, map, startWith } from 'rxjs/operators';
import { CandidateProfile } from 'src/app/candidate-profile';

import { AuthService } from 'src/app/services/auth.service';
// import { MockCandidateProfile } from 'src/app/mock-candidate-profile';
import { RequestApiService } from 'src/app/services/request-api.service';

@Component({
  selector: 'app-view-candidate-profiles',
  templateUrl: './view-candidate-profiles.component.html',
  styleUrls: ['./view-candidate-profiles.component.css'],
})
export class ViewCandidateProfilesComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private requestApiService: RequestApiService,
    private autService: AuthService,
    private router: Router
  ) {}

  cadidateProfile: CandidateProfile[] = [];
  candidateProfileByID!: CandidateProfile;
  pageIndex: number = 1;
  pageSize: number = 1;

  // displayedColumns: string[] = ['codeProfile', 'fullname', 'sex', 'dateOfBirth', 'phoneNumber', 'email', 'position', 'exp', 'skill', 'education', 'languageSkill'];
  displayedColumns: string[] = [
    'id_candidate',
    'fullName',
    'sex',
    'phoneNumber',
    'email',
    'position',
    // 'status',
    // 'action',
  ];
  dataSource = new MatTableDataSource<CandidateProfile>(this.cadidateProfile);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const token = this.autService.decodeToken();
    if (token.data.role > 1) {
      this.router.navigate(['/dashboard']);
    }
    this.getData();
  }

  getPageIndex(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.dataSource.paginator = this.paginatior;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  animal: string = '';
  name: string = '';

  getData() {
    this.requestApiService.getDataCandidate().subscribe(
      (value) => {
        this.dataSource.data = value;
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  showIndex(pageIndex: number, index: number, pageSize: number) {
    // if(pageIndex == 1){
    //   console.log('pageIndex = ' + pageIndex);
    // console.log('Index = ' + index);
    // console.log('pageSize = ' + pageSize);
    // }
    console.log(this.paginatior.pageIndex);
    console.log(this.paginatior.pageSize);

    // console.log('pageIndex = ' + pageIndex);
    // console.log('Index = ' + index);
    // console.log('pageSize = ' + pageSize);
  }

  openDialogInterviewSchedule(
    ID: number,
    pageIndex: number,
    index: number,
    pageSize: number
  ): void {
    console.log('index' + index + ' pageindex' + pageIndex);
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataCandidateByID(ID).subscribe((value) => {
      console.log(value);
      dialogConfig.data = value[0];
      dialogConfig.width = '30%';
      const dialogRef = this.dialog.open(DialogInterviewSchedule, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        if (this.paginatior.pageIndex > 0) {
          const pos =
            this.paginatior.pageSize * this.paginatior.pageIndex + index;
          console.log(pos);
          console.log(result.data);
          this.dataSource.data[pos].status = result.data;
        } else {
          console.log(index);
          this.dataSource.data[index].status = result.data;
        }
      });

      // dialogRef.afterClosed().subscribe(result =>{

      // })
    });
  }

  openDialogDetailProfile(
    ID: number,
    pageIndex: number,
    index: number,
    pageSize: number
  ): void {
    console.log('index' + index + ' pageindex' + pageIndex);
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataCandidateByID(ID).subscribe((value) => {
      console.log(value);
      // console.log(value[0].id_candidate);
      const key = Object.keys(value[0]);
      const values = Object.values(value[0]);
      const count = key.length;

      // console.log(count);
      // for (let i = 14; i <= count; i++){
      //   dialogConfig.data = value[0];
      // };
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      // const dialogRef = this.dialog.open(DialogDetailCandidateProfile,  {
      //   width: '100%',
      //   data: {id_candidate: value.id_candidate}
      // });
      const dialogRef = this.dialog.open(
        DialogDetailCandidateProfile,
        dialogConfig
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (this.paginatior.pageIndex > 0) {
          const pos =
            this.paginatior.pageSize * this.paginatior.pageIndex + index;
          console.log(pos);
          this.dataSource.data[pos].status = result.data;
        } else {
          console.log(index);
          this.dataSource.data[index].status = result.data;
        }
      });
    });
  }

  openDialogHiringDecision(
    ID: number,
    pageIndex: number,
    index: number,
    pageSize: number
  ): void {
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataCandidateByID(ID).subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '90%';
      const dialogRef = this.dialog.open(DialogHiringDecision, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        if (this.paginatior.pageIndex > 0) {
          const pos =
            this.paginatior.pageSize * this.paginatior.pageIndex + index;
          console.log(result.data);
          this.dataSource.data[pos].status = result.data;
        } else {
          console.log(index);
          console.log(result.data);
          this.dataSource.data[index].status = result.data;
        }
      });
    });
  }
}

// https://stackoverflow.com/questions/51815455/how-to-pass-data-from-angular-material-dialog-to-parent-component
@Component({
  selector: 'dialog-interview-schedule',
  templateUrl: './dialog-interview-schedule.component.html',
  styleUrls: ['./view-candidate-profiles.component.css'],
})
export class DialogInterviewSchedule {
  forms: FormInterview[] = [{ form: 'online' }, { form: 'offline' }];
  interviewers: Interviewer[] = [
    { id_staff: '001', position: 'Trưởng phòng nhân sự', name: 'Nguyễn Văn A' },
    { id_staff: '002', position: 'Team leader', name: 'Phạm Văn Pha' },
  ];

  local_data: any;
  constructor(
    public dialogRef: MatDialogRef<DialogInterviewSchedule>,
    @Inject(MAT_DIALOG_DATA) public data: CandidateProfile,
    private requestApiService: RequestApiService
  ) {
    this.local_data = { ...data };
  }

  onNoClick(): void {}

  onSubmit(
    ID: string,
    id_candidate: string,
    fullName: string,
    time: string,
    location: string,
    form: string,
    noteSchedule: string,
    interviewer: string
  ) {
    const data = {
      ID: ID,
      id_candidate: id_candidate,
      fullName: fullName,
      time: time,
      location: location,
      form: form,
      noteSchedule: noteSchedule,
      interviewer: interviewer,
    };
    const toJson = JSON.stringify(data);
    // console.log(toJson);

    const formData: FormData = new FormData();

    formData.append('schedule', toJson);

    this.requestApiService.insertDataSchedule(formData).subscribe(
      (value) => {
        console.log(value);
        if (value) {
          this.dialogRef.close({ data: 'phỏng vấn' });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
export interface DialogData {
  time: string;
  location: string;
  note: string;
  form: string;
  status: string;
  interviewer: string;
}
export interface FormInterview {
  form: string;
}
export interface Interviewer {
  id_staff: string;
  position: string;
  name: string;
}

@Component({
  selector: 'dialog-detail-candidate-profile',
  templateUrl: './dialog-detail-candidate-profile.component.html',
  styleUrls: ['./view-candidate-profiles.component.css'],
})
export class DialogDetailCandidateProfile {
  isLinear: boolean = false;
  approval: string = '';
  constructor(
    public dialogRef: MatDialogRef<DialogDetailCandidateProfile>,
    @Inject(MAT_DIALOG_DATA) public data: CandidateProfile,
    private requestApiService: RequestApiService
  ) {}

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }
  onSubmit(
    ID: string,
    id_candidate: string,
    expertise: string,
    evaluate: string,
    noteInterview: string
  ) {
    const data = {
      ID: ID,
      id_candidate: id_candidate,
      expertise: expertise,
      evaluate: evaluate,
      noteInterview: noteInterview,
      approval: this.approval,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);

    const formData: FormData = new FormData();
    formData.append('point', toJson);
    this.requestApiService.insertDataPoint(formData).subscribe(
      (value) => {
        console.log(value);
        if (value) {
          this.dialogRef.close({ data: this.approval });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

@Component({
  selector: 'dialog-hiring-decision',
  templateUrl: './dialog-hiring-decision.component.html',
  styleUrls: ['./view-candidate-profiles.component.css'],
})
export class DialogHiringDecision implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogHiringDecision>,
    @Inject(MAT_DIALOG_DATA) public data: CandidateProfile,
    private requestApiService: RequestApiService
  ) {}

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  salary_temp: number = 0;
  myControl = new FormControl();
  options: string[] = ['IT', 'Marketing', 'Sale'];
  filteredOptions: Observable<string[]> | undefined;
  id_decision_temp: string = 'QD1';
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    this.requestApiService.decisionCandidate('Hiring').subscribe((value) => {
      console.log(value);
      this.id_decision_temp = 'QD' + (parseInt(value[0].ID) + 1);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onSubmit(
    ID: string,
    id_dicision: string,
    id_candidate: string,
    id_staff: string,
    fullName: string,
    position: string,
    department: string,
    time: string,
    start: string,
    end: string,
    salary: string
  ) {
    console.log(
      id_dicision,
      id_staff,
      fullName,
      position,
      department,
      JSON.stringify(time),
      salary
    );
    time = JSON.stringify(time);
    const data = {
      ID: ID,
      id_dicision: id_dicision,
      id_candidate: id_candidate,
      id_staff: id_staff,
      fullName: fullName,
      position: position,
      department: department,
      time: time,
      start: start,
      end: end,
      salary: salary,
    };
    const toJson = JSON.stringify(data);
    const formData: FormData = new FormData();
    formData.append('hiring', toJson);
    console.log(toJson);

    this.requestApiService.insertDataHiring(formData).subscribe(
      (value) => {
        if (value) {
          this.dialogRef.close({ data: 'tuyển dụng' });
        }
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
