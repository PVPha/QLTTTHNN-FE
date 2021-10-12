import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Test } from '../test';

const httpOptions =  {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin':'*',
    'Authorization':'authkey',
    'content-type': 'application/json'
  }
  )
}
@Injectable({
  providedIn: 'root'
})
export class TestService {
  testApi = 'http://localhost:8080/hrm/HRM-BE/testAngular_hrm/testUpdateID';
  uploadApi = 'http://localhost:8080/hrm/HRM-BE/testAngular_hrm/testUploadFile';
  timeKeepApi = 'http://localhost:8080/hrm/HRM-BE/testAngular_hrm/testTimeKeep';
  testGetApi = 'http://localhost:8080/hrm/HRM-BE/testAngular_hrm/testGet';
  testGetApiWithInterface = 'http://localhost:8080/hrm/HRM-BE/testAngular_hrm/testGetWI';
  constructor(private http: HttpClient) { }


  uploadFile(fileData: any): Observable<any>{
    // return this.http.post<any>(this.uploadApi, fileData);
    return this.http.post<any>(this.testApi, fileData);
  }
  timeKeep(formData: FormData): Observable<any>{
    return this.http.post<any>(this.timeKeepApi, formData)
  }
  sendForm(formData: FormData):Observable<any>{
    return this.http.post<any>(this.testApi,formData)
  }
  testget(): Observable<any>{
    return this.http.get<any>(this.testGetApi,httpOptions)
  }

  testGetWithInterface(): Observable<Test[]>{
    return this.http.get<Test[]>(this.testGetApiWithInterface,httpOptions)
  }
}
