
import {Entry} from "../../model/Entry";

import {ModalService} from "../../service/modal.service";
import {ManageCategoriesModalComponent} from "./manage-categories-modal/manage-categories-modal.component";
import {Router} from "@angular/router";
import {CategoryService} from "../../service/category-service";
import {Category} from "../../model/Category";
import {Subscription} from "rxjs";
import {HttpStatusCode} from "@angular/common/http";
import {EntryType} from "../../enums/EntryType";
import {v4 as uuid} from "uuid";
import {Component, OnDestroy, OnInit} from "@angular/core";
import { DisplayAggregatesModalComponent } from "./display-aggregates-modal/display-aggregates-modal.component";
import * as Highcharts from 'highcharts';
import {EntryService} from "../../service/entry-service";

@Component({
  selector: 'ledger',
  templateUrl: 'ledger-component.html',
  styleUrl: './ledger-component.css'
})
export class LedgerComponent implements OnInit, OnDestroy {

  protected readonly EntryType = EntryType;
  entries: Entry[] = [];
  newEntry: Entry = Entry.emptyEntry();
  editedEntry: Entry = Entry.emptyEntry();
  entryTypes = Object.values(EntryType);
  categories: Category[] = [];
  incomeCategories: Category[] = [];
  expenseCategories: Category[] = [];
  editEntryFilteredCategories: Category[] = [];
  newEntryFilteredCategories: Category[] = [];

  selectedDate: Date = new Date();
  selectedDateString: string = '';

  //Subscriptions
  private categoriesSubjectSubscription = new Subscription();
  private entriesSubjectSubscription = new Subscription();
  private getAllCategoriesSubscription = new Subscription();
  private getAllEntriesSubscription = new Subscription();
  private createEntrySubscription = new Subscription();
  private deleteEntrySubscription = new Subscription();
  private updateEntrySubscription = new Subscription();

  constructor(private entryService: EntryService,
              private categoryService: CategoryService,
              private modalService: ModalService,
              private router: Router) {
  }

  ngOnDestroy(): void {
        this.getAllCategoriesSubscription.unsubscribe();
        this.getAllEntriesSubscription.unsubscribe();
        this.categoriesSubjectSubscription.unsubscribe();
        this.entriesSubjectSubscription.unsubscribe();
        this.createEntrySubscription.unsubscribe();
        this.deleteEntrySubscription.unsubscribe();
        this.updateEntrySubscription.unsubscribe();
    }



  ngOnInit(): void {

    this.categoriesSubjectSubscription = this.categoryService.getSubject().subscribe({
      next: categories => {
        this.categories = categories;
        this.incomeCategories = categories.filter(c => c.type === EntryType.INCOME);
        this.expenseCategories = categories.filter(c => c.type === EntryType.EXPENSE);
        this.newEntryFilteredCategories = this.expenseCategories;
      }
    });
    this.entriesSubjectSubscription = this.entryService.getSubject().subscribe({
      next: entries => {this.entries = entries}
    });
    this.initialiseCategories();
    this.initialiseEntries();

    this.selectedDateString = this.formatDate(new Date());
  }

  onNewDateSelected() {
    this.initialiseEntries();
  }

  onPreviousDayButtonClick() {
    this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() - 1).valueOf());
    this.initialiseEntries();
  }

  onNextDayButtonClick() {
    this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() + 1).valueOf());
    this.initialiseEntries();
  }

  formatDate(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private initialiseCategories(): void {
    this.getAllCategoriesSubscription = this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        const categories: Category[] = [];
        response.body.forEach((category: any) => {
          categories.push(new Category(
            category.uuid,
            category.name,
            category.type,
            category.date,
            category.lastUpdate,
            category.isDeleted,
            false));
        } )
        this.categoryService.publishCategories(categories);
      },
      error: (response: any)=> {
        if (response.status === HttpStatusCode.Unauthorized.valueOf()) {
          this.router.navigateByUrl('/login').then(() => {});
          alert("Your session has expired");
        }
        else {
          alert(response.message)
        }
      }
    });
  }

  private initialiseEntries(): void {
    this.getAllEntriesSubscription = this.entryService.getEntriesByDate(this.selectedDate.toISOString()).subscribe({
      next: (response: any) => {
        if (response.status === HttpStatusCode.Ok.valueOf()) {
          const entries: Entry[] = [];
          response.body.forEach((entry: any) => {
            entries.push(new Entry(
                  entry.uuid,
                  entry.type,
                  entry.category,
                  entry.description,
                  entry.price,
                  entry.date,
                  entry.lastUpdate,
                  entry.isDeleted,
                  false
            ));
          });
          this.entryService.publishEntries(entries);
        }
      },
      error: (response: any) => {
        if (response.status === HttpStatusCode.Unauthorized.valueOf()) {
          this.router.navigateByUrl('/login').then(() => {});
          alert("Your session has expired");
        }
        else {
          alert(response.message)
        }
        alert(response.message());
      }
    });
  }

  getCategoryName(uuid: string) {
    return this.categories.filter(category => category.uuid === uuid)[0].name;
  }

  onManageCategoriesClick() {
    this.modalService.showModal(ManageCategoriesModalComponent.toString());
  }

  onDisplaySummaryClick() {
    this.modalService.showModal(DisplayAggregatesModalComponent.toString());
  }

  onEntryTypeChange() {
    if (this.newEntry.type === EntryType.INCOME) {
      this.newEntryFilteredCategories = this.incomeCategories;
    }
    else if (this.newEntry.type === EntryType.EXPENSE) {
      this.newEntryFilteredCategories = this.expenseCategories;
    }
    else {
      this.newEntryFilteredCategories = [];
    }

    if (this.editedEntry.type === EntryType.INCOME) {
      this.editEntryFilteredCategories = this.incomeCategories;
    }
    else if (this.editedEntry.type === EntryType.EXPENSE) {
      this.editEntryFilteredCategories = this.expenseCategories;
    }
    else {
      this.editEntryFilteredCategories = [];
    }
  }

  addEntry() {
      this.createEntrySubscription = this.entryService.createEntry(new Entry(
        uuid(),
        this.newEntry.type,
        this.newEntry.category,
        this.newEntry.description,
        this.newEntry.price,
        new Date(),
        new Date(),
        false,
        false
      )).subscribe({
        next: response => {
            if (response.status === HttpStatusCode.Created.valueOf()) {
              const body = response.body as any ;
              if (response.body) {
                this.entries.push(new Entry(
                  body.savedEntries[0].uuid,
                  body.savedEntries[0].type,
                  body.savedEntries[0].category,
                  body.savedEntries[0].description,
                  body.savedEntries[0].price / 100,
                  body.savedEntries[0].date,
                  body.savedEntries[0].lastUpdate,
                  body.savedEntries[0].isDeleted,
                  false
                ));
                this.entryService.publishEntries(this.entries);
              }
            }
        },
        error: response => {
          if (response.status === HttpStatusCode.Unauthorized.valueOf()) {
            this.router.navigateByUrl('/login').then(() => {});
            alert("Your session has expired");
          }
          else {
            alert(response.message);
          }
        }
      });
    }

  editEntry(index: number) {
    this.entries[index].isBeingEdited = true;
    this.editedEntry.uuid = this.entries[index].uuid;
    this.editedEntry.type = this.entries[index].type;
    this.editedEntry.category = this.entries[index].category;
    this.editedEntry.description = this.entries[index].description;
    this.editedEntry.price = this.entries[index].price;
    this.editedEntry.createdAt = this.entries[index].createdAt;
    this.editedEntry.lastUpdate = this.entries[index].lastUpdate;
    this.editedEntry.isDeleted = this.entries[index].isDeleted;

    this.onEntryTypeChange();
  }

  removeEntry(index: number) {
    this.deleteEntrySubscription = this.entryService.deleteEntry(this.entries[index]).subscribe({
      next: response => {
        if (response.status === HttpStatusCode.NoContent.valueOf()) {
          this.entries.splice(index, 1);
          this.entryService.publishEntries(this.entries);
        }
        else if (response.status === HttpStatusCode.Conflict.valueOf()) {
          alert("Entry could not be deleted");
        }
      },
      error: response => {
        if (response.status === HttpStatusCode.Unauthorized.valueOf()) {
          this.router.navigateByUrl('/login').then(() => {});
          alert("Your session has expired");
        }
        else {
          alert(response.message);
        }
      }
    });
  }

  saveEntryEdit(index: number) {

    this.editedEntry.createdAt = new Date();
    this.editedEntry.lastUpdate = new Date();
    this.editedEntry.isDeleted = false;

    this.updateEntrySubscription = this.entryService.updateEntry(this.editedEntry).subscribe({
      next: response => {
          if (response.status === HttpStatusCode.Ok.valueOf()) {
            const body = response.body as any;

            this.entries[index].uuid = body.updatedEntries[0].uuid;
            this.entries[index].type = body.updatedEntries[0].type;
            this.entries[index].category = body.updatedEntries[0].category;
            this.entries[index].description = body.updatedEntries[0].description;
            this.entries[index].price = body.updatedEntries[0].price / 100;
            this.entries[index].createdAt = body.updatedEntries[0].date;
            this.entries[index].lastUpdate = body.updatedEntries[0].lastUpdate;
            this.entries[index].isDeleted = body.updatedEntries[0].isDeleted;
            this.entries[index].isBeingEdited = false;
            this.editedEntry = Entry.emptyEntry();
            this.entryService.publishEntries(this.entries);
          }
          else if (response.status === HttpStatusCode.Conflict.valueOf()) {
            alert("Could not update entry");
            this.entries[index].isBeingEdited = false;
            this.editedEntry = Entry.emptyEntry();
          }
      },
      error: response => {
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

  cancelEntryEdit(index: number) {
    this.entries[index].isBeingEdited = false;
  }

}

