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
import { SelectionModel } from '@angular/cdk/collections';
import { Warehouse } from 'src/app/warehouse';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-view-storage',
  templateUrl: './view-storage.component.html',
  styleUrls: ['./view-storage.component.css'],
})
export class ViewStorageComponent implements OnInit {
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
    'select',
    'id_supplies',
    'name_supplies',
    'type',
    'number',
    'timeIn',
    'timeOut',
    'count',
    // 'mission',
    // 'workDay',
    // 'overtime',
    // 'early',
    // 'late',
    // 'action',
  ];

  dataSource = new MatTableDataSource<Timekeeping>(this.timeKeeping);
  clickedRows = new Set<Warehouse>();

  selection = new SelectionModel<any>(true, []);

  count(id_supplies: any, value: any) {
    setTimeout(() => {
      //console.log(id + ' ' + value);
      const data = {
        id_supplies: id_supplies,
        count: value,
      };
      const toJson = JSON.stringify(data);
      console.log(toJson);

      const formData: FormData = new FormData();
      formData.append('warehouse', toJson);
      this.requestApiService
        .update(formData, 'warehouse/insertCountEx')
        .subscribe(
          (value) => {
            console.log(value);
          },
          (err) => {
            console.log(err);
          }
        );
    }, 1000);
  }
  checkSupplies(id_supplies: any) {
    this.clickedRows.forEach((value) => {
      if (!value.id_supplies == id_supplies) {
        console.log('enable');
      }
    });
  }
  selectSupplies(row: any) {
    if (!this.clickedRows.has(row)) {
      this.clickedRows.add(row);
      console.log(this.clickedRows);
    } else {
      this.clickedRows.delete(row);
      console.log(this.clickedRows);
    }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const token = this.autService.decodeToken();
    this.role = token.data.role;
    this.getData();
  }

  getData() {
    this.requestApiService.getData('warehouse/getData').subscribe((value) => {
      console.log(value);
      this.dataSource.data = value;
    });
  }

  //creating xlsx file
  exportAsExcelFile(
    data: any[],

    excelFileName: string
  ): void {
    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // console.log('worksheet', worksheet);
    // const workbook: XLSX.WorkBook = {
    //   Sheets: { data: worksheet },
    //   SheetNames: ['data'],
    // };
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = {
      Sheets: { Export: worksheet },
      SheetNames: ['Export'],
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
  id_supplies: any[] = [];
  export() {
    this.clickedRows.forEach((value) => {
      this.id_supplies.push(value.id_supplies);
    });

    const data = {
      id_supplies: this.id_supplies,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);

    const formData: FormData = new FormData();
    formData.append('warehouse', toJson);

    this.requestApiService.update(formData, 'warehouse/export').subscribe(
      (value) => {
        this.exportAsExcelFile(value, 'Bảng xuất kho');
        this.getData();
      },
      (error) => {
        console.log(error);
      }
    );

    // this.requestApiService.dataFile('2File').subscribe((value) => {
    //   this.exportAsExcelFile(value.WD, value.KPI, value.SALE, 'Bảng công');
    // });
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

    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // openDialogMission(ID: string, index: number): void {
  //   console.log(ID);
  //   const dialogConfig = new MatDialogConfig();
  //   this.requestApiService.GetDataTimeKeepById(ID).subscribe((value) => {
  //     dialogConfig.data = value[0];
  //     dialogConfig.width = '100%';
  //     const dialogRef = this.dialog.open(DialogMission, dialogConfig);
  //     dialogRef.afterClosed().subscribe((result) => {
  //       console.log(result.data);
  //       if (this.paginatior.pageIndex > 0) {
  //         const pos =
  //           this.paginatior.pageSize * this.paginatior.pageIndex + index;
  //         console.log(pos);
  //         this.dataSource.data[pos].mission = result.data;
  //       } else {
  //         console.log(index);
  //         this.dataSource.data[index].mission = result.data;
  //       }
  //     });
  //   });
  // }

  // openDialogAbsent(ID: string, index: number): void {
  //   const dialogConfig = new MatDialogConfig();
  //   this.requestApiService.GetDataTimeKeepById(ID).subscribe((value) => {
  //     dialogConfig.data = value[0];
  //     dialogConfig.width = '100%';
  //     const dialogRef = this.dialog.open(DialogAbsent, dialogConfig);
  //     dialogRef.afterClosed().subscribe((result) => {
  //       console.log(result.data);
  //       if (this.paginatior.pageIndex > 0) {
  //         const pos =
  //           this.paginatior.pageSize * this.paginatior.pageIndex + index;
  //         console.log(pos);
  //         this.dataSource.data[pos].leaveDay = result.data.leaveDay;
  //         this.dataSource.data[pos].absent = result.data.absent;
  //       } else {
  //         console.log(result.data);
  //         this.dataSource.data[index].leaveDay = result.data.leaveDay;
  //         this.dataSource.data[index].absent = result.data.absent;
  //       }
  //     });
  //   });
  // }

  // openDialogComplain(): void {
  //   const dialogRef = this.dialog.open(DialogComplain, {
  //     width: '50%',
  //   });
  // }
  openDialogUpload(): void {
    const dialogRef = this.dialog.open(DialogUpload, {
      width: '50%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }
}

interface fileTimeKeep {
  workDay: string;
  KPI: string;
  sale: string;
}
@Component({
  selector: 'dialog-upload',
  templateUrl: './dialog-upload.component.html',
  styleUrls: ['./view-storage.component.css'],
})
export class DialogUpload {
  constructor(private requestApiService: RequestApiService) {}

  files!: fileTimeKeep;
  convertJson!: string;
  jsonImport!: string;
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
      const data = XLSX.utils.sheet_to_json(workbook.Sheets['Import']);
      this.jsonImport = JSON.stringify(data);
      console.log(this.jsonImport);
      // const dataKPI = XLSX.utils.sheet_to_json(workbook.Sheets['KPI']);
      // this.jsonKPI = JSON.stringify(dataKPI);
      // console.log(this.jsonKPI);
      // const dataSale = XLSX.utils.sheet_to_json(workbook.Sheets['Sale']);
      // this.jsonSale = JSON.stringify(dataSale);
      // console.log(this.jsonSale);
    };
  }
  handle(json: any) {
    const formData: FormData = new FormData();
    formData.append('warehouse', json);
    return formData;
  }
  upload() {
    console.log(this.sheetName);
    // const formData: FormData = new FormData();
    // formData.append('time-keep', this.convertJson);

    const formData = this.handle(this.jsonImport);
    this.requestApiService.insert(formData, 'wareHouse/insertData').subscribe(
      (value) => {
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
    // console.log('kpi');
    // const formDataKPI = this.handle(this.jsonKPI);
    // this.requestApiService.timeKeepKPI(formDataKPI).subscribe(
    //   (value) => {
    //     console.log(value);
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
    // console.log('doanh số');
    // const formDataSale = this.handle(this.jsonSale);
    // this.requestApiService.timeKeepSale(formDataSale).subscribe(
    //   (value) => {
    //     console.log(value);
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }
}
