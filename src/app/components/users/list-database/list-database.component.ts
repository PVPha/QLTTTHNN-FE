import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RequestApiService } from 'src/app/services/request-api.service';

@Component({
  selector: 'app-list-database',
  templateUrl: './list-database.component.html',
  styleUrls: ['./list-database.component.css'],
})
export class ListDatabaseComponent implements OnInit {
  constructor(
    private requestApiService: RequestApiService,
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
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatTable) table!: MatTable<any>;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
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
