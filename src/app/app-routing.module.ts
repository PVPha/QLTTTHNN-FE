import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddStaffProfilesComponent } from './components/records-management/staff-profiles/add-staff-profiles/add-staff-profiles.component';
import { ViewStaffProfilesComponent } from './components/records-management/staff-profiles/view-staff-profiles/view-staff-profiles.component';
import { AddCandidateProfilesComponent } from './components/recruitment/candidateProfiles-management/add-candidate-profiles/add-candidate-profiles.component';
import { ViewCandidateProfilesComponent } from './components/recruitment/candidateProfiles-management/view-candidate-profiles/view-candidate-profiles.component';
import { AddRecruitComponent } from './components/recruitment/infor-recruit/add-recruit/add-recruit.component';
import { DetailRecruitComponent } from './components/recruitment/infor-recruit/detail-recruit/detail-recruit.component';
import { ViewRecruitComponent } from './components/recruitment/infor-recruit/view-recruit/view-recruit.component';
import { ViewInterviewScheduleComponent } from './components/recruitment/interview-schedule/view-interview-schedule/view-interview-schedule.component';
import { ViewTableSalaryComponent } from './components/salary-management/table-salary/view-table-salary/view-table-salary.component';
import { TestComponent } from './components/test/test.component';
import { ViewTableTimekeepingComponent } from './components/timekeeping-management/table-timekeeping/view-table-timekeeping/view-table-timekeeping.component';
import { AddTrainingComponent } from './components/training-management/training/add-training/add-training.component';
import { ViewListStaffParticipateComponent } from './components/training-management/training/view-list-staff-participate/view-list-staff-participate.component';
import { ViewListTrainingComponent } from './components/training-management/training/view-list-training/view-list-training.component';
import { ListDatabaseComponent } from './components/users/list-database/list-database.component';
import { LoginComponent } from './components/users/login/login.component';
import { AddTKBComponent } from './components/salary-management/addTKB/addTKB.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listDatabase',
    component: ListDatabaseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-recruit',
    component: AddRecruitComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-recruit',
    component: ViewRecruitComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-candidateProfile',
    component: AddCandidateProfilesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-candidateProfile',
    component: ViewCandidateProfilesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-staffProfile/:ID',
    component: AddStaffProfilesComponent,
    canActivate: [AuthGuard],
  },
  // {path: 'add-staffProfile', component: AddStaffProfilesComponent},
  {
    path: 'view-staffProfile',
    component: ViewStaffProfilesComponent,
    canActivate: [AuthGuard],
  },
  { path: 'test', component: TestComponent, canActivate: [AuthGuard] },
  {
    path: 'add-training',
    component: AddTrainingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-training',
    component: ViewListTrainingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-staffParticipate/:ID',
    component: ViewListStaffParticipateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-timekeeping',
    component: ViewTableTimekeepingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-salary',
    component: ViewTableSalaryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'detail-recruit/:ID',
    component: DetailRecruitComponent,
    canActivate: [AuthGuard],
  },
  { path: 'user', component: ListDatabaseComponent, canActivate: [AuthGuard] },
  {
    path: 'addTKB',
    component: AddTKBComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
