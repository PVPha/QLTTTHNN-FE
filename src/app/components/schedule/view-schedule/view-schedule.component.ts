import { JsonpClientBackend } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
import { MockSalary } from 'src/app/mock-salary';
import { MockSalaryAccordingToKpi } from 'src/app/mock-salary-according-to-kpi';
import { MockSalaryAccordingToSale } from 'src/app/mock-salary-according-to-sale';
import { Salary } from 'src/app/salary';
import { SalaryAccordingToKpi } from 'src/app/salary-according-to-kpi';
import { SalaryAccordingToSale } from 'src/app/salary-according-to-sale';
import { RequestApiService } from 'src/app/services/request-api.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.css'],
})
export class ViewScheduleComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup | undefined;
  secondFormGroup: FormGroup | undefined;

  constructor(
    public dialog: MatDialog,
    private requestApiService: RequestApiService,
    private autService: AuthService,
    private router: Router
  ) {}

  // displayedColumns: string[] = ['timeKeepingId', 'staffId', 'fullname', 'department', 'leave', 'absent', 'holiday', 'mission', 'workDay', 'overtime', 'early', 'late', 'kpi', 'sales', 'action'];
  displayedColumns: string[] = [
    'id_course',
    'name_course',
    'time',
    'day',
    'name_tea',
    'room',
    // 'allowance',
    // 'tax',
    // 'insurance',
    // 'advance',
    // 'discipline',
    // 'kpi',
    // 'sale',
    // 'received',
    'action',
  ];

  dataSource = new MatTableDataSource<Salary>(MockSalary);
  dataSourceSale = new MatTableDataSource<SalaryAccordingToSale>(
    MockSalaryAccordingToSale
  );
  dataSourceKPI = new MatTableDataSource<SalaryAccordingToKpi>(
    MockSalaryAccordingToKpi
  );
  clickedRows = new Set<Salary>();
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const token = this.autService.decodeToken();
    if (token.data.role == 1) {
      this.router.navigate(['/dashboard']);
    }
    this.getData();
  }

  //creating xlsx file
  exportAsExcelFile(data: any[], excelFileName: string): void {
    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // console.log('worksheet', worksheet);
    // const workbook: XLSX.WorkBook = {
    //   Sheets: { data: worksheet },
    //   SheetNames: ['data'],
    // };
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { result: worksheet },
      SheetNames: ['result'],
      // Sheets: { data: worksheetWD },
      // SheetNames: ['WorkDay'],
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
    this.requestApiService.getData('schedule/getData').subscribe((value) => {
      this.exportAsExcelFile(value, 'Bảng TKB');
    });
  }

  getData() {
    this.requestApiService.getData('schedule/getData').subscribe(
      (value) => {
        console.log(value);
        this.dataSource.data = value;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  //@ViewChild(MatPaginator) paginatior = new QueryList<MatPaginator>(); //https://stackoverflow.com/questions/50428605/multiple-material-pagination-in-one-component-doesnt-work-in-angular
  @ViewChild('MatPaginator') paginatior!: MatPaginator;
  @ViewChild('MatPaginatorSales') paginatiorSales!: MatPaginator;
  @ViewChild('MatPaginatorKPI') paginatiorKPI!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.dataSource.paginator = this.paginatior;
    this.dataSourceSale.paginator = this.paginatiorSales;
    this.dataSourceKPI.paginator = this.paginatiorKPI;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialogUpdateSchedule(ID: number, index: number): void {
    const dialogConfig = new MatDialogConfig();

    this.requestApiService
      .getDataByID('schedule/getDataById/' + ID)
      .subscribe((value) => {
        dialogConfig.data = value[0];
        dialogConfig.width = '50%';
        const dialogRef = this.dialog.open(DialogUpdateSchedule, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
          this.getData();
        });
      });
  }

  // openDialogAdvanceSalary(ID: number, index: number): void {
  //   const dialogConfig = new MatDialogConfig();
  //   this.requestApiService.getDataSalaryByID(ID).subscribe((value) => {
  //     dialogConfig.data = value[0];
  //     dialogConfig.width = '100%';
  //     const dialogRef = this.dialog.open(DialogAdvanceSalary, dialogConfig);
  //     dialogRef.afterClosed().subscribe((result) => {
  //       console.log(result.data);
  //       if (this.paginatior.pageIndex > 0) {
  //         const pos =
  //           this.paginatior.pageSize * this.paginatior.pageIndex + index;
  //         console.log(result.data.received);
  //         this.dataSource.data[pos].advance = result.data.advance;
  //         // this.dataSource.data[pos].workDay_salary = result.data.workDay_salary;
  //         this.dataSource.data[pos].received = result.data.received;
  //       } else {
  //         console.log(index);
  //         console.log(result.data.received);
  //         this.dataSource.data[index].advance = result.data.advance;
  //         // this.dataSource.data[index].workDay_salary = result.data.workDay_salary;
  //         this.dataSource.data[index].received = result.data.received;
  //       }
  //     });
  //   });
  // }

  // openDialogCalculations(): void {
  //   const dialogConfig = new MatDialogConfig();
  //   this.requestApiService.getDataCalculation().subscribe((value) => {
  //     dialogConfig.data = value[0];
  //     dialogConfig.width = '100%';
  //     const dialogRef = this.dialog.open(DialogCalculations, dialogConfig);
  //     dialogRef.afterClosed().subscribe((result) => {
  //       console.log(result.data);
  //       this.dataSource.data = result.data;
  //     });
  //   });
  // }
}

@Component({
  selector: 'dialog-update-schedule',
  templateUrl: './dialog-update-schedule.component.html',
  styleUrls: ['./view-schedule.component.css'],
})
export class DialogUpdateSchedule {
  constructor(
    public dialogRef: MatDialogRef<DialogUpdateSchedule>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private requestApiService: RequestApiService
  ) {}
  id_decision_temp: string = 'QD1';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  listTeacher: any[] = [];
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.requestApiService.decisionSalary('Advance').subscribe(
      (value) => {
        this.id_decision_temp = 'QD' + (parseInt(value[0].ID) + 1);
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
    this.requestApiService.getData('teacher/getData').subscribe(
      (value) => {
        this.listTeacher = value;
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  onSubmit(
    ID: number,
    id_course: string,
    name_course: string,
    day: string,
    time: string,
    name_tea: string,
    room: string
  ) {
    const data = {
      ID: ID,
      id_course: id_course,
      name_course: name_course,
      day: day,
      time: time,
      name_tea: name_tea,
      room: room,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('schedule', toJson);
    this.requestApiService
      .insert(formData, 'schedule/insertSchedule')
      .subscribe(
        (value) => {
          console.log(value);
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
