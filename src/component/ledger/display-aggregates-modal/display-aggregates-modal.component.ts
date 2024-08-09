import {Component, OnDestroy, OnInit} from '@angular/core';
import {EntryService} from "../../../service/entry-service";
import {CategoryService} from "../../../service/category-service";
import {ModalService} from "../../../service/modal.service";
import {Subscription} from "rxjs";
import {Category} from "../../../model/Category";
import {Type} from "../../../enums/Type";
import {HttpStatusCode} from "@angular/common/http";
import {Router} from "@angular/router";
import {DateHelper} from "../../../util/date-helper";

@Component({
  selector: 'display-aggregates-modal',
  templateUrl: './display-aggregates-modal.component.html',
  styleUrl: './display-aggregates-modal.component.css'
})
export class DisplayAggregatesModalComponent implements OnInit, OnDestroy {

  isVisible: boolean = false;
  categories: Category[] = [];
  incomeCategories: Category[] = [];
  expenseCategories: Category[] = [];
  days: number[] = [];
  months: string[] = [];
  years: number[] = [];
  selectedDay: number = new Date().getDay();
  selectedMonth: string = DateHelper.getMonthName(new Date().getMonth());
  previousSelectedMonth: string = DateHelper.getMonthName(new Date().getMonth());
  selectedYear: number = new Date().getFullYear();
  aggregatesMap: Map<string, number[]> = new Map();

  //Subscriptions
  private modalVisibilitySubscription: Subscription | undefined;
  private getCategoriesSubscription: Subscription | undefined;
  private getEntryAggregatesSubscription: Subscription | undefined;

  constructor(private modalService: ModalService,
              private entryService: EntryService,
              private categoryService: CategoryService,
              private router: Router) {
  }

  ngOnInit(): void {
      this.modalVisibilitySubscription = this.modalService.isModalVisible(DisplayAggregatesModalComponent.toString()).subscribe({
        next: isVisible => this.isVisible = isVisible
      });
      this.getCategoriesSubscription = this.categoryService.getSubject().subscribe({
        next: categories => {
          this.categories = categories;
          this.incomeCategories = categories.filter(category => category.type === Type.INCOME);
          this.expenseCategories = categories.filter(category => category.type === Type.EXPENSE);
          this.initializeAggregates();
        }
      });

      this.days = DateHelper.getDaysOfMonthAndYear(this.selectedMonth, this.selectedYear);
      this.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      this.years = [2020, 2021, 2022, 2023, 2024]; //TODO Add only years that have entries;
  }

  ngOnDestroy(): void {
    this.modalVisibilitySubscription?.unsubscribe();
    this.getCategoriesSubscription?.unsubscribe();
    this.getEntryAggregatesSubscription?.unsubscribe();
  }

  closeModal() {
    this.modalService.hideModal(DisplayAggregatesModalComponent.toString());
  }

  initializeAggregates() {

      const selectedDate = new Date();
      selectedDate.setFullYear(this.selectedYear, DateHelper.getMonthNumber(this.selectedMonth), this.selectedDay);

      this.getEntryAggregatesSubscription = this.entryService.getEntryAggregatesByCategoryAndDate(this.categories, selectedDate).subscribe({
        next: (response: any) => {
          if (response.status == HttpStatusCode.Ok.valueOf()) {

            const map = new Map<string, number[]>();
            for (const key in response.body) {
              if (response.body.hasOwnProperty(key)) {
                map.set(key, response.body[key].map((e: number) => e / 100));
              }
            }
            this.aggregatesMap = map;
          }
          else {
            alert(response.message);
          }
        },
        error: (response: any) => {
          if (response.status === HttpStatusCode.Unauthorized.valueOf()) {
            this.router.navigateByUrl('/login').then(() => {});
            alert("Your session has expired");
          }
          else {
            alert(response.message);
          }
        }
      })
  }

  getSumsByCategoryUUID(categoryUUI: string) {
    const aggregates = this.aggregatesMap.get(categoryUUI);

    return aggregates !== undefined && aggregates.length === 4 ? aggregates : [0,0,0,0];
  }

  getTotalSums() {
    const totalSums = [0,0,0,0];

    this.incomeCategories.forEach(category => {
      const sumsOfCategory = this.aggregatesMap.get(category.uuid);
      if (sumsOfCategory !== undefined) {
        totalSums[0] += sumsOfCategory[0];
        totalSums[1] += sumsOfCategory[1];
        totalSums[2] += sumsOfCategory[2];
        totalSums[3] += sumsOfCategory[3];
      }
    });

    this.expenseCategories.forEach(category => {
      const sumsOfCategory = this.aggregatesMap.get(category.uuid);
      if (sumsOfCategory !== undefined) {
        totalSums[0] -= sumsOfCategory[0];
        totalSums[1] -= sumsOfCategory[1];
        totalSums[2] -= sumsOfCategory[2];
        totalSums[3] -= sumsOfCategory[3];
      }
    });

    return totalSums;
  }

  onDayChanged() {
    this.initializeAggregates();
  }

  onMonthChanged() {
    //TODO This does not work!
    this.days = DateHelper.getDaysOfMonthAndYear(this.selectedMonth, this.selectedYear);
    const lastDayOfSelectedMonth = DateHelper.getLastDayOfMonth(this.selectedMonth, this.selectedYear);
    const lastDayOfPreviouslySelectedMonth = DateHelper.getLastDayOfMonth(this.previousSelectedMonth, this.selectedYear);
    if (this.selectedDay !== lastDayOfSelectedMonth && this.selectedDay === lastDayOfPreviouslySelectedMonth) {
      this.selectedDay = lastDayOfSelectedMonth;
    }
    this.previousSelectedMonth = this.selectedMonth;
    this.initializeAggregates();
  }

  onYearChanged() {
    this.days = DateHelper.getDaysOfMonthAndYear(this.selectedMonth, this.selectedYear);
    if (!DateHelper.isLeapYear(this.selectedYear) && this.selectedMonth === 'February' && this.selectedDay === 29) {
      this.selectedDay = 28;
    }
    this.initializeAggregates();
  }



  protected readonly EntryType = Type;
}
