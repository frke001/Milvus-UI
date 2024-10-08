import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/enviroment';
import { first, Observable } from 'rxjs';
import { DatabaseResponse } from '../../../models/DatabaseResponse';
import { DatabaseRequest } from '../../../models/DatabaseRequest';

@Injectable({
  providedIn: 'root'
})
export class DatabaseManagemnetService {
  private httpClient: HttpClient = inject(HttpClient);
  

  getAllDatabases(): Observable<DatabaseResponse[]>{
    return this.httpClient.get<DatabaseResponse[]>(enviroment.apiUrl + 'databases').pipe(first());
  }

  deleteDatabase(dbName: string | undefined): Observable<string>{
    return this.httpClient.delete<string>(enviroment.apiUrl + 'databases/' + dbName).pipe(first());
  }
  createDatabase(request: DatabaseRequest): Observable<string>{
    return this.httpClient.post<string>(enviroment.apiUrl + 'databases', request);
  }
}
