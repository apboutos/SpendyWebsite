import {Component, OnDestroy, OnInit} from "@angular/core";
import {ModalService} from "../../../service/modal.service";
import {Category} from "../../../model/Category";
import {CategoryService} from "../../../service/category-service";
import {v4 as uuid} from "uuid";
import {EntryType} from "../../../enums/EntryType";
import {Router} from "@angular/router";
import {EntryService} from "../../../service/entry-service";
import {HttpStatusCode} from "@angular/common/http";
import {Subscription} from "rxjs";

@Component({
  selector: 'manage-categories-modal',
  templateUrl: 'manage-categories-modal.component.html',
  styleUrl: 'manage-categories-modal.component.css'
})
export class ManageCategoriesModalComponent implements OnInit, OnDestroy {

  modalId: string = ManageCategoriesModalComponent.toString();
  isVisible = false;
  categoryToBeDeleted: Category = Category.emptyCategory();
  conflictResolutionIsVisible = false;
  selectedConflictOption: string = ''
  replacementCategoryName = '';
  conflictResolutionConfirmation = ''
  categoryToBeDeletedIndex: number = 0;
  categories: Category[] = [];
  newCategory: Category = Category.emptyCategory();
  editedCategory: Category = Category.emptyCategory();
  categoryTypes = Object.values(EntryType);

  private addCategorySubscription = new Subscription();
  private deleteCategorySubscription = new Subscription();
  private updateCategorySubscription = new Subscription();
  private replaceCategorySubscription = new Subscription();
  private deleteEntriesByCategorySubscription = new Subscription();

  constructor(private modalService: ModalService,
              private categoryService: CategoryService,
              private entryService: EntryService,
              private router: Router) { }

  ngOnInit() {
   this.modalService.isModalVisible(this.modalId).subscribe({
     next: value => {this.isVisible = value}
   });
   this.categoryService.getSubject().subscribe({
     next: categories => {this.categories = categories}
   });
  }

  ngOnDestroy(): void {
    this.categoryService.getSubject().unsubscribe();
    this.resetModalToCategoryDisplayPage();
    this.addCategorySubscription.unsubscribe();
    this.deleteCategorySubscription.unsubscribe();
    this.updateCategorySubscription.unsubscribe();
    this.replaceCategorySubscription.unsubscribe();
    this.deleteEntriesByCategorySubscription.unsubscribe();
  }

  closeModal() {
    this.modalService.hideModal(this.modalId);
    this.resetModalToCategoryDisplayPage();
  }


  addCategory() {
    if (this.newCategory.type && this.newCategory.name) {

      this.addCategorySubscription = this.categoryService.createCategory(new Category(uuid(),
                                                       this.newCategory.name,
                                                       this.newCategory.type,
                                                       new Date(),
                                                       new Date(),
                                                       false,
                                                       false))
        .subscribe({
          next: (response: any) => {
            this.categories.push({
              uuid: response.body.uuid,
              name: response.body.name,
              type: response.body.type,
              createdAt: response.body.date,
              lastUpdate: response.body.lastUpdate,
              isDeleted: response.body.isDeleted,
              isBeingEdited: false});
            this.categoryService.publishCategories(this.categories);
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
      this.newCategory = Category.emptyCategory();
    }
  }

  removeCategory(index: number) {
    this.deleteCategorySubscription = this.categoryService.deleteCategory(this.categories[index].uuid)
      .subscribe({
        next: (response: any) => {
          if (response.status === 204) {
            this.categories.splice(index, 1);
            this.categoryService.publishCategories(this.categories);
          }
        },
        error: (response: any) => {
          if (response.status === HttpStatusCode.Unauthorized.valueOf()) {
            this.router.navigateByUrl('/login').then(() => {});
            alert("Your session has expired");
          }
          else if (response.status === HttpStatusCode.Conflict.valueOf()) {
            this.conflictResolutionIsVisible = true;
            this.categoryToBeDeleted = this.categories[index];
            this.categoryToBeDeletedIndex = index;
          }
          else {
            alert(response.message)
          }
        }
      })
  }

  editCategory(index: number) {

    this.categories[index].isBeingEdited = true;
    this.editedCategory.uuid = this.categories[index].uuid;
    this.editedCategory.name = this.categories[index].name;
    this.editedCategory.type = this.categories[index].type;
  }

  saveCategoryEdit(index: number) {

    this.updateCategorySubscription = this.categoryService.updateCategory(new Category(
      this.editedCategory.uuid,
      this.editedCategory.name,
      this.editedCategory.type,
      this.editedCategory.createdAt,
      new Date(),
      this.editedCategory.isDeleted,
      false
    )).subscribe({
      next: (response: any) => {
        if (response.status === HttpStatusCode.Ok.valueOf()) {
          this.categories[index].isBeingEdited = false;
          this.categories[index].name = response.body.name;
          this.categories[index].type = response.body.type;
          this.categories[index].uuid = response.body.uuid;
          this.categories[index].createdAt = response.body.date;
          this.categories[index].lastUpdate = response.body.lastUpdate;
          this.categories[index].isDeleted = response.body.isDeleted;
          this.editedCategory = Category.emptyCategory();
          this.categoryService.publishCategories(this.categories);
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
    });
  }

  applyConflictResolution() {
    if (this.conflictResolutionConfirmation && this.conflictResolutionConfirmation.toLowerCase() === 'yes') {

      if (this.selectedConflictOption === 'Replace category') {

        const replacementCategory = this.categories
          .filter(category => category.name === this.replacementCategoryName)[0];

        this.replaceCategorySubscription = this.entryService.replaceCategory(this.categoryToBeDeleted, replacementCategory).subscribe({
          next: (response: any) => {
            if (response.status === 201) {
              this.categories.splice(this.categoryToBeDeletedIndex, 1);
              this.categoryService.publishCategories(this.categories);
             this.resetModalToCategoryDisplayPage();
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
        });
      }
      else if (this.selectedConflictOption === 'Delete entries') {
        this.deleteEntriesByCategorySubscription = this.entryService.deleteEntriesByCategory(this.categoryToBeDeleted).subscribe({
          next: (response: any) => {
            if (response.status === HttpStatusCode.NoContent.valueOf()) {
              this.categories.splice(this.categoryToBeDeletedIndex, 1);
              this.categoryService.publishCategories(this.categories);
              this.resetModalToCategoryDisplayPage();
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
        });
      }
    }
  }

  private resetModalToCategoryDisplayPage() {
    this.conflictResolutionIsVisible = false;
    this.selectedConflictOption = ''
    this.replacementCategoryName = ''
    this.conflictResolutionConfirmation = ''
    this.categoryToBeDeleted = Category.emptyCategory();
    this.categoryToBeDeletedIndex = 0;
  }

  cancelConflict() {
    this.resetModalToCategoryDisplayPage();
  }

  cancelCategoryEdit(index: number) {
    this.categories[index].isBeingEdited = false;
  }




}
