import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollectionManagementService {

  private httpClient: HttpClient = inject(HttpClient);

  getAllConnections(db_name: string){
    
  }
}
