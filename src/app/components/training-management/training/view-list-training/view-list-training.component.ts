import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Training } from '../../../../training';
//import { MockTraining } from 'src/app/mock-teacher';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { RequestApiService } from 'src/app/services/request-api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-list-training',
  templateUrl: './view-list-training.component.html',
  styleUrls: ['./view-list-training.component.css'],
})
export class ViewListTrainingComponent implements OnInit {
  dataTraining: Training[] = [];
  constructor(
    public dialog: MatDialog,
    private requestApiService: RequestApiService,
    private autService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.autService.decodeToken();
    if (token.data.role > 1) {
      this.router.navigate(['/dashboard']);
    }
    this.getData();
  }

  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.dataSource.paginator = this.paginatior;
    this.dataSource.sort = this.sort;
  }

  // displayedColumns: string[] = ['codeProfile', 'fullname', 'sex', 'dateOfBirth', 'phoneNumber', 'email', 'position', 'exp', 'skill', 'education', 'languageSkill'];
  displayedColumns: string[] = [
    'trainingId',
    'name',
    'time',
    'location',
    'trainer',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<Training>(this.dataTraining);

  getData() {
    this.requestApiService.getDataTraining().subscribe(
      (value) => {
        console.log(value);
        this.dataSource.data = value;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  approval(approval: string, ID: number, index: number) {
    const data = {
      ID: ID,
      approval: approval,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);

    const formData: FormData = new FormData();
    formData.append('approval', toJson);
    this.requestApiService.insertDataParticipate(formData).subscribe(
      (value) => {
        console.log(value);
        if (value) {
          if (this.paginatior.pageIndex > 0) {
            const pos =
              this.paginatior.pageSize * this.paginatior.pageIndex + index;
            console.log(pos);
            this.dataSource.data[pos].status = approval;
          } else {
            console.log(index);
            this.dataSource.data[index].status = approval;
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  openDialogRegistration(): void {
    const dialogRef = this.dialog.open(DialogRegistration, {
      width: '50%',
    });
  }
  openDialogDetail(ID: number, index: number): void {
    console.log(ID);
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataTrainingByID(ID).subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(DialogDetailTraining, dialogConfig);
      // dialogRef.afterClosed().subscribe(result => {
      //   console.log(result.data);
      //   if(this.paginatior.pageIndex >0){
      //     const pos = (this.paginatior.pageSize * this.paginatior.pageIndex) + index ;
      //     console.log(pos);
      //     this.dataSource.data[pos].mission = result.data;
      //     }else{
      //       console.log(index);
      //       this.dataSource.data[index].mission = result.data;
      //     }
      // });
    });
  }
}

@Component({
  selector: 'dialog-registration',
  templateUrl: './dialog-registration.component.html',
  styleUrls: ['./view-list-training.component.css'],
})
export class DialogRegistration {}

@Component({
  selector: 'dialog-detailTraining',
  templateUrl: './dialog-detailTraining.component.html',
  styleUrls: ['./view-list-training.component.css'],
})
export class DialogDetailTraining {
  constructor(
    public dialogRef: MatDialogRef<DialogDetailTraining>,
    @Inject(MAT_DIALOG_DATA) public data: Training,
    private requestApiService: RequestApiService
  ) {}
  time = {
    start: this.data.time.split(' - ')[0],
    end: this.data.time.split(' - ')[1],
  };
  range = new FormGroup({
    start: new FormControl(this.time.start),
    end: new FormControl(this.time.end),
  });

  onSubmit(
    id_training: string,
    name: string,
    start: string,
    end: string,
    location: string,
    trainers: string,
    content: string
  ) {}
}
