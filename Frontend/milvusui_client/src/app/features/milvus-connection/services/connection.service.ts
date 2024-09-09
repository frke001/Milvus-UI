import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConnectionRequest } from '../../../models/ConnectionRequest';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private httpClient: HttpClient = inject(HttpClient);

  connectToMilvus(request: ConnectionRequest): Observable<string> {
    return this.httpClient.post<string>(enviroment.apiUrl + 'connect', request);
  }

  disconnectFromMilvus(): Observable<string> {
    return this.httpClient.post<string>(enviroment.apiUrl + 'disconnect', {});
  }
}
