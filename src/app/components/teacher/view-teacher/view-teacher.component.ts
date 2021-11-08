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
//import { MockCourse } from 'src/app/mock-course';
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
import { Teacher } from 'src/app/teacher';
import { MockTeacher } from 'src/app/mock-teacher';

@Component({
  selector: 'app-view-teacher',
  templateUrl: './view-teacher.component.html',
  styleUrls: ['./view-teacher.component.css'],
})
export class ViewTeacherComponent implements OnInit {
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
    'id_tea',
    'name_tea',
    'type_tea',
    'email',
    'phone',
    'action',
  ];
  // dataSource = new MatTableDataSource<Student>(this.dataRecruitment);
  dataSource = new MatTableDataSource<Teacher>(MockTeacher);

  @ViewChild(MatTable) table!: MatTable<Teacher>;

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
    this.requestApiService.getData('teacher/getData').subscribe(
      (value) => {
        this.dataSource.data = value;
        console.log(value);
      },
      (err) => console.log(err)
    );
  }
  openDialogUpdateTeacher(ID: number, index: number): void {
    const dialogConfig = new MatDialogConfig();
    // console.log(MockViewStudent);

    this.requestApiService
      .getDataByID('teacher/getDataByID/' + ID)
      .subscribe((value) => {
        // dialogConfig.data = value[0];
        // dialogConfig.width = '100%';
        // const dialogRef = this.dialog.open(DialogRegisterCourse, dialogConfig);
        dialogConfig.data = value[0];
        dialogConfig.width = '60%';
        const dialogRef = this.dialog.open(DialogUpdateTeacher, dialogConfig);
        // dialogRef.afterClosed().subscribe((result) => {
        //   console.log(result.data, id_stu);
        // });
      });
  }
  delete(ID: number, index: number) {
    const deleteRecruit = {
      ID: ID,
    };
    const toJson = JSON.stringify(deleteRecruit);
    const formData: FormData = new FormData();
    formData.append('teacher', toJson);
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
    this.requestApiService.delete(formData, 'teacher/deleteTeacher').subscribe(
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
  selector: 'dialog-update-teacher',
  templateUrl: './dialog-update-teacher.component.html',
  styleUrls: ['./view-teacher.component.css'],
})
export class DialogUpdateTeacher {
  constructor(
    public dialogRef: MatDialogRef<DialogUpdateTeacher>,
    @Inject(MAT_DIALOG_DATA) public data: Teacher,
    private requestApiService: RequestApiService
  ) {}
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
      //console.log(this.file_data);
    }
  }

  onSubmit(
    ID: number,
    id_tea: string,
    name_tea: string,
    type_tea: string,
    email: string,
    phone: string
  ) {
    const newTeacher = {
      ID: ID,
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

    if (this.file_name != '') {
      this.requestApiService
        .update(this.file_data, 'teacher/updateTeacher')
        .subscribe((res) => {
          console.log(res);
        });
    }

    this.requestApiService.insert(formData, 'teacher/updateTeacher').subscribe(
      (value) => {
        console.log(value.ID);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
