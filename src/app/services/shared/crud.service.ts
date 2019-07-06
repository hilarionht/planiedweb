
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CrudOperations } from './interface/crud-operations.interface';

export abstract class CrudService<T, ID> implements CrudOperations<T, ID> {

  public header =   new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`);
  // httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json'}) };
  constructor(
    protected _http: HttpClient,
    protected _base: string
  ) {
    this.header = new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`);
  }

  save(t: T): Observable<T> {
    // tslint:disable-next-line:max-line-length
    return this._http.post<T>(this._base, t, { headers : this.header });
  }

  update(id: ID, t: T): Observable<T> {
    return this._http.put<T>(this._base + '/' + id, t, {});
  }

  findOne(id: ID): Observable<T> {
    // tslint:disable-next-line:max-line-length
    return this._http.get<T>(this._base + '/' + id, { headers: this.header });
  }

  findAll(): Observable<T[]> {
    // tslint:disable-next-line:max-line-length
    return this._http.get<T[]>(this._base + '/?isPaginate=true',  { headers: this.header });
  }

  delete(id: ID): Observable<T> {
    // tslint:disable-next-line:max-line-length
    return this._http.delete<T>(this._base + '/' + id,  { headers: this.header });
  }

}