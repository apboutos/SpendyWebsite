import {NgModule} from "@angular/core";
import {LedgerComponent} from "./ledger-component";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {ManageCategoriesModalModule} from "./manage-categories-modal/manage-categories-modal.module";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker
} from "@angular/material/datepicker";
import {MatInput} from "@angular/material/input";
import {DisplayAggregatesModalComponent} from "./display-aggregates-modal/display-aggregates-modal.component";
import {HighchartsChartModule} from "highcharts-angular";
import {PieChartComponent} from "./pie-chart/pie-chart.component";
import {BarChartComponent} from "./bar-chart/bar-chart.component";

@NgModule({
  exports: [LedgerComponent, DisplayAggregatesModalComponent,PieChartComponent, BarChartComponent],
  imports: [
    CommonModule,
    MatButton,
    FormsModule,
    ManageCategoriesModalModule,
    NgOptimizedImage,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatInput,
    MatSuffix,
    MatLabel,
    HighchartsChartModule,
    MatDateRangeInput,
    MatDateRangePicker
  ],
  declarations: [LedgerComponent,DisplayAggregatesModalComponent,PieChartComponent, BarChartComponent],
  providers: []
})
export class LedgerModule {

}
