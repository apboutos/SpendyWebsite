import {NgModule} from "@angular/core";
import {ManageCategoriesModalComponent} from "./manage-categories-modal.component";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";

@NgModule({
  declarations: [ManageCategoriesModalComponent],
  imports: [
    FormsModule, NgIf, NgForOf, NgClass, NgOptimizedImage
  ],
  exports: [ManageCategoriesModalComponent]
  })
export class ManageCategoriesModalModule {

}
