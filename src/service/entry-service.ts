import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Environment} from "../environment";
import {Entry} from "../model/Entry";
import {Category} from "../model/Category";
import {DateHelper} from "../util/date-helper";


@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private ENTRIES_URL=`${Environment.SPENDY_API_PRODUCTION_URL}/api/v1/entries`
  private entriesSubject = new BehaviorSubject<Entry[]>([]);

  constructor(private httpClient: HttpClient) {

  }

  public publishEntries(entries: Entry[]) {
    this.entriesSubject.next(entries);
  }

  public getSubject() {
    return this.entriesSubject;
  }

  public getEntriesByDateRange(startingDate: Date, endingDate: Date) {
    const headers = this.getAuthenticationHeaders();

    return this.httpClient.get(
      `${this.ENTRIES_URL}/dateRange?startingDate=${startingDate.toISOString()}&endingDate=${endingDate.toISOString()}`,
      {headers, observe: 'response'},
    )
  }

  public createEntry(entry: Entry) {
    const headers = this.getAuthenticationHeaders();
    return this.httpClient.post(this.ENTRIES_URL,[{
      "uuid": entry.uuid,
      "type": entry.type.toString(),
      "category": entry.category,
      "description": entry.description,
      "price": (entry.price * 100),
      "date": entry.createdAt.toISOString(),
      "lastUpdate": entry.lastUpdate.toISOString(),
      "isDeleted": entry.isDeleted
    }], {headers, observe: 'response'});
  }


  public deleteEntry(entry: Entry) {
    const headers = this.getAuthenticationHeaders();
    return this.httpClient.delete(`${this.ENTRIES_URL}?entryUUIDs=${entry.uuid}`,{headers, observe: 'response'});
  }

  public updateEntry(entry: Entry) {
    const headers = this.getAuthenticationHeaders();
    return this.httpClient.put(this.ENTRIES_URL,[{
      "uuid": entry.uuid,
      "type": entry.type.toString(),
      "category": entry.category,
      "description": entry.description,
      "price": (entry.price * 100),
      "date": entry.createdAt.toISOString(),
      "lastUpdate": entry.lastUpdate.toISOString(),
      "isDeleted": entry.isDeleted
    }], {headers, observe: 'response'});
  }

  public replaceCategory(oldCategory: Category, newCategory: Category) : Observable<Object> {

    const headers = this.getAuthenticationHeaders();

    return this.httpClient.put(
      `${this.ENTRIES_URL}/replaceCategory?oldCategoryUUID=${oldCategory.uuid}&newCategoryUUID=${newCategory.uuid}`,
      {},
      {headers, observe: 'response'}
    );
  }

  public deleteEntriesByCategory(category: Category) {
    const headers = this.getAuthenticationHeaders();

    return this.httpClient.delete(
      `${this.ENTRIES_URL}/category?categoryUUID=${category.uuid}`,
      {headers, observe: 'response'}
    );
  }

  public getEntryPriceSumByCategoryAndDateRange(categories: Category[], startingDate: Date, endingDate: Date) {
    const headers = this.getAuthenticationHeaders();
    const urlCategories = categories.map(c => c.uuid).join(',');

    return this.httpClient.get(`${this.ENTRIES_URL}/aggregates/by-category?categories=${urlCategories}&startingDate=${startingDate.toISOString()}&endingDate=${endingDate.toISOString()}`,
      {headers, observe: 'response'})
  }

  public getPriceSumsByCategoryYearAndMonth(categories: Category[], year: string, months: string[]) {
    const headers = this.getAuthenticationHeaders();
    const urlCategories = categories.map(c => c.uuid).join(',');
    const monthsString = months.join(',');
    const timezoneOffset = DateHelper.getTimezoneOffsetAsURLString();

    return this.httpClient.get(`${this.ENTRIES_URL}/aggregates/by-category-year-months?categories=${urlCategories}&year=${year}&months=${monthsString}&timezoneOffset=${timezoneOffset}`, {headers, observe: 'response'});
  }

  private getAuthenticationHeaders(): HttpHeaders {
    const authToken = sessionStorage.getItem('token');
    return  new HttpHeaders().append('Authorization', `Bearer ${authToken}`);
  }

}
