import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import {
  MultiDataSet,
  Label,
  SingleDataSet,
  monkeyPatchChartJsTooltip,
  monkeyPatchChartJsLegend,
} from 'ng2-charts';
import { RequestApiService } from 'src/app/services/request-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  //doughnut
  public doughnutChartLabels: Label[] = ['Thôi việc', 'Chính thức', 'Thử việc'];
  public doughnutChartData: MultiDataSet = [[0, 0, 0]];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartColors = [
    {
      backgroundColor: [
        'rgba(255,0,0,0.3)',
        'rgba(0,255,0,0.5)',
        'rgba(255,22,22,0.5)',
      ],
    },
  ];

  //pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Tuyển dụng'], 'Từ chối', 'Chờ'];
  public pieChartData: SingleDataSet = [0, 0, 0]; //doughnut
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: [
        'rgba(0,255,0,0.5)',
        'rgba(255,22,22,0.5)',
        'rgba(229,226,226,0.5)',
      ],
    },
  ];
  public pieChartPlugins = [];

  CT!: string;
  TV!: string;
  NV!: string;
  TD!: string;
  TC!: string;
  CH!: string;
  PV: number = 0;
  DPV: number = 0;
  LCT!: number;
  LTV!: number;
  constructor(private requestApiService: RequestApiService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    this.dataChartStaff();
  }
  dataChartStaff() {
    this.requestApiService.getDataChart().subscribe((value) => {
      console.log(value);
      this.CT = value.CT[0].data;
      this.TV = value.TV[0].data;
      this.NV = value.NV[0].data;
      this.TD = value.TD[0].data;
      this.TC = value.TC[0].data;
      this.CH = value.CH[0].data;
      this.doughnutChartData = [
        [value.NV[0].data, value.CT[0].data, value.TV[0].data],
      ];
      this.pieChartData = [
        [value.TD[0].data, value.TC[0].data, value.CH[0].data],
      ];
      this.LCT = value.LCT[0].data;
      this.LTV = value.LTV[0].data;
      this.DPV = value.DPV;
      this.PV = value.PV[0].data;
    });
  }
}
