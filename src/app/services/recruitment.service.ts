import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'tinymce';
import { InfoRecruit } from '../info-recruit';

@Injectable({
  providedIn: 'root'
})
export class RecruitmentService {

  constructor(
    private http: HttpClient
  ) { }

  // getRecruitment(id_recruit: string): Observable<InfoRecruit>{
  //   const url = 'http://localhost:8080/hrm/HRM-BE/recruitment/getDataById/'+id_recruit;
  //   return this.http.get<InfoRecruit>(url);
  // }
}
