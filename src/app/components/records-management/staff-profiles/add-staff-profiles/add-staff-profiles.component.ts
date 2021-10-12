import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CandidateProfile } from 'src/app/candidate-profile';
import { ViewInterviewScheduleComponent } from 'src/app/components/recruitment/interview-schedule/view-interview-schedule/view-interview-schedule.component';
import { Contract } from 'src/app/contract';
import { MockStaffProfiles } from "src/app/mock-staff-profiles";
import { RequestApiService } from 'src/app/services/request-api.service';
import { StaffProfiles } from 'src/app/staff-profiles';

@Component({
  selector: 'app-add-staff-profiles',
  templateUrl: './add-staff-profiles.component.html',
  styleUrls: ['./add-staff-profiles.component.css']
})
export class AddStaffProfilesComponent implements OnInit {
  candidateProfiles: CandidateProfile[] = [];
  staffProfiles: StaffProfiles[] = [];
  id_staff2: string = '';
  fullName: string = '';
  dateOfBirth: string = '';
  phoneNumber: string = '';
  address: string = '';
  identityCard: string = '';
  position: string = '';
  department: string = '';
  depControl = new FormControl;
  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private requestApiService: RequestApiService
  ) { }

  ngOnInit() {
    // add staff profile

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.filteredOptions2 = this.myControl2.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );

    // add contract
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    //get candidate profiles to add staffprofiles
    this.getDataByID();

  }

  getDataByID(): void{
    const ID = parseInt(this.route.snapshot.paramMap.get('ID')!,10);
    this.requestApiService.getDataStaffProfileByID(ID).subscribe(value => {
      this.staffProfiles = value;
      console.log(value);
    }, err => {
      console.log(err);
    })
  }


  onSubmit(id_staff: string, fullName: string, sex: string, dob: string, identityCard: string, nation: string, homeTown: string, email: string, phoneNumber: string, address: string, position: string, department: string, health: string, salary: string, coefficientSalary: string, leaveDay: string, education: string, languageSkill: string){
    // this.id_staff = id_staff;
    // this.fullName = fullName;
    // this.dateOfBirth = dob;
    // this.phoneNumber = phoneNumber;
    // this.address = address;
    // this.identityCard = identityCard;
    // this.position = position;
    // this.department = department;
    const data = {
      ID: '',
      id_staff: id_staff,
      fullName: fullName,
      sex: sex,
      dateOfBirth: dob,
      identityCard: identityCard,
      nation: nation,
      homeTown: homeTown,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
      position: position,
      department: department,
      health: health,
      salary: salary,
      coefficientSalary: coefficientSalary,
      leaveDay: leaveDay,
      education: education,
      languageSkill: languageSkill,
    }
    const toJson = JSON.stringify(data);
    const formData: FormData = new FormData();
    formData.append('staff', toJson);
    console.log(toJson);
    this.requestApiService.insertDataStaffProfile(formData).subscribe(value => {
      console.log(value);
      // this.staffProfiles = value;
    }, err => {
      console.log(err);
    })

  }
  onSubmitContract(id_contract: string, id_staff: string, fullName: string, dob: string, typeContract: string, duration: string, range: string, phoneNumber: string, address: string, identityCard: string, position: string, department: string, content: string ){
    // console.log(id_contract, id_staff, fullName, dob, typeContract, duration, JSON.stringify(range), phoneNumber, address, identityCard, position, department, content);

    const data = {
      id_contract: id_contract,
      id_staff: id_staff,
      fullName: fullName,
      dateOfBirth: dob,
      typeContract: typeContract,
      duration: duration,
      time: range,
      phoneNumber: phoneNumber,
      address: address,
      identityCard: identityCard,
      position: position,
      department: department,
      content: content
    }
    const toJson = JSON.stringify(data);
    const formData: FormData = new FormData();
    formData.append('contract', toJson);
    console.log(toJson);
    this.requestApiService.insertDataContract(formData).subscribe(value => {
      console.log(value);
    }, err => {
      console.log(err);
    })
  }

  onSubmitResource(id_dicision: string, time: string, id_staff: string, fullName: string, content: string){
    const data = {
      id_dicision: id_dicision,
      id_staff: id_staff,
      fullName: fullName,
      time: time,
      content: content
    }
    const toJson = JSON.stringify(data);
    console.log(toJson);
    const formData: FormData = new FormData();
    formData.append('resources', toJson);
    this.requestApiService.insertDataResource(formData).subscribe(value => {
      console.log(value);

    }, err => {
      console.log(err);
    })
  }
  @ViewChild(ViewInterviewScheduleComponent, {static: false}) childC!: ViewInterviewScheduleComponent;
  reload(){
    this.childC.refresh();
  }

  // add contract

  isLinear = false;
  firstFormGroup: FormGroup | undefined;
  secondFormGroup: FormGroup |undefined;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  rangeContract = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  //add staff profile

  //avatar: string = ''
   avatar: string = '../../../../../assets/img/mike.jpg'

  myControl = new FormControl();
  myControl2 = new FormControl();
  options: string[] = ['IT', 'Marketing', 'Sale'];
  options2: string[] = ['Dài hạn', 'Ngắn hạn', 'Thời vụ'];
  filteredOptions: Observable<string[]> | undefined;
  filteredOptions2: Observable<string[]> | undefined;



  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options2.filter(option => option.toLowerCase().includes(filterValue));
  }


  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
