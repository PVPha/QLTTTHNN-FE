import { JsonpClientBackend } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  selector: 'app-view-table-salary',
  templateUrl: './view-table-salary.component.html',
  styleUrls: ['./view-table-salary.component.css'],
})
export class ViewTableSalaryComponent implements OnInit {
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
    'fullname',
    'position',
    'salary',
    'coefficientSalary',
    'workDay',
    // 'overtime',
    'reward',
    'subsidy',
    'allowance',
    'tax',
    'insurance',
    'advance',
    'discipline',
    'kpi',
    'sale',
    'received',
    'action',
  ];
  displayedColumnsSales: string[] = [
    'fullname',
    'setSales',
    'achieveSales',
    'missingSales',
    'exceedSales',
    'action',
  ];
  displayedColumnsKPI: string[] = [
    'fullname',
    'position',
    'setKPI',
    'achieveKPI',
    'classification',
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
    this.requestApiService.getDataSalary().subscribe((value) => {
      this.exportAsExcelFile(value, 'Bảng lương');
    });
  }

  getData() {
    this.requestApiService.getDataSalary().subscribe(
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
  openDialogIncreaseSalary(ID: number, index: number): void {
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataSalaryByID(ID).subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(DialogIncreaseSalary, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result.data);
        if (this.paginatior.pageIndex > 0) {
          const pos =
            this.paginatior.pageSize * this.paginatior.pageIndex + index;
          console.log(result.data);
          this.dataSource.data[pos].salary = result.data.salary;
          // this.dataSource.data[pos].workDay_salary = result.data.workDay_salary;
          this.dataSource.data[pos].received = result.data.received;
        } else {
          console.log(index);
          console.log(result.data);
          this.dataSource.data[index].salary = result.data.salary;
          // this.dataSource.data[index].workDay_salary = result.data.workDay_salary;
          this.dataSource.data[index].received = result.data.received;
        }
      });
    });
  }

  openDialogAdvanceSalary(ID: number, index: number): void {
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataSalaryByID(ID).subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(DialogAdvanceSalary, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result.data);
        if (this.paginatior.pageIndex > 0) {
          const pos =
            this.paginatior.pageSize * this.paginatior.pageIndex + index;
          console.log(result.data.received);
          this.dataSource.data[pos].advance = result.data.advance;
          // this.dataSource.data[pos].workDay_salary = result.data.workDay_salary;
          this.dataSource.data[pos].received = result.data.received;
        } else {
          console.log(index);
          console.log(result.data.received);
          this.dataSource.data[index].advance = result.data.advance;
          // this.dataSource.data[index].workDay_salary = result.data.workDay_salary;
          this.dataSource.data[index].received = result.data.received;
        }
      });
    });
  }

  openDialogCalculations(): void {
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataCalculation().subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(DialogCalculations, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result.data);
        this.dataSource.data = result.data;
      });
    });
  }
}
@Component({
  selector: 'dialog-increase-salary',
  templateUrl: './dialog-increase-salary.component.html',
  styleUrls: ['./view-table-salary.component.css'],
})
export class DialogIncreaseSalary {
  id_decision_temp: string = 'sdfsd';
  constructor(
    public dialogRef: MatDialogRef<DialogIncreaseSalary>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private requestApiService: RequestApiService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.requestApiService.decisionSalary('Increase').subscribe(
      (value) => {
        this.id_decision_temp = 'QD' + (parseInt(value[0].ID) + 1);
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSubmit(
    ID: number,
    id_decision: string,
    id_staff: string,
    fullName: string,
    position: string,
    department: string,
    time: string,
    current: string,
    increase: string,
    content: string
  ) {
    const data = {
      id_decision: id_decision,
      id_staff: id_staff,
      fullName: fullName,
      position: position,
      department: department,
      time: time,
      current: current,
      increase: increase,
      content: content,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('increase', toJson);
    this.requestApiService.insertIncreaseSalary(formData).subscribe(
      (value) => {
        console.log(value);
        if (value) {
          this.requestApiService.getDataSalaryByID(ID).subscribe((value) => {
            console.log(value);
            this.dialogRef.close({ data: value[0] });
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

@Component({
  selector: 'dialog-advance-salary',
  templateUrl: './dialog-advance-salary.component.html',
  styleUrls: ['./view-table-salary.component.css'],
})
export class DialogAdvanceSalary {
  constructor(
    public dialogRef: MatDialogRef<DialogAdvanceSalary>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private requestApiService: RequestApiService
  ) {}
  id_decision_temp: string = 'QD1';
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
  }
  onSubmit(
    ID: number,
    id_decision: string,
    id_staff: string,
    fullName: string,
    position: string,
    department: string,
    time: string,
    advance: string,
    content: string
  ) {
    const data = {
      ID: ID,
      id_decision: id_decision,
      id_staff: id_staff,
      fullName: fullName,
      position: position,
      department: department,
      time: time,
      advance: advance,
      content: content,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('advance', toJson);
    this.requestApiService.insertAdvanceSalary(formData).subscribe(
      (value) => {
        console.log(value);
        if (value) {
          this.requestApiService.getDataSalaryByID(ID).subscribe((value) => {
            console.log(value);
            this.dialogRef.close({ data: value[0] });
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
@Component({
  selector: 'dialog-calculations',
  templateUrl: './dialog-calculations.component.html',
  styleUrls: ['./view-table-salary.component.css'],
})
export class DialogCalculations {
  constructor(
    public dialogRef: MatDialogRef<DialogCalculations>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private requestApiService: RequestApiService
  ) {}
  onSubmit(workDay: string, KPI: string, sale: string) {
    const data = {
      workDay: workDay,
      KPI: KPI,
      sale: sale,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('calculation', toJson);
    this.requestApiService.updateDataCalculation(formData).subscribe(
      (value) => {
        console.log(value);
        if (value) {
          this.requestApiService.getDataSalary().subscribe((value) => {
            console.log(value);
            this.dialogRef.close({ data: value });
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
