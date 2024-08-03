import {Component} from "@angular/core";
import Highcharts from "highcharts";

@Component({
  selector: 'bar-chart',
  templateUrl: 'bar-chart.component.html',
  styleUrl: 'bar-chart.component.css'
})
export class BarChartComponent {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  constructor() {
    // Bar chart options
    this.chartOptions = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Summary'
      },
      xAxis: {
        categories: ['Incomes', 'Expenses', 'Investments']
      },
      yAxis: {
        title: {
          text: 'Values'
        }
      },
      series: [{
        type: 'bar',
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

}
