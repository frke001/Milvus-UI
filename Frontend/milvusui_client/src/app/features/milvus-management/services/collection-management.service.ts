import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { CollectionResponse } from '../../../models/CollectionResponse';
import { enviroment } from '../../../../environments/enviroment';
import { CollectionRequest } from '../../../models/CollectionRequest';
import { CollectionDetails } from '../../../models/CollectionDetails';
import { CollectionDataResponse } from '../../../models/CollectionDataResponse';

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

  createCollection(
    dbName: string,
    request: CollectionRequest
  ): Observable<CollectionResponse> {
    return this.httpClient
      .post<CollectionResponse>(
        enviroment.apiUrl + `databases/${dbName}/collections`,
        request
      )
      .pipe(first());
  }

  deleteCollection(dbName: string, collName: string): Observable<string> {
    return this.httpClient
      .delete<string>(
        enviroment.apiUrl + `databases/${dbName}/collections/${collName}`
      )
      .pipe(first());
  }

  getCollectionDetails(
    dbName: string,
    collName: string
  ): Observable<CollectionDetails> {
    return this.httpClient
      .get<CollectionDetails>(
        enviroment.apiUrl +
          `databases/${dbName}/collections/${collName}/details`
      )
      .pipe(first());
  }

  loadCollection(dbName: string, collName: string): Observable<string> {
    return this.httpClient
      .put<string>(
        enviroment.apiUrl + `databases/${dbName}/collections/${collName}`,
        {}
      )
      .pipe(first());
  }

  getAllData(
    dbName: string,
    collName: string,
    limit: number = 10,
    offset: number = 0
  ): Observable<CollectionDataResponse> {
    return this.httpClient
      .get<CollectionDataResponse>(
        enviroment.apiUrl +
          `databases/${dbName}/collections/${collName}/data?limit=${limit}&offset=${offset}`
      )
      .pipe(first());
  }

  deleteData(
    dbName: string,
    collName: string,
    listIds: string[]
  ): Observable<string> {
    return this.httpClient
      .delete<string>(
        enviroment.apiUrl + `databases/${dbName}/collections/${collName}/data`
      )
      .pipe(first());
  }
}
