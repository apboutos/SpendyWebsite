import {Component} from "@angular/core";
import Highcharts from "highcharts";
import {DateHelper} from "../../../util/date-helper";

@Component({
  selector: 'pie-chart',
  templateUrl: 'pie-chart.component.html',
  styleUrl: 'pie-chart.component.css'
})
export class PieChartComponent {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  summaryType: string = 'Daily';
  days = DateHelper.getDaysOfMonthAndYear('January',2024);
  months = DateHelper.getMonthNames();
  years = [2020,2021,2022,2023,2024];
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor() {
    this.chartOptions = {
      chart: {
        type: 'pie'
      },
      title: {
        text: ''
      },
      series: [{
        type: 'pie',
        name: 'Data',
        data: [
          { name: 'Incomes', y: 3100 },
          { name: 'Expenses', y: 2200 },
          { name: 'Investments', y: 900 }
        ],
        showInLegend: true,
      }],
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom'
      }
    };
  }

  log() {
    console.log(this.summaryType);
  }

  onNewDateRangeSelected() {

  }
}
