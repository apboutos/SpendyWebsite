import {Injectable} from "@angular/core";
import {BehaviorSubject, map, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalVisibility = new BehaviorSubject<Map<string,boolean>>(new Map);


  public showModal(modalId: string) {
    const visibilityMap = this.modalVisibility.getValue();
    visibilityMap.set(modalId, true);
    this.modalVisibility.next(visibilityMap);
  }

  public hideModal(modalId: string) {
    const visibilityMap = this.modalVisibility.getValue();
    visibilityMap.set(modalId, false);
    this.modalVisibility.next(visibilityMap);
  }

  public isModalVisible(modalId: string): Observable<boolean> {
     return this.modalVisibility.pipe(map(visibilityMap => visibilityMap.get(modalId) || false));
  }
}



