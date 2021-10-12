import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { expand, map } from 'rxjs/operators';
import { CandidateProfile } from '../candidate-profile';
import { Contract } from '../contract';
import { Hiring } from '../hiring';
import { InfoRecruit } from '../info-recruit';
import { Interview } from '../interview';
import { StaffProfiles } from '../staff-profiles';
// import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    Authorization: 'authkey',
    'content-type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class RequestApiService {
  constructor(
    // private authService: AuthService,
    private http: HttpClient
  ) {}

  // start recruitment
  getRecruitment =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/recruitment/getData';
  insertRecruitment =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/recruitment/insertData';
  deleteRecruitment =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/recruitment/deleteData';
  updateRecruitmentApi =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/recruitment/updateData';
  getRecruitmentById =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/recruitment/getDataById/';

  insertDataRecruitment(formData: FormData): Observable<any> {
    return this.http.post<any>(this.insertRecruitment, formData);
  }
  updateDataRecruitment(formData: FormData): Observable<any> {
    return this.http.post<any>(this.updateRecruitmentApi, formData);
  }
  getDataRecruitment(): Observable<InfoRecruit[]> {
    return this.http.get<InfoRecruit[]>(this.getRecruitment);
    // .pipe(
    //   map((data)=> {
    //     console.log(data);

    //     if (Object.prototype.hasOwnProperty.call(data, 'error')) {
    //       console.log('DataService: getUsersFromWeb', data);
    //       this.authService.login(backUrl);
    //     }
    //     // this.authService.login(backUrl);
    //     return data
    //   })
    // )
  }
  getDataRecruitmentById(ID: number): Observable<InfoRecruit[]> {
    const url = this.getRecruitmentById + ID;
    return this.http.get<InfoRecruit[]>(url, httpOptions);
  }
  deleteDataRecruitment(formData: FormData): Observable<InfoRecruit[]> {
    return this.http.post<InfoRecruit[]>(this.deleteRecruitment, formData);
  }
  //end recruitment

  // start candidate
  getCandidate =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/candidate/getData';
  getCandidateByID =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/candidate/getDataById/';
  insertCandidate =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/candidate/insertData';

  insertDataCandidate(formData: FormData): Observable<CandidateProfile> {
    return this.http.post<CandidateProfile>(this.insertCandidate, formData);
  }
  uploadFileCandidate(fileData: any): Observable<any> {
    return this.http.post<any>(this.insertCandidate, fileData);
  }
  getDataCandidate(): Observable<CandidateProfile[]> {
    return this.http.get<CandidateProfile[]>(this.getCandidate, httpOptions);
  }

  decisionCandidate(decision: string): Observable<CandidateProfile[]> {
    const url = this.getCandidate + decision;
    return this.http.get<CandidateProfile[]>(url, httpOptions);
  }
  getDataCandidateByID(ID: number): Observable<CandidateProfile[]> {
    const url = this.getCandidateByID + ID;
    return this.http.get<CandidateProfile[]>(url, httpOptions);
  }
  // end candidate

  // start interview
  schedule =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/interview/insertDataSchedule';
  point =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/interview/insertDataPoint';

  insertDataSchedule(formData: FormData): Observable<Interview> {
    return this.http.post<Interview>(this.schedule, formData);
  }
  insertDataPoint(formData: FormData): Observable<Interview> {
    return this.http.post<Interview>(this.point, formData);
  }
  // end interview

  //start hiring
  hiring =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/hiring/insertDataHiring';
  insertDataHiring(formData: FormData): Observable<Hiring> {
    return this.http.post<Hiring>(this.hiring, formData);
  }
  //end hiring

  // start records management
  insert_staffProfile =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/records/insertDataStaffProfile';
  get_staffProfile =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/records/getDataStaffProfile';

  get_staffProfileByID =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/records/getDataStaffProfileByID/';
  contract =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/records/insertDataContract';
  cancel_contract =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/records/insertDataCancleContract';
  resource =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/records/insertDataResource';
  reward =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/records/insertDataReward';
  appoint =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/records/insertDataAppoint';
  discipline =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/records/insertDataDiscipline';
  tax = 'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/records/insertDataTax';
  insurance =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/records/insertDataInsurance';
  allowance =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/records/insertDataAllowance';
  insertDataStaffProfile(formData: FormData): Observable<StaffProfiles> {
    return this.http.post<StaffProfiles>(this.insert_staffProfile, formData);
  }
  getDataStaffProfile(): Observable<StaffProfiles[]> {
    return this.http.get<StaffProfiles[]>(this.get_staffProfile, httpOptions);
  }
  decisionRecord(table: string): Observable<StaffProfiles[]> {
    const url =
      'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/records/decision/' + table;
    return this.http.get<StaffProfiles[]>(url, httpOptions);
  }
  insertDataContract(formData: FormData): Observable<Contract> {
    return this.http.post<Contract>(this.contract, formData);
  }
  insertDataCancleContract(formData: FormData): Observable<any> {
    return this.http.post<any>(this.cancel_contract, formData);
  }
  insertDataResource(formData: FormData): Observable<any> {
    // return this.http.post<any>{this.resource, formData};
    return this.http.post<any>(this.resource, formData);
  }
  insertDataReward(formData: FormData): Observable<any> {
    // return this.http.post<any>{this.resource, formData};
    return this.http.post<any>(this.reward, formData);
  }
  insertDataAppoint(formData: FormData): Observable<any> {
    // return this.http.post<any>{this.resource, formData};
    return this.http.post<any>(this.appoint, formData);
  }
  insertDataDiscipline(formData: FormData): Observable<any> {
    // return this.http.post<any>{this.resource, formData};
    return this.http.post<any>(this.discipline, formData);
  }
  getDataStaffProfileByID(ID: number): Observable<StaffProfiles[]> {
    const url = this.get_staffProfileByID + ID;
    return this.http.get<StaffProfiles[]>(url, httpOptions);
  }
  insertDataTax(formData: FormData): Observable<any> {
    // return this.http.post<any>{this.resource, formData};
    return this.http.post<any>(this.tax, formData);
  }
  insertDataInsurance(formData: FormData): Observable<any> {
    // return this.http.post<any>{this.resource, formData};
    return this.http.post<any>(this.insurance, formData);
  }
  insertDataAllowance(formData: FormData): Observable<any> {
    // return this.http.post<any>{this.resource, formData};
    return this.http.post<any>(this.allowance, formData);
  }
  // end records management
  // start time keeping
  getTimeKeepApi =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/timeKeeping/getData';
  getTimeKeepApiByID =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/timeKeeping/getDataById/';
  timeKeepApi =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/timeKeeping/insertData';
  timeKeepKPIApi =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/timeKeeping/insertDataKPI';
  timeKeepSaleApi =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/timeKeeping/insertDataSale';
  missionApi =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/timeKeeping/insertDataMission';
  absentApi =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/timeKeeping/insertDataAbsent';
  GetDataTimeKeep(): Observable<any[]> {
    return this.http.get<any[]>(this.getTimeKeepApi, httpOptions);
  }
  dataFile(table: string): Observable<any> {
    const url = this.getTimeKeepApi + table;
    return this.http.get<any>(url, httpOptions);
  }
  decisionTimeKeep(table: string): Observable<any[]> {
    const url =
      'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/timeKeeping/decision/' +
      table;
    return this.http.get<any[]>(url, httpOptions);
  }
  GetDataTimeKeepById(ID: string): Observable<any[]> {
    const url = this.getTimeKeepApiByID + ID;
    return this.http.get<any[]>(url, httpOptions);
  }
  timeKeep(formData: FormData): Observable<any> {
    return this.http.post<any>(this.timeKeepApi, formData);
  }
  timeKeepKPI(formData: FormData): Observable<any> {
    return this.http.post<any>(this.timeKeepKPIApi, formData);
  }
  timeKeepSale(formData: FormData): Observable<any> {
    return this.http.post<any>(this.timeKeepSaleApi, formData);
  }
  mission(formData: FormData): Observable<any> {
    return this.http.post<any>(this.missionApi, formData);
  }
  absent(formData: FormData): Observable<any> {
    return this.http.post<any>(this.absentApi, formData);
  }
  // end time keeping

  //start salary
  dataSalary = 'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/salary/getData';
  dataSalaryByID =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/salary/getDataByID/';
  calculation =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/salary/getDataCalculation';
  updateCalculation =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/salary/updateDataCalculation';
  increaseSalary =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/salary/insertDataIncreaseSalary';
  advanceSalary =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/salary/insertDataAdvanceSalary';
  getDataSalary(): Observable<any[]> {
    return this.http.get<any[]>(this.dataSalary, httpOptions);
  }
  decisionSalary(decision: string): Observable<any[]> {
    const url = this.dataSalary + decision;
    return this.http.get<any[]>(url, httpOptions);
  }
  getDataSalaryByID(ID: number): Observable<any[]> {
    const url = this.dataSalaryByID + ID;
    return this.http.get<any[]>(url, httpOptions);
  }
  getDataCalculation(): Observable<any[]> {
    return this.http.get<any[]>(this.calculation, httpOptions);
  }
  updateDataCalculation(formData: FormData): Observable<any> {
    return this.http.post<any>(this.updateCalculation, formData);
  }
  insertIncreaseSalary(formData: FormData): Observable<any> {
    return this.http.post<any>(this.increaseSalary, formData);
  }
  insertAdvanceSalary(formData: FormData): Observable<any> {
    return this.http.post<any>(this.advanceSalary, formData);
  }
  //end salary

  //test
  test = 'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/salary/getData';

  //dashboard
  dataChart = 'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/token/getDataChart';
  getDataChart(): Observable<any> {
    return this.http.get<any>(this.dataChart);
  }
  //training
  insertTraining =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/training/insertData';
  dataTraining =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/training/getData';
  dataTrainingById =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/training/getDataById/';
  approvalTraining =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/training/insertDataParticipate';
  getDataParticipate =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/training/getDataParticipate/';
  getDataProcess =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/training/getDataProcess/';
  updateDataProcess =
    'https://qlnhansupvp.herokuapp.com/hrm/HRM-BE/training/updateDataProcess';
  insertDataTraining(formData: FormData): Observable<any> {
    return this.http.post<any>(this.insertTraining, formData);
  }
  getDataTraining(): Observable<any[]> {
    return this.http.get<any[]>(this.dataTraining, httpOptions);
  }
  dataFileTraining(file: string): Observable<any[]> {
    const url = this.dataTraining + file;
    return this.http.get<any[]>(url, httpOptions);
  }
  getDataTrainingByID(ID: number): Observable<any[]> {
    const url = this.dataTrainingById + ID;
    return this.http.get<any[]>(url, httpOptions);
  }
  getDataParticipateByID(ID: string): Observable<any[]> {
    const url = this.getDataParticipate + ID;
    return this.http.get<any[]>(url, httpOptions);
  }
  getDataProcessByID(ID: string): Observable<any[]> {
    const url = this.getDataProcess + ID;
    return this.http.get<any[]>(url, httpOptions);
  }
  insertDataParticipate(formData: FormData): Observable<any> {
    return this.http.post<any>(this.approvalTraining, formData);
  }
  insertDataProcess(formData: FormData): Observable<any> {
    return this.http.post<any>(this.updateDataProcess, formData);
  }
}
