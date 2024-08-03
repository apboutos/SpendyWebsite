import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Category} from "../../model/Category";
import {BehaviorSubject, Observable} from "rxjs";
import {Environment} from "../../environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private CATEGORIES_URL=`${Environment.SPENDY_API_PRODUCTION_URL}/api/v1/categories`;
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  constructor(private httpClient: HttpClient) {

  }

  public publishCategories(categories: Category[]) {
    this.categoriesSubject.next(categories);
  }

  public getSubject() {
    return this.categoriesSubject;
  }

  public getAllCategories(): Observable<Object> {
    const headers = this.getAuthenticationHeaders();

    return this.httpClient.get(
      this.CATEGORIES_URL,
      {headers, observe: 'response'},
    )
  }

  public updateCategory(category: Category): Observable<Object> {
    const headers = this.getAuthenticationHeaders();

    return this.httpClient.put(
      this.CATEGORIES_URL,
      {
        uuid: category.uuid,
        name: category.name,
        type: category.type,
        date: category.createdAt.toISOString(),
        lastUpdate: category.lastUpdate.toISOString(),
        isDeleted: category.isDeleted
      },
      {headers, observe: 'response'},
    )
  }

  public createCategory(category: Category): Observable<Object>  {
    const headers = this.getAuthenticationHeaders();

    return this.httpClient.post(
      this.CATEGORIES_URL,
      {
        uuid: category.uuid,
        name: category.name,
        type: category.type,
        date: category.createdAt.toISOString(),
        lastUpdate: category.lastUpdate.toISOString(),
        isDeleted: category.isDeleted
      },
      {headers, observe: 'response'},
      )
  }

  public deleteCategory(categoryUUID: string): Observable<Object> {
    const headers = this.getAuthenticationHeaders();

    return this.httpClient.delete(
      `${this.CATEGORIES_URL}?categoryUUID=${categoryUUID}`,
      {headers, observe: 'response'},
    )
  }

  private getAuthenticationHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('token');
    let headers = new HttpHeaders()
    return  headers.append('Authorization', `Bearer ${authToken}`)
  }
}
