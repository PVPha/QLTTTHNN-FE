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
    'http://localhost:81/HRM-BE/recruitment/getData';
  insertRecruitment =
    'http://localhost:81/HRM-BE/recruitment/insertData';
  deleteRecruitment =
    'http://localhost:81/HRM-BE/recruitment/deleteData';
  updateRecruitmentApi =
    'http://localhost:81/HRM-BE/recruitment/updateData';
  getRecruitmentById =
    'http://localhost:81/HRM-BE/recruitment/getDataById/';

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
    'http://localhost:81/HRM-BE/candidate/getData';
  getCandidateByID =
    'http://localhost:81/HRM-BE/candidate/getDataById/';
  insertCandidate =
    'http://localhost:81/HRM-BE/candidate/insertData';

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
    'http://localhost:81/HRM-BE/interview/insertDataSchedule';
  point =
    'http://localhost:81/HRM-BE/interview/insertDataPoint';

  insertDataSchedule(formData: FormData): Observable<Interview> {
    return this.http.post<Interview>(this.schedule, formData);
  }
  insertDataPoint(formData: FormData): Observable<Interview> {
    return this.http.post<Interview>(this.point, formData);
  }
  // end interview

  //start hiring
  hiring =
    'http://localhost:81/HRM-BE/hiring/insertDataHiring';
  insertDataHiring(formData: FormData): Observable<Hiring> {
    return this.http.post<Hiring>(this.hiring, formData);
  }
  //end hiring

  // start records management
  insert_staffProfile =
    'http://localhost:81/HRM-BE/records/insertDataStaffProfile';
  get_staffProfile =
    'http://localhost:81/HRM-BE/records/getDataStaffProfile';

  get_staffProfileByID =
    'http://localhost:81/HRM-BE/records/getDataStaffProfileByID/';
  contract =
    'http://localhost:81/HRM-BE/records/insertDataContract';
  cancel_contract =
    'http://localhost:81/HRM-BE/records/insertDataCancleContract';
  resource =
    'http://localhost:81/HRM-BE/records/insertDataResource';
  reward =
    'http://localhost:81/HRM-BE/records/insertDataReward';
  appoint =
    'http://localhost:81/HRM-BE/records/insertDataAppoint';
  discipline =
    'http://localhost:81/HRM-BE/records/insertDataDiscipline';
  tax = 'http://localhost:81/HRM-BE/records/insertDataTax';
  insurance =
    'http://localhost:81/HRM-BE/records/insertDataInsurance';
  allowance =
    'http://localhost:81/HRM-BE/records/insertDataAllowance';
  insertDataStaffProfile(formData: FormData): Observable<StaffProfiles> {
    return this.http.post<StaffProfiles>(this.insert_staffProfile, formData);
  }
  getDataStaffProfile(): Observable<StaffProfiles[]> {
    return this.http.get<StaffProfiles[]>(this.get_staffProfile, httpOptions);
  }
  decisionRecord(table: string): Observable<StaffProfiles[]> {
    const url =
      'http://localhost:81/HRM-BE/records/decision/' + table;
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
    'http://localhost:81/HRM-BE/timeKeeping/getData';
  getTimeKeepApiByID =
    'http://localhost:81/HRM-BE/timeKeeping/getDataById/';
  timeKeepApi =
    'http://localhost:81/HRM-BE/timeKeeping/insertData';
  timeKeepKPIApi =
    'http://localhost:81/HRM-BE/timeKeeping/insertDataKPI';
  timeKeepSaleApi =
    'http://localhost:81/HRM-BE/timeKeeping/insertDataSale';
  missionApi =
    'http://localhost:81/HRM-BE/timeKeeping/insertDataMission';
  absentApi =
    'http://localhost:81/HRM-BE/timeKeeping/insertDataAbsent';
  GetDataTimeKeep(): Observable<any[]> {
    return this.http.get<any[]>(this.getTimeKeepApi, httpOptions);
  }
  dataFile(table: string): Observable<any> {
    const url = this.getTimeKeepApi + table;
    return this.http.get<any>(url, httpOptions);
  }
  decisionTimeKeep(table: string): Observable<any[]> {
    const url =
      'http://localhost:81/HRM-BE/timeKeeping/decision/' +
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
  dataSalary = 'http://localhost:81/HRM-BE/salary/getData';
  dataSalaryByID =
    'http://localhost:81/HRM-BE/salary/getDataByID/';
  calculation =
    'http://localhost:81/HRM-BE/salary/getDataCalculation';
  updateCalculation =
    'http://localhost:81/HRM-BE/salary/updateDataCalculation';
  increaseSalary =
    'http://localhost:81/HRM-BE/salary/insertDataIncreaseSalary';
  advanceSalary =
    'http://localhost:81/HRM-BE/salary/insertDataAdvanceSalary';
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
  test = 'http://localhost:81/HRM-BE/salary/getData';

  //dashboard
  dataChart = 'http://localhost:81/HRM-BE/token/getDataChart';
  getDataChart(): Observable<any> {
    return this.http.get<any>(this.dataChart);
  }
  //training
  insertTraining =
    'http://localhost:81/HRM-BE/training/insertData';
  dataTraining =
    'http://localhost:81/HRM-BE/training/getData';
  dataTrainingById =
    'http://localhost:81/HRM-BE/training/getDataById/';
  approvalTraining =
    'http://localhost:81/HRM-BE/training/insertDataParticipate';
  getDataParticipate =
    'http://localhost:81/HRM-BE/training/getDataParticipate/';
  getDataProcess =
    'http://localhost:81/HRM-BE/training/getDataProcess/';
  updateDataProcess =
    'http://localhost:81/HRM-BE/training/updateDataProcess';
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
