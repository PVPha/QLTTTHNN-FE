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
import { AddStudentComponent } from './components/student/add-student/add-student.component';
import { ViewStudentComponent } from './components/student/view-student/view-student.component';
import { MoneyComponent } from './components/student/money/money.component';
import { AddTeacherComponent } from './components/teacher/add-teacher/add-teacher.component';
import { ViewTeacherComponent } from './components/teacher/view-teacher/view-teacher.component';
import { AddCourseComponent } from './components/course/add-course/add-course.component';
import { ViewCourseComponent } from './components/course/view-course/view-course.component';
import { JoinComponent } from './components/course/join/join.component';
import { ViewStorageComponent } from './components/storage/view-storage/view-storage.component';
import { ViewScheduleComponent } from './components/schedule/view-schedule/view-schedule.component';

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
    path: 'add-student',
    component: AddStudentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-student',
    component: ViewStudentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-money',
    component: MoneyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-teacher',
    component: AddTeacherComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-teacher',
    component: ViewTeacherComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-course',
    component: AddCourseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-course',
    component: ViewCourseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-join/:ID',
    component: JoinComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-storage',
    component: ViewStorageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-schedule',
    component: ViewScheduleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-staffProfile/:ID',
    component: AddStaffProfilesComponent,
    canActivate: [AuthGuard],
  },
  // {path: 'add-staffProfile', component: AddStaffProfilesComponent},

  { path: 'test', component: TestComponent, canActivate: [AuthGuard] },

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
