import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MockInfoRecruit } from 'src/app/mock-info-recruit';
import { InfoRecruit } from 'src/app/info-recruit';
import { RequestApiService } from 'src/app/services/request-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-recruit',
  templateUrl: './view-recruit.component.html',
  styleUrls: ['./view-recruit.component.css'],
})
export class ViewRecruitComponent implements AfterViewInit {
  inforRecruit!: InfoRecruit;
  dataRecruitment: InfoRecruit[] = [];
  clickedRows = new Set<InfoRecruit>();
  response: any[] = [];
  icon: number = 1;
  pageIndex: number = 1;
  pageSize: number = 1;
  deleteRow: string = '[class.demo-row-is-clicked]="clickedRows.has(row)"';

  constructor(
    private requestApiService: RequestApiService,
    private autService: AuthService,
    public dialog: MatDialog,
    private router: Router
  ) {}
  // displayedColumns: string[] = ['ID','department', 'position', 'require', 'describe', 'amount', 'benefit', 'approval', 'action'];
  displayedColumns: string[] = [
    'ID',
    'department',
    'position',
    'amount',
    'approval',
    'action',
  ];
  dataSource = new MatTableDataSource<InfoRecruit>(this.dataRecruitment);

  @ViewChild(MatTable) table!: MatTable<InfoRecruit>;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const token = this.autService.decodeToken();
    if (token.data.role > 1) {
      this.router.navigate(['/dashboard']);
    }
    this.getData();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
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
  getPageIndex(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  // openDialogUpdateRecruit(): void {
  //   const dialogRef = this.dialog.open(DialogUpdateRecruit, {
  //     width: '80%'
  //   });
  // }

  getData() {
    this.requestApiService.getDataRecruitment().subscribe(
      (value) => {
        this.dataSource.data = value;
        console.log(value);
      },
      (err) => console.log(err)
    );
  }
  approval(
    ID: number,
    approval: number,
    index: number,
    pageIndex: number,
    pageSize: number
  ) {
    // const icon =  document.querySelector('.iconApproval');
    // if(icon) approval == 1 ? icon.innerHTML = 'done_all' : icon.innerHTML = 'clear';
    this.icon = approval;
    const newRecruitment = {
      ID: ID,
      approval: approval,
    };
    const toJson = JSON.stringify(newRecruitment);

    const formData: FormData = new FormData();
    formData.append('recruitment', toJson);
    this.requestApiService.updateDataRecruitment(formData).subscribe((res) => {
      if (this.paginatior.pageIndex > 0) {
        const pos =
          this.paginatior.pageSize * this.paginatior.pageIndex + index;
        console.log(pos);
        this.dataSource.data[pos].approval = res.approval;
      } else {
        console.log(index);
        this.dataSource.data[index].approval = res.approval;
      }
    });
  }

  delete(ID: number, index: number, pageIndex: number, pageSize: number) {
    const deleteRecruit = {
      ID: ID,
    };
    const toJson = JSON.stringify(deleteRecruit);
    const formData: FormData = new FormData();
    formData.append('recruitment', toJson);
    const table = document.querySelector('table');
    const tr = table?.querySelectorAll('tr');
    // console.log(tr?.item(2));
    console.log(index);

    if (index == 0) {
      if (tr) tr.item(index + 1).className += ' demo-row-is-clicked';
      this.table.renderRows();
    } else {
      if (tr) tr.item(index + 1).className += ' demo-row-is-clicked';
      this.table.renderRows();
    }

    // if(pageIndex >0){
    //   const pos = (pageSize* pageIndex) + index ;
    //   console.log(pos);
    //   // delete this.dataSource.data[pos];

    //   ;
    // }else{
    //   console.log(index);
    //   delete this.dataSource.data[index];
    // }
    // this.clickedRows.clear()
    // this.clickedRows.delete(this.inforRecruit)
    this.requestApiService.deleteDataRecruitment(formData).subscribe(
      (value) => {
        // this.dataSource.data = value;
        console.log(value);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

// export interface PeriodicElement {
//   code: number;
//   department: string;
//   position: string;
//   require: string;
//   describe: string;
//   amount: number;
//   benefit: string;
//   approval: boolean;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {code: 1, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 2, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 3, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 4, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 5, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 6, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 7, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 8, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 9, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 10, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 11, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 12, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 13, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 14, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 15, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 16, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 17, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 18, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 19, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
//   {code: 20, department: 'IT', position: 'frontend', require: 'HTML, CSS, JS', describe: 'làm giao diện web', amount: 3, benefit: 'lương thưởng tốt', approval: true},
// ];
