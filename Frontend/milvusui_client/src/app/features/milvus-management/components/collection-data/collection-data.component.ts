import { Component, inject, Input, OnInit } from '@angular/core';
import { CollectionDetails } from '../../../../models/CollectionDetails';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CollectionDataResponse } from '../../../../models/CollectionDataResponse';
import { CollectionManagementService } from '../../services/collection-management.service';
import { DataTableComponent } from '../data-table/data-table.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-collection-data',
  standalone: true,
  imports: [ButtonModule, TableModule, DataTableComponent],
  templateUrl: './collection-data.component.html',
  styleUrl: './collection-data.component.css',
})
export class CollectionDataComponent {
  @Input()
  collection: CollectionDetails | undefined;
  @Input()
  dbName: string | undefined;

  
}
