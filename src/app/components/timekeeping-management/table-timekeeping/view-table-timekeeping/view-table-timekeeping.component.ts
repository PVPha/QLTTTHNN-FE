import { Component, Inject, OnInit, QueryList, ViewChild } from '@angular/core';
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
import { RequestApiService } from 'src/app/services/request-api.service';
import { xlsxFileService } from 'src/app/services/xlsxFile.service';
import { Timekeeping } from 'src/app/timekeeping';
import { TimekeepingAccordingToKPI } from 'src/app/timekeeping-according-to-kpi';
import { TimekeepingAccordingToSale } from 'src/app/timekeeping-according-to-sale';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/services/auth.service';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-view-table-timekeeping',
  templateUrl: './view-table-timekeeping.component.html',
  styleUrls: ['./view-table-timekeeping.component.css'],
})
export class ViewTableTimekeepingComponent implements OnInit {
  timeKeeping: Timekeeping[] = [];
  timeKeepingKPI: TimekeepingAccordingToKPI[] = [];
  timeKeepingSale: TimekeepingAccordingToSale[] = [];
  isLinear = false;
  firstFormGroup: FormGroup | undefined;
  secondFormGroup: FormGroup | undefined;
  role!: number;
  constructor(
    public dialog: MatDialog,
    private requestApiService: RequestApiService,
    private autService: AuthService // private xlsxFileService: xlsxFileService
  ) {}

  // displayedColumns: string[] = ['timeKeepingId', 'staffId', 'fullname', 'department', 'leave', 'absent', 'holiday', 'mission', 'workDay', 'overtime', 'early', 'late', 'kpi', 'sales', 'action'];
  displayedColumns: string[] = [
    'id_staff',
    'fullname',
    'department',
    'leave',
    'absent',
    'holiday',
    // 'mission',
    // 'workDay',
    // 'overtime',
    // 'early',
    // 'late',
    // 'action',
  ];


  dataSource = new MatTableDataSource<Timekeeping>(this.timeKeeping);
  dataSourceSale = new MatTableDataSource<TimekeepingAccordingToSale>(
    this.timeKeepingSale
  );
  dataSourceKPI = new MatTableDataSource<TimekeepingAccordingToKPI>(
    this.timeKeepingKPI
  );
  clickedRows = new Set<Timekeeping>();

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const token = this.autService.decodeToken();
    this.role = token.data.role;
    this.getData();
  }

  getData() {
    this.requestApiService.GetDataTimeKeep().subscribe((value) => {
      console.log(value);
      this.dataSource.data = value;
      this.dataSourceKPI.data = value;
      this.dataSourceSale.data = value;
    });
  }

  //creating xlsx file
  exportAsExcelFile(
    WD: any[],
    KPI: any[],
    SALE: any[],
    excelFileName: string
  ): void {
    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // console.log('worksheet', worksheet);
    // const workbook: XLSX.WorkBook = {
    //   Sheets: { data: worksheet },
    //   SheetNames: ['data'],
    // };
    const worksheetWD: XLSX.WorkSheet = XLSX.utils.json_to_sheet(WD);
    const worksheetKPI: XLSX.WorkSheet = XLSX.utils.json_to_sheet(KPI);
    const worksheetSALE: XLSX.WorkSheet = XLSX.utils.json_to_sheet(SALE);
    // console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = {
      Sheets: { WorkDay: worksheetWD, KPI: worksheetKPI, Sale: worksheetSALE },
      SheetNames: ['WorkDay', 'KPI', 'Sale'],
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
    this.requestApiService.dataFile('2File').subscribe((value) => {
      this.exportAsExcelFile(value.WD, value.KPI, value.SALE, 'Bảng công');
    });
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
  openDialogMission(ID: string, index: number): void {
    console.log(ID);
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.GetDataTimeKeepById(ID).subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(DialogMission, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result.data);
        if (this.paginatior.pageIndex > 0) {
          const pos =
            this.paginatior.pageSize * this.paginatior.pageIndex + index;
          console.log(pos);
          this.dataSource.data[pos].mission = result.data;
        } else {
          console.log(index);
          this.dataSource.data[index].mission = result.data;
        }
      });
    });
  }

  openDialogAbsent(ID: string, index: number): void {
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.GetDataTimeKeepById(ID).subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(DialogAbsent, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result.data);
        if (this.paginatior.pageIndex > 0) {
          const pos =
            this.paginatior.pageSize * this.paginatior.pageIndex + index;
          console.log(pos);
          this.dataSource.data[pos].leaveDay = result.data.leaveDay;
          this.dataSource.data[pos].absent = result.data.absent;
        } else {
          console.log(result.data);
          this.dataSource.data[index].leaveDay = result.data.leaveDay;
          this.dataSource.data[index].absent = result.data.absent;
        }
      });
    });
  }

  openDialogComplain(): void {
    const dialogRef = this.dialog.open(DialogComplain, {
      width: '50%',
    });
  }
  openDialogUpload(): void {
    const dialogRef = this.dialog.open(DialogUpload, {
      width: '50%',
    });
  }
}

@Component({
  selector: 'dialog-mission',
  templateUrl: './dialog-mission.component.html',
  styleUrls: ['./view-table-timekeeping.component.css'],
})
export class DialogMission {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    public dialogRef: MatDialogRef<DialogMission>,
    @Inject(MAT_DIALOG_DATA) public data: Timekeeping,
    private requestApiService: RequestApiService
  ) {}
  id_decision_temp: string = 'QD1';
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.requestApiService.decisionTimeKeep('mission').subscribe((value) => {
      this.id_decision_temp = 'QD' + (parseInt(value[0].ID) + 1);
      console.log(value);
    });
  }
  onSubmit(
    id_dicision: string,
    id_staff: string,
    fullName: string,
    position: string,
    department: string,
    location: string,
    date_dicision: string,
    cost: string,
    timeStart: string,
    timeEnd: string,
    content: string
  ) {
    // const start = timeStart.split('-');
    // const end = timeEnd.split('-');

    //const time = ((parseInt(end[1]) - parseInt(start[1])) - parseInt(start[0])) + parseInt(end[0]);
    const time = {
      start: timeStart,
      end: timeEnd,
    };
    // console.log(timeStart.substr(0,2));

    const data = {
      id_dicision: id_dicision,
      id_staff: id_staff,
      fullName: fullName,
      position: position,
      department: department,
      location: location,
      date_dicision: date_dicision,
      cost: cost,
      time: JSON.stringify(time),
      content: content,
      count: parseInt(timeEnd.substr(0, 2)) - parseInt(timeStart.substr(0, 2)),
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);

    const formData: FormData = new FormData();
    formData.append('mission', toJson);
    this.requestApiService.mission(formData).subscribe(
      (value) => {
        this.dialogRef.close({ data: value });
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

@Component({
  selector: 'dialog-absent',
  templateUrl: './dialog-absent.component.html',
  styleUrls: ['./view-table-timekeeping.component.css'],
})
export class DialogAbsent {
  constructor(
    public dialogRef: MatDialogRef<DialogMission>,
    @Inject(MAT_DIALOG_DATA) public data: Timekeeping,
    private requestApiService: RequestApiService
  ) {}
  id_decision_temp: string = 'MD1';
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.requestApiService.decisionTimeKeep('absent').subscribe((value) => {
      this.id_decision_temp = 'MD' + (parseInt(value[0].ID) + 1);
      console.log(value);
    });
  }
  onSubmit(
    id_dicision: string,
    id_staff: string,
    fullName: string,
    position: string,
    department: string,
    time: string,
    content: string
  ) {
    const data = {
      id_dicision: id_dicision,
      id_staff: id_staff,
      fullName: fullName,
      position: position,
      department: department,
      time: time,
      content: content,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);

    const formData: FormData = new FormData();
    formData.append('absent', toJson);
    this.requestApiService.absent(formData).subscribe(
      (value) => {
        if (value !== '') {
          this.dialogRef.close({ data: value });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

@Component({
  selector: 'dialog-complain',
  templateUrl: './dialog-complain.component.html',
  styleUrls: ['./view-table-timekeeping.component.css'],
})
export class DialogComplain {}

interface fileTimeKeep {
  workDay: string;
  KPI: string;
  sale: string;
}
@Component({
  selector: 'dialog-upload',
  templateUrl: './dialog-upload.component.html',
  styleUrls: ['./view-table-timekeeping.component.css'],
})
export class DialogUpload {
  constructor(private requestApiService: RequestApiService) {}

  files!: fileTimeKeep;
  convertJson!: string;
  jsonWorkDay!: string;
  jsonKPI!: string;
  jsonSale!: string;
  fileName!: string;
  sheetName: string[] = [];
  fileUpload(event: any) {
    console.log(event.target.files);
    const selectedFile = event.target.files[0];
    this.fileName = selectedFile.name;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      console.log(event);
      let binaryData = event.target?.result;
      let workbook = XLSX.read(binaryData, { type: 'binary' });
      // loop all sheet

      // workbook.SheetNames.forEach(sheet => {
      //   const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
      //   console.log(data);
      //   // this.convertJson = JSON.stringify(data, undefined, 4);
      //   this.convertJson = JSON.stringify(data);
      // })
      console.log(workbook.SheetNames);
      this.sheetName = workbook.SheetNames;

      // console.log(JSON.parse(this.convertJson)[0].Word);
      // console.log(this.convertJson);
      //select sheet name
      const dataWorkDay = XLSX.utils.sheet_to_json(workbook.Sheets['WorkDay']);
      this.jsonWorkDay = JSON.stringify(dataWorkDay);
      console.log(this.jsonWorkDay);
      const dataKPI = XLSX.utils.sheet_to_json(workbook.Sheets['KPI']);
      this.jsonKPI = JSON.stringify(dataKPI);
      console.log(this.jsonKPI);
      const dataSale = XLSX.utils.sheet_to_json(workbook.Sheets['Sale']);
      this.jsonSale = JSON.stringify(dataSale);
      console.log(this.jsonSale);
    };
  }
  handle(json: any) {
    const formData: FormData = new FormData();
    formData.append('time-keep', json);
    return formData;
  }
  upload() {
    console.log(this.sheetName);
    // const formData: FormData = new FormData();
    // formData.append('time-keep', this.convertJson);
    console.log('ngày công');
    const formDataWorkDay = this.handle(this.jsonWorkDay);
    this.requestApiService.timeKeep(formDataWorkDay).subscribe(
      (value) => {
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
    console.log('kpi');
    const formDataKPI = this.handle(this.jsonKPI);
    this.requestApiService.timeKeepKPI(formDataKPI).subscribe(
      (value) => {
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
    console.log('doanh số');
    const formDataSale = this.handle(this.jsonSale);
    this.requestApiService.timeKeepSale(formDataSale).subscribe(
      (value) => {
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
    //#region
    // if (this.fileName.includes('ngày công')) {
    //   console.log('ngày công');
    //   this.requestApiService.timeKeep(formData).subscribe(value => {
    //     console.log(value);
    //   }, err => {
    //     console.log(err);
    //   })
    // } else if(this.fileName.includes('kpi')) {
    //   console.log('kpi');
    //   this.requestApiService.timeKeepKPI(formData).subscribe(value => {
    //     console.log(value);
    //   }, err => {
    //     console.log(err);
    //   })
    // } else if(this.fileName.includes('doanh số')) {
    //   console.log('doanh số');
    //   this.requestApiService.timeKeepSale(formData).subscribe(value => {
    //     console.log(value);
    //   }, err => {
    //     console.log(err);
    //   })
    // }
    //#endregion
  }
}
