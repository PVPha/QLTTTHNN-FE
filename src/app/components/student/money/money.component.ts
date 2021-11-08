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
import { MockMoney } from 'src/app/mock-money';
import { RequestApiService } from 'src/app/services/request-api.service';
import { Money } from 'src/app/money';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.css'],
})
export class MoneyComponent implements OnInit {
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
    'id_stu',
    'name_stu',
    'id_course',
    'name_course',
    'money',
    'time_in',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<Money>(MockMoney);

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
    this.requestApiService.getData('money/getData').subscribe(
      (value) => {
        this.dataSource.data = value;
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //creating xlsx file
  exportAsExcelFile(data: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { HocPhi: worksheet },
      SheetNames: ['HocPhi'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
  export() {
    //this.exportAsExcelFile(MockMoney, 'Bảng học phí');
    this.requestApiService.getData('money/getData').subscribe((value) => {
      this.exportAsExcelFile(value, 'Bảng học phí');
    });
  }

  openDialogPayMoney(ID: number, index: number): void {
    const dialogConfig = new MatDialogConfig();

    this.requestApiService
      .getDataByID('money/getDataByID/' + ID)
      .subscribe((value) => {
        // dialogConfig.data = value[0];
        // dialogConfig.width = '100%';
        // const dialogRef = this.dialog.open(DialogRegisterCourse, dialogConfig);
        dialogConfig.data = value[0];
        dialogConfig.width = '100%';
        const dialogRef = this.dialog.open(DialogPayMoney, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
          // console.log(result.data, id_stu);
          if (this.paginatior.pageIndex > 0) {
            const pos =
              this.paginatior.pageSize * this.paginatior.pageIndex + index;
            console.log(pos);
            this.dataSource.data[pos].status = result.data[1];
            this.dataSource.data[pos].time_in = result.data[0];
          } else {
            console.log(index);
            this.dataSource.data[index].time_in = result.data[0];
            this.dataSource.data[index].status = result.data[1];
          }
        });
      });
  }
}
@Component({
  selector: 'dialog-pay-money',
  templateUrl: './dialog-pay-money.component.html',
  styleUrls: ['./money.component.css'],
})
export class DialogPayMoney {
  index: number = 0;
  constructor(
    public dialogRef: MatDialogRef<DialogPayMoney>,
    @Inject(MAT_DIALOG_DATA) public data: Money,
    private requestApiService: RequestApiService
  ) {}

  onSubmit(ID: number, id_stu: string, id_course: string, time_in: string) {
    const pay = {
      ID: ID,
      id_stu: id_stu,
      id_course: id_course,
      time_in: time_in,
    };
    const toJson = JSON.stringify(pay);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('money', toJson);
    this.requestApiService.insert(formData, 'money/insertMoney').subscribe(
      (res) => {
        console.log(res);
        this.dialogRef.close({ data: [time_in, 1] });
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
