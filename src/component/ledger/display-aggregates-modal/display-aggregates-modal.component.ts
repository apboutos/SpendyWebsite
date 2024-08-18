import {Component, OnDestroy, OnInit} from '@angular/core';
import {EntryService} from "../../../service/entry-service";
import {CategoryService} from "../../../service/category-service";
import {ModalService} from "../../../service/modal.service";
import {Subscription} from "rxjs";
import {Category} from "../../../model/Category";
import {Type} from "../../../enums/Type";
import {HttpStatusCode} from "@angular/common/http";
import {Router} from "@angular/router";
import {TypeOrder} from "../../../enums/TypeOrder";

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
  investmentCategories: Category[] = [];
  savingCategories: Category[] = [];
  selectedYear: string = '2024';
  yearsWithEntries: string[] = [];
  displayedMonths: string[] = [];
  aggregatesMap: Map<string, number[]> = new Map();

  //Subscriptions
  private modalVisibilitySubscription: Subscription | undefined;
  private getCategoriesSubscription: Subscription | undefined;
  protected readonly Type = Type;

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
          this.categories.sort((a, b) => TypeOrder[a.type.valueOf()] - TypeOrder[b.type.valueOf()]);
          this.incomeCategories = categories.filter(category => category.type === Type.INCOME);
          this.expenseCategories = categories.filter(category => category.type === Type.EXPENSE);
          this.investmentCategories = categories.filter(category => category.type === Type.INVESTMENT);
          this.savingCategories = categories.filter(category => category.type === Type.SAVING);
          this.initializeAggregates();
        }
      });

      this.yearsWithEntries = ['2020', '2021', '2022', '2023', '2024']; //TODO Add only years that have entries;
      this.displayedMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  }

  ngOnDestroy(): void {
    this.modalVisibilitySubscription?.unsubscribe();
    this.getCategoriesSubscription?.unsubscribe();
  }

  closeModal() {
    this.modalService.hideModal(DisplayAggregatesModalComponent.toString());
  }

  initializeAggregates() {

      this.entryService.getPriceSumsByCategoryYearAndMonth(this.categories, this.selectedYear, this.displayedMonths).subscribe({
        next: (response: any) => {
          if (response.status == HttpStatusCode.Ok.valueOf()) {

            const map = new Map<string, number[]>();

            for (const key in response.body) {
              if (response.body.hasOwnProperty(key)) {
                map.set(key, response.body[key].map((e: number) => e / 100));
              }
            }
            this.aggregatesMap = map;
            console.log(map);
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

  getSumByCategoryUUIDAndMonth(categoryUUI: string, month: number) {
    const sumsOfCategory = this.aggregatesMap.get(categoryUUI);

    return sumsOfCategory !== undefined ? sumsOfCategory[month] : 0;
  }

  onYearChanged() {
    this.initializeAggregates();
  }
}
