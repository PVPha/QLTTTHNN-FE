import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { EditorMatFormControlDirective } from './editor-mat-form-control.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, DialogChangePass } from './app.component';
import { ListDatabaseComponent } from './components/users/list-database/list-database.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddRecruitComponent } from './components/recruitment/infor-recruit/add-recruit/add-recruit.component';
import { ViewRecruitComponent } from './components/recruitment/infor-recruit/view-recruit/view-recruit.component';
import { AddCandidateProfilesComponent } from './components/recruitment/candidateProfiles-management/add-candidate-profiles/add-candidate-profiles.component';
import {
  DialogInterviewSchedule,
  ViewCandidateProfilesComponent,
  DialogDetailCandidateProfile,
  DialogHiringDecision,
} from './components/recruitment/candidateProfiles-management/view-candidate-profiles/view-candidate-profiles.component';
import { ViewInterviewScheduleComponent } from './components/recruitment/interview-schedule/view-interview-schedule/view-interview-schedule.component';
import { AddStaffProfilesComponent } from './components/records-management/staff-profiles/add-staff-profiles/add-staff-profiles.component';
import {
  ViewStaffProfilesComponent,
  DialogCancelContract,
  DialogRelative,
  DialogCertificateManament,
  DialogWorkProcess,
  DialogReward,
  DialogDiscipline,
  DialogAppoint,
  DialogDetailStaffProfile,
  DialogAllowance,
  DialogTaxInsurance,
} from './components/records-management/staff-profiles/view-staff-profiles/view-staff-profiles.component';
import { AddTrainingComponent } from './components/training-management/training/add-training/add-training.component';
import {
  ViewListTrainingComponent,
  DialogRegistration,
  DialogDetailTraining,
} from './components/training-management/training/view-list-training/view-list-training.component';
import {
  ViewListStaffParticipateComponent,
  DialogTrainingProcess,
} from './components/training-management/training/view-list-staff-participate/view-list-staff-participate.component';
import {
  DialogAbsent,
  DialogComplain,
  DialogUpload,
  DialogMission,
  ViewTableTimekeepingComponent,
} from './components/timekeeping-management/table-timekeeping/view-table-timekeeping/view-table-timekeeping.component';
import {
  DialogAdvanceSalary,
  DialogCalculations,
  DialogIncreaseSalary,
  ViewTableSalaryComponent,
} from './components/salary-management/table-salary/view-table-salary/view-table-salary.component';
import { TestComponent } from './components/test/test.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DetailRecruitComponent } from './components/recruitment/infor-recruit/detail-recruit/detail-recruit.component';
import { Interceptor } from './interceptor';
import { ChartsModule } from 'ng2-charts';
import { LoginComponent } from './components/users/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorMatFormControlDirective,
    ListDatabaseComponent,
    DashboardComponent,
    AddRecruitComponent,
    ViewRecruitComponent,
    AddCandidateProfilesComponent,
    ViewCandidateProfilesComponent,
    ViewInterviewScheduleComponent,
    DialogInterviewSchedule,
    DialogDetailCandidateProfile,
    DialogHiringDecision,
    AddStaffProfilesComponent,
    ViewStaffProfilesComponent,
    DialogCancelContract,
    DialogRelative,
    AddTrainingComponent,
    ViewListTrainingComponent,
    ViewListStaffParticipateComponent,
    DialogRegistration,
    DialogTrainingProcess,
    DialogCertificateManament,
    DialogWorkProcess,
    DialogReward,
    DialogDiscipline,
    DialogAppoint,
    ViewTableTimekeepingComponent,
    DialogMission,
    DialogAbsent,
    DialogComplain,
    DialogUpload,
    DialogIncreaseSalary,
    DialogAdvanceSalary,
    ViewTableSalaryComponent,
    DialogDetailStaffProfile,
    TestComponent,
    DetailRecruitComponent,
    DialogTaxInsurance,
    DialogAllowance,
    DialogCalculations,
    DialogDetailTraining,
    LoginComponent,
    DialogChangePass,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    MatSliderModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatDialogModule,
    MatStepperModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    ChartsModule,
    MatSortModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
