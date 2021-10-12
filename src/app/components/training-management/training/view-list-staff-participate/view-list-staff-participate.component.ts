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
import { ActivatedRoute, Router } from '@angular/router';
import { timestamp } from 'rxjs/operators';
import { MockStaffParticipate } from 'src/app/mock-staff-participate';
import { RequestApiService } from 'src/app/services/request-api.service';
import { StaffParticipate } from 'src/app/staff-participate';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/services/auth.service';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-view-list-staff-participate',
  templateUrl: './view-list-staff-participate.component.html',
  styleUrls: ['./view-list-staff-participate.component.css'],
})
export class ViewListStaffParticipateComponent implements OnInit {
  staffParticipate: StaffParticipate[] = [];
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private requestApiService: RequestApiService,
    private autService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.autService.decodeToken();
    if (token.data.role > 1) {
      this.router.navigate(['/dashboard']);
    }
    this.getDataParticipateByID();
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
    this.requestApiService.dataFileTraining('2File').subscribe((value) => {
      this.exportAsExcelFile(value, 'Bảng đào tạo');
    });
  }

  // displayedColumns: string[] = ['codeProfile', 'fullname', 'sex', 'dateOfBirth', 'phoneNumber', 'email', 'position', 'exp', 'skill', 'education', 'languageSkill'];
  displayedColumns: string[] = [
    'staffId',
    'fullName',
    'position',
    'trainingId',
    'name',
    'time',
    'result',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<StaffParticipate>(this.staffParticipate);

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
  openDialogTrainingProcess(ID: string, index: number): void {
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataProcessByID(ID).subscribe((value) => {
      // console.log(value);
      console.log(value[0].time);
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';

      const dialogRef = this.dialog.open(DialogTrainingProcess, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        if (this.paginatior.pageIndex > 0) {
          const pos =
            this.paginatior.pageSize * this.paginatior.pageIndex + index;
          console.log(pos);
          this.dataSource.data[pos].status = result.data.status;
          this.dataSource.data[pos].result = result.data.result;
        } else {
          console.log(index);
          this.dataSource.data[index].status = result.data.status;
          this.dataSource.data[index].result = result.data.result;
        }
      });
    });
  }

  getDataParticipateByID() {
    const ID = this.route.snapshot.paramMap.get('ID')!;
    this.requestApiService.getDataParticipateByID(ID).subscribe(
      (value) => {
        console.log(value);
        this.dataSource.data = value;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

@Component({
  selector: 'dialog-training-process',
  templateUrl: './dialog-training-process.component.html',
  styleUrls: ['./view-list-staff-participate.component.css'],
})
export class DialogTrainingProcess {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  time: any[] = [];
  isLinear = false;
  firstFormGroup: FormGroup | undefined;
  secondFormGroup: FormGroup | undefined;
  constructor(
    public dialogRef: MatDialogRef<DialogTrainingProcess>,
    @Inject(MAT_DIALOG_DATA) public data: StaffParticipate,
    private requestApiService: RequestApiService
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // console.log(this.data.time);
    this.time = this.data.time.split(' - ');
    // console.log(this.time);
    // this.range.value.start = this.time[0]
    // this.range.value.end = this.time[1]
    console.log(this.range.value);
  }

  onSubmitProcess(
    id_training: string,
    name: string,
    id_staff: string,
    fullName: string,
    position: string,
    department: string,
    timeStart: string,
    timeEnd: string,
    diligence: string,
    note: string,
    evaluate: string
  ) {
    let time = timeStart + -+timeEnd;
    const data = {
      id_training: id_training,
      name: name,
      id_staff: id_staff,
      fullName: fullName,
      position: position,
      department: department,
      time: timeStart + ' - ' + timeEnd,
      diligence: diligence,
      note: note,
      evaluate: evaluate,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('process', toJson);
    this.requestApiService.insertDataProcess(formData).subscribe(
      (value) => {
        console.log(value);
        if (value !== null) {
          this.dialogRef.close({ data: value });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
