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
import { MockStaffProfiles } from 'src/app/mock-staff-profiles';
import { AuthService } from 'src/app/services/auth.service';
import { RequestApiService } from 'src/app/services/request-api.service';
import { StaffProfiles } from 'src/app/staff-profiles';

@Component({
  selector: 'app-view-staff-profiles',
  templateUrl: './view-staff-profiles.component.html',
  styleUrls: ['./view-staff-profiles.component.css'],
})
export class ViewStaffProfilesComponent implements OnInit {
  staffProfiles: StaffProfiles[] = [];
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    public dialog: MatDialog,
    private requestApiService: RequestApiService,
    private autService: AuthService
  ) {}

  displayedColumns: string[] = [
    'staffId',
    'fullname',
    // 'sex',
    'phoneNumber',
    'email',
    'position',
    // 'department',
    // 'salary',
    // 'leave',
    'action',
  ];
  dataSource = new MatTableDataSource<StaffProfiles>(this.staffProfiles);
  role!: number;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const token = this.autService.decodeToken();
    this.role = token.data.role;
    this.getData();
  }

  getData() {
    this.requestApiService.getDataStaffProfile().subscribe((value) => {
      console.log(value);
      this.dataSource.data = value;
    });
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
  // pageIndex = this.paginatior.pageIndex;
  // pageSize = this.paginatior.pageSize;

  openDialogCancelContract(ID: number, index: number): void {
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataStaffProfileByID(ID).subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(DialogCancelContract, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        if (this.paginatior.pageIndex > 0) {
          const pos =
            this.paginatior.pageSize * this.paginatior.pageIndex + index;
          console.log(pos);
          this.dataSource.data[pos].status = result.data;
        } else {
          console.log(index);
          this.dataSource.data[index].status = result.data;
        }
      });
    });
  }
  openDialogRelative(): void {
    const dialogRef = this.dialog.open(DialogRelative, {
      width: '100%',
    });
  }

  openDialogCertificateManagement(ID: number, index: number): void {
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataStaffProfileByID(ID).subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(
        DialogCertificateManament,
        dialogConfig
      );
      dialogRef.afterClosed().subscribe((result) => {
        // if(this.paginatior.pageIndex >0){
        //   const pos = (this.paginatior.pageSize * this.paginatior.pageIndex) + index ;
        //   console.log(pos);
        //   this.dataSource.data[pos].status = result.data;
        //   }else{
        //     console.log(index);
        //     this.dataSource.data[index].status = result.data;
        //   }
      });
    });
  }

  openDialogWorkProcess(): void {
    const dialogRef = this.dialog.open(DialogWorkProcess, {
      width: '100%',
    });
  }

  openDialogReward(ID: number, index: number): void {
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataStaffProfileByID(ID).subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(DialogReward, dialogConfig);
    });
  }

  openDialogDiscipline(ID: number, index: number): void {
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataStaffProfileByID(ID).subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(DialogDiscipline, dialogConfig);
      // dialogRef.afterClosed().subscribe(result => {
      //   if(this.paginatior.pageIndex >0){
      //     const pos = (this.paginatior.pageSize * this.paginatior.pageIndex) + index ;
      //     console.log(pos);
      //     this.dataSource.data[pos].status = result.data;
      //     }else{
      //       console.log(index);
      //       this.dataSource.data[index].status = result.data;
      //     }
      // });
    });
  }

  openDialogAppoint(ID: number, index: number): void {
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataStaffProfileByID(ID).subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(DialogAppoint, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result.data);
        if (this.paginatior.pageIndex > 0) {
          const pos =
            this.paginatior.pageSize * this.paginatior.pageIndex + index;
          console.log(pos);
          this.dataSource.data[pos].position = result.data.pos_appoint;
          this.dataSource.data[pos].department = result.data.dep_appoint;
        } else {
          console.log(index);
          this.dataSource.data[index].position = result.data.pos_appoint;
          this.dataSource.data[index].department = result.data.dep_appoint;
        }
      });
    });
  }

  openDialogDetail(ID: number): void {
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataStaffProfileByID(ID).subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(
        DialogDetailStaffProfile,
        dialogConfig
      );
    });
  }

  openDialogTax(ID: number, index: number): void {
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataStaffProfileByID(ID).subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(DialogTaxInsurance, dialogConfig);
    });
  }

  openDialogAllowance(ID: number, index: number): void {
    const dialogConfig = new MatDialogConfig();
    this.requestApiService.getDataStaffProfileByID(ID).subscribe((value) => {
      dialogConfig.data = value[0];
      dialogConfig.width = '100%';
      const dialogRef = this.dialog.open(DialogAllowance, dialogConfig);
    });
  }
}

@Component({
  selector: 'dialog-cancel-contract',
  templateUrl: './dialog-cancel-contract.component.html',
  styleUrls: ['./view-staff-profiles.component.css'],
})
export class DialogCancelContract {
  constructor(
    public dialogRef: MatDialogRef<DialogCancelContract>,
    @Inject(MAT_DIALOG_DATA) public data: StaffProfiles,
    private requestApiService: RequestApiService
  ) {}

  onSubmit(
    id_decision: string,
    id_staff: string,
    fullName: string,
    time: string,
    reason: string
  ) {
    const data = {
      id_decision: id_decision,
      id_staff: id_staff,
      fullName: fullName,
      time: time,
      reason: reason,
      status: 'thôi việc',
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('cancle', toJson);
    this.requestApiService.insertDataCancleContract(formData).subscribe(
      (value) => {
        console.log(value);
        if (value) {
          this.dialogRef.close({ data: 'thôi việc' });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

@Component({
  selector: 'dialog-relative',
  templateUrl: './dialog-relative.component.html',
  styleUrls: ['./view-staff-profiles.component.css'],
})
export class DialogRelative {}

@Component({
  selector: 'dialog-certificate-management',
  templateUrl: './dialog-certificate-management.component.html',
  styleUrls: ['./view-staff-profiles.component.css'],
})
export class DialogCertificateManament {
  constructor(
    public dialogRef: MatDialogRef<DialogCancelContract>,
    @Inject(MAT_DIALOG_DATA) public data: StaffProfiles,
    private requestApiService: RequestApiService
  ) {}

  onSubmit(
    id_record: string,
    id_staff: string,
    fullName: string,
    content: string
  ) {
    const testData = content.substring(
      content.indexOf('<tbody>') + 7,
      content.indexOf('</tbody>')
    );
    const arr = testData.split('</tr>/n<tr>');
    const data = {
      id_record: id_record,
      id_staff: id_staff,
      fullName: fullName,
      content: content,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);
    console.log(testData);
    console.log(arr);
  }
}

@Component({
  selector: 'dialog-work-process',
  templateUrl: './dialog-work-process.component.html',
  styleUrls: ['./view-staff-profiles.component.css'],
})
export class DialogWorkProcess {}

@Component({
  selector: 'dialog-reward',
  templateUrl: './dialog-reward.component.html',
  styleUrls: ['./view-staff-profiles.component.css'],
})
export class DialogReward {
  constructor(
    private requestApiService: RequestApiService,
    public dialogRef: MatDialogRef<DialogReward>,
    @Inject(MAT_DIALOG_DATA) public data: StaffProfiles
  ) {}
  id_decision_temp: string = 'QD1';
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.requestApiService.decisionRecord('Reward').subscribe((value) => {
      this.id_decision_temp = 'QD' + (parseInt(value[0].ID) + 1);
    });
  }
  onSubmit(
    id_decision: string,
    id_staff: string,
    fullName: string,
    position: string,
    department: string,
    time: string,
    content: string
  ) {
    const data = {
      id_decision: id_decision,
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
    formData.append('reward', toJson);
    this.requestApiService.insertDataReward(formData).subscribe(
      (value) => {
        console.log(value);
        if (value != '') {
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
  selector: 'dialog-discipline',
  templateUrl: './dialog-discipline.component.html',
  styleUrls: ['./view-staff-profiles.component.css'],
})
export class DialogDiscipline {
  constructor(
    public dialogRef: MatDialogRef<DialogCancelContract>,
    @Inject(MAT_DIALOG_DATA) public data: StaffProfiles,
    private requestApiService: RequestApiService
  ) {}
  id_decision_temp: string = 'QD1';
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.requestApiService.decisionRecord('discipline').subscribe((value) => {
      this.id_decision_temp = 'QD' + (parseInt(value[0].ID) + 1);
    });
  }
  onSubmit(
    id_decision: string,
    id_staff: string,
    fullName: string,
    position: string,
    department: string,
    time: string,
    content: string
  ) {
    const data = {
      id_decision: id_decision,
      id_staff: id_staff,
      fullName: fullName,
      position: position,
      department: department,
      time: time,
      content: content,
    };
    const toJson = JSON.stringify(data);
    const formData: FormData = new FormData();
    formData.append('discipline', toJson);
    console.log(toJson);

    this.requestApiService.insertDataDiscipline(formData).subscribe(
      (value) => {
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

@Component({
  selector: 'dialog-appoint',
  templateUrl: './dialog-appoint.component.html',
  styleUrls: ['./view-staff-profiles.component.css'],
})
export class DialogAppoint {
  constructor(
    public dialogRef: MatDialogRef<DialogAppoint>,
    @Inject(MAT_DIALOG_DATA) public data: StaffProfiles,
    private requestApiService: RequestApiService
  ) {}
  id_decision_temp: string = 'QD1';
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.requestApiService.decisionRecord('appoint').subscribe((value) => {
      this.id_decision_temp = 'QD' + (parseInt(value[0].ID) + 1);
    });
  }
  onSubmit(
    id_decision: string,
    id_staff: string,
    fullName: string,
    position: string,
    department: string,
    pos_appoint: string,
    dep_appoint: string,
    time: string
  ) {
    const data = {
      id_decision: id_decision,
      id_staff: id_staff,
      fullName: fullName,
      position: position,
      department: department,
      pos_appoint: pos_appoint,
      dep_appoint: dep_appoint,
      time: time,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);

    const formData: FormData = new FormData();
    formData.append('appoint', toJson);
    this.requestApiService.insertDataAppoint(formData).subscribe((value) => {
      console.log(value);
      if (value != '') {
        this.dialogRef.close({ data: value });
      }
    });
  }
}

@Component({
  selector: 'dialog-detail-staff-profile',
  templateUrl: './dialog-detail-staff-profile.component.html',
  styleUrls: ['./view-staff-profiles.component.css'],
})
export class DialogDetailStaffProfile {
  isLinear: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DialogDetailStaffProfile>,
    @Inject(MAT_DIALOG_DATA) public data: StaffProfiles,
    private requestApiService: RequestApiService
  ) {}
}

@Component({
  selector: 'dialog-tax',
  templateUrl: './dialog-tax.component.html',
  styleUrls: ['./view-staff-profiles.component.css'],
})
export class DialogTaxInsurance {
  isLinear = false;
  rangeContract = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  constructor(
    private requestApiService: RequestApiService,
    public dialogRef: MatDialogRef<DialogTaxInsurance>,
    @Inject(MAT_DIALOG_DATA) public data: StaffProfiles
  ) {}
  id_decision_temp: string = 'QD1';
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.requestApiService.decisionRecord('insurance').subscribe((value) => {
      this.id_decision_temp = 'QD' + (parseInt(value[0].ID) + 1);
    });
  }
  onSubmitTax(
    id_decision: string,
    id_staff: string,
    fullName: string,
    position: string,
    department: string,
    time: string,
    percent: string,
    content: string
  ) {
    const data = {
      id_decision: id_decision,
      id_staff: id_staff,
      fullName: fullName,
      position: position,
      department: department,
      time: time,
      percent: percent,
      content: content,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('tax', toJson);
    this.requestApiService.insertDataTax(formData).subscribe(
      (value) => {
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSubmitInsurance(
    id_insurance: string,
    id_decision: string,
    id_staff: string,
    fullName: string,
    position: string,
    department: string,
    time: string,
    insurance: string
  ) {
    const data = {
      id_insurance: id_insurance,
      id_decision: id_decision,
      id_staff: id_staff,
      fullName: fullName,
      position: position,
      department: department,
      time: time,
      insurance: insurance,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('insurance', toJson);
    this.requestApiService.insertDataInsurance(formData).subscribe(
      (value) => {
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

@Component({
  selector: 'dialog-allowance',
  templateUrl: './dialog-allowance.component.html',
  styleUrls: ['./view-staff-profiles.component.css'],
})
export class DialogAllowance {
  isLinear = false;
  constructor(
    private requestApiService: RequestApiService,
    public dialogRef: MatDialogRef<DialogAllowance>,
    @Inject(MAT_DIALOG_DATA) public data: StaffProfiles
  ) {}
  id_decision_temp: string = 'QD1';
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.requestApiService.decisionRecord('allowance').subscribe((value) => {
      this.id_decision_temp = 'QD' + (parseInt(value[0].ID) + 1);
    });
  }
  onSubmitAllowance(
    id_decision: string,
    id_staff: string,
    fullName: string,
    position: string,
    department: string,
    time: string,
    content_allowance: string,
    content_subsidy: string
  ) {
    const data = {
      id_decision: id_decision,
      id_staff: id_staff,
      fullName: fullName,
      position: position,
      department: department,
      time: time,
      content_allowance: content_allowance,
      content_subsidy: content_subsidy,
    };
    const toJson = JSON.stringify(data);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('allowance', toJson);
    this.requestApiService.insertDataAllowance(formData).subscribe(
      (value) => {
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // onSubmitSubsidy(id_decision: string, id_staff: string, fullName: string, position: string, department: string, time: string, percent: string, content: string ){
  //   const data = {
  //     id_decision: id_decision,
  //     id_staff: id_staff,
  //     fullName: fullName,
  //     position: position,
  //     department: department,
  //     time: time,
  //     percent: percent,
  //     content: content
  //   }
  //   const toJson = JSON.stringify(data);
  //   console.log(toJson);
  //   const formData: FormData = new FormData();
  //   formData.append('tax', toJson);
  // }
}
