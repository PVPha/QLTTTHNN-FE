import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MockViewStudent } from 'src/app/mock-view-student';
import { MockCourse } from 'src/app/mock-course';
import { Student } from 'src/app/student';
import { RequestApiService } from 'src/app/services/request-api.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/services/auth.service';
import { Course } from 'src/app/course';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css'],
})
export class ViewStudentComponent implements AfterViewInit {
  inforRecruit!: Student;
  dataRecruitment: Student[] = [];
  clickedRows = new Set<Student>();
  response: any[] = [];
  icon: number = 1;
  pageIndex: number = 1;
  pageSize: number = 1;
  deleteRow: string = '[class.demo-row-is-clicked]="clickedRows.has(row)"';

  constructor(
    private requestApiService: RequestApiService,
    private autService: AuthService,
    public dialog: MatDialog,
    private router: Router
  ) {}
  // displayedColumns: string[] = ['ID','department', 'position', 'require', 'describe', 'amount', 'benefit', 'approval', 'action'];
  displayedColumns: string[] = [
    'id_student',
    'fullName',
    'phone',
    'mail',
    'action',
  ];
  // dataSource = new MatTableDataSource<Student>(this.dataRecruitment);
  dataSource = new MatTableDataSource<Student>(MockViewStudent);

  @ViewChild(MatTable) table!: MatTable<Student>;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const token = this.autService.decodeToken();
    if (token.data.role > 1) {
      this.router.navigate(['/dashboard']);
    }
    this.getData();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
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
  getPageIndex(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  // openDialogUpdateRecruit(): void {
  //   const dialogRef = this.dialog.open(DialogUpdateRecruit, {
  //     width: '80%'
  //   });
  // }

  getData() {
    this.requestApiService.getData('student/getData').subscribe(
      (value) => {
        this.dataSource.data = value;
        console.log(value);
      },
      (err) => console.log(err)
    );
  }

  openDialogRegisterCourse(ID: number, id_stu: string, index: number): void {
    const dialogConfig = new MatDialogConfig();

    this.requestApiService.getData('course/getData').subscribe((value) => {
      // dialogConfig.data = value[0];
      // dialogConfig.width = '100%';
      // const dialogRef = this.dialog.open(DialogRegisterCourse, dialogConfig);
      console.log(value);

      dialogConfig.data = value;
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(DialogRegisterCourse, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result.data, id_stu);
        const join = {
          id_stu: id_stu,
          id_course: result.data,
        };
        const toJson = JSON.stringify(join);
        const formData: FormData = new FormData();
        formData.append('joincou', toJson);
        this.requestApiService
          .insert(formData, 'joincou/insertJoinCou')
          .subscribe(
            (res) => {
              console.log(res);
            },
            (err) => {
              console.log(err);
            }
          );
      });
    });
  }
  openDialogUpdateStudent(ID: number, index: number): void {
    const dialogConfig = new MatDialogConfig();

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(result.data, id_stu);
    // });
    this.requestApiService
      .getDataByID('student/getDataByID/' + ID)
      .subscribe((value) => {
        // dialogConfig.data = value[0];
        // dialogConfig.width = '100%';
        // const dialogRef = this.dialog.open(DialogRegisterCourse, dialogConfig);
        console.log(value);
        dialogConfig.data = value[0];
        dialogConfig.width = '100%';
        const dialogRef = this.dialog.open(DialogUpdateStudent, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
          // console.log(result.data, id_stu);
          if (this.paginatior.pageIndex > 0) {
            const pos =
              this.paginatior.pageSize * this.paginatior.pageIndex + index;
            console.log(pos);
            this.dataSource.data[pos].id_stu = result.data[0];
            this.dataSource.data[pos].name_stu = result.data[1];
            this.dataSource.data[pos].email = result.data[2];
            this.dataSource.data[pos].phone = result.data[3];
          } else {
            console.log(index);
            this.dataSource.data[index].id_stu = result.data[0];
            this.dataSource.data[index].name_stu = result.data[1];
            this.dataSource.data[index].email = result.data[2];
            this.dataSource.data[index].phone = result.data[3];
          }
        });
      });
  }
  delete(
    ID: number,
    id_stu: string,
    index: number,
    pageIndex: number,
    pageSize: number
  ) {
    const deleteRecruit = {
      ID: ID,
      id_stu: id_stu,
    };
    const toJson = JSON.stringify(deleteRecruit);
    const formData: FormData = new FormData();
    formData.append('student', toJson);
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

    // if(pageIndex >0){
    //   const pos = (pageSize* pageIndex) + index ;
    //   console.log(pos);
    //   // delete this.dataSource.data[pos];

    //   ;
    // }else{
    //   console.log(index);
    //   delete this.dataSource.data[index];
    // }
    // this.clickedRows.clear()
    // this.clickedRows.delete(this.inforRecruit)

    this.requestApiService.delete(formData, 'student/deleteStudent').subscribe(
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
  selector: 'dialog-register-course',
  templateUrl: './dialog-register-course.component.html',
  styleUrls: ['./view-student.component.css'],
})
export class DialogRegisterCourse {
  index: number = 0;
  // range = new FormGroup({
  //   start: new FormControl(),
  //   end: new FormControl(),
  // });
  // time: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<DialogRegisterCourse>,
    @Inject(MAT_DIALOG_DATA) public data: Course[],
    private requestApiService: RequestApiService
  ) {}
  //count: number = 0;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.index = this.data.length - 1;
  }
  changeCourse(index: number) {
    this.index = index;
  }
  onSubmit(id_course: string) {
    console.log(id_course);

    this.dialogRef.close({ data: id_course });
  }
}

@Component({
  selector: 'dialog-update-student',
  templateUrl: './dialog-update-student.component.html',
  styleUrls: ['./view-student.component.css'],
})
export class DialogUpdateStudent {
  index: number = 0;
  constructor(
    public dialogRef: MatDialogRef<DialogUpdateStudent>,
    @Inject(MAT_DIALOG_DATA) public data: Student,
    private requestApiService: RequestApiService
  ) {}

  onSubmit(
    ID: number,
    id_stu: string,
    name_stu: string,
    email: string,
    phone: string
  ) {
    const newStudent = {
      ID: ID,
      id_stu: id_stu,
      name_stu: name_stu,
      email: email,
      phone: phone,
    };
    const toJson = JSON.stringify(newStudent);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('student', toJson);
    this.requestApiService.update(formData, 'student/updateStudent').subscribe(
      (res) => {
        console.log(res);
        this.dialogRef.close({ data: [id_stu, name_stu, email, phone] });
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
