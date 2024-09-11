import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { CollectionResponse } from '../../../models/CollectionResponse';
import { enviroment } from '../../../../environments/enviroment';

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
}
