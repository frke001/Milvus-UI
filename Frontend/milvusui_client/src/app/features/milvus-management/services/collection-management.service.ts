import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { CollectionResponse } from '../../../models/CollectionResponse';
import { enviroment } from '../../../../environments/enviroment';
import { CollectionRequest } from '../../../models/CollectionRequest';

@Injectable({
  providedIn: 'root',
})
export class CollectionManagementService {
  private httpClient: HttpClient = inject(HttpClient);

  getAllConnections(dbName: string): Observable<CollectionResponse[]> {
    return this.httpClient
      .get<CollectionResponse[]>(
        enviroment.apiUrl + `databases/${dbName}/collections`
      )
      .pipe(first());
  }

  createCollection(dbName: string, request: CollectionRequest): Observable<CollectionResponse>{
    return this.httpClient.post<CollectionResponse>(enviroment.apiUrl + `databases/${dbName}/collections`, request).pipe(first());
  }

  deleteCollection(dbName: string, collName: string): Observable<string>{
    return this.httpClient.delete<string>(enviroment.apiUrl + `databases/${dbName}/collections/${collName}`).pipe(first());
  }
}
