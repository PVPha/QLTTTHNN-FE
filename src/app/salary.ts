export interface Salary {
  id_salary: string;
  id_staff: string;
  fullName: string;
  position: string;
  department: string;
  salary: number;
  coefficientSalary: number;
  workDay: number;
  reward: number;
  subsidy: number; // trợ cấp
  allowance: number; // phụ cấp
  tax: number;
  overtime: number;
  insurance: number;
  advance: number; // ứng trước
  discipline: number; //phạt
  workDay_salary: number;
  kpi_salary: number;
  sale_salary: number;
  received: number;
}
