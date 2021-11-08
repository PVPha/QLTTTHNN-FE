import { Component, Inject, OnInit, ViewChild } from '@angular/core';
//import { MockTraining } from 'src/app/mock-teacher';
import { MatTable, MatTableDataSource } from '@angular/material/table';
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
import { Course } from 'src/app/course';
import { MockCourse } from 'src/app/mock-course';
@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.css'],
})
export class ViewCourseComponent implements OnInit {
  dataCourse: Course[] = [];
  constructor(
    public dialog: MatDialog,
    private requestApiService: RequestApiService,
    private autService: AuthService,
    private router: Router
  ) {}
  @ViewChild(MatTable) table!: MatTable<Course>;
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
    'id_course',
    'name_course',
    'type_course',
    'money',
    'time',
    'action',
  ];
  dataSource = new MatTableDataSource<Course>(MockCourse);

  getData() {
    this.requestApiService.getData('course/getData').subscribe(
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

  openDialogUpdateCourse(ID: number, index: number): void {
    const dialogConfig = new MatDialogConfig();
    // console.log(MockViewStudent);

    this.requestApiService
      .getDataByID('course/getDataByID/' + ID)
      .subscribe((value) => {
        // dialogConfig.data = value[0];
        // dialogConfig.width = '100%';
        // const dialogRef = this.dialog.open(DialogRegisterCourse, dialogConfig);
        dialogConfig.data = value[0];
        dialogConfig.width = '60%';
        const dialogRef = this.dialog.open(DialogUpdateCourse, dialogConfig);

        dialogRef.afterClosed().subscribe((result) => {
          this.requestApiService.getData('course/getData').subscribe(
            (value) => {
              console.log(value);
              this.dataSource.data = value;
            },
            (err) => {
              console.log(err);
            }
          );
        });
      });
  }

  delete(ID: number, id_course: string, index: number) {
    const deleteRecruit = {
      ID: ID,
      id_course: id_course,
    };
    const toJson = JSON.stringify(deleteRecruit);
    const formData: FormData = new FormData();
    formData.append('course', toJson);
    const table = document.querySelector('table');
    const tr = table?.querySelectorAll('tr');
    // console.log(tr?.item(2));
    console.log(index);
    if (index == 0) {
      if (tr) tr.item(index + 1).className += ' demo-row-is-clicked';
      this.table.renderRows();
    } else {
      if (tr) tr.item(index + 1).className += ' demo-row-is-clicked';
      this.table.renderRows();
    }
    this.requestApiService.delete(formData, 'course/deleteCourse').subscribe(
      (value) => {
        // this.dataSource.data = value;
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

@Component({
  selector: 'dialog-update-course',
  templateUrl: './dialog-update-course.component.html',
  styleUrls: ['./view-course.component.css'],
})
export class DialogUpdateCourse {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  time: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<DialogUpdateCourse>,
    @Inject(MAT_DIALOG_DATA) public data: Course,
    private requestApiService: RequestApiService
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.time = this.data.time.split(' - ');
  }
  onSubmit(
    ID: number,
    id_course: string,
    name_course: string,
    type_course: string,
    money: string,
    timeStart: string,
    timeEnd: string,
    description: string
  ) {
    const data = {
      ID: ID,
      id_course: id_course,
      name_course: name_course,
      type_course: type_course,
      money: money,
      time: timeStart + ' - ' + timeEnd,
      description: description,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);

    const formData: FormData = new FormData();
    formData.append('course', toJson);
    this.requestApiService.update(formData, 'course/updateCourse').subscribe(
      (value) => {
        console.log(value);
        this.dialogRef.close({ data: value });
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
