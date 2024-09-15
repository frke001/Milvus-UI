import { Component, inject, Input, OnInit } from '@angular/core';
import {
  TableModule,
  TablePageEvent,
  TableRowSelectEvent,
} from 'primeng/table';
import {
  CollectionData,
  CollectionDataResponse,
} from '../../../../models/CollectionDataResponse';
import { CollectionDetails } from '../../../../models/CollectionDetails';
import { CollectionManagementService } from '../../services/collection-management.service';
import { MessageService } from 'primeng/api';
import { JsonPipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    TableModule,
    JsonPipe,
    TooltipModule,
    ButtonModule,
    PaginatorModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent implements OnInit {

  @Input()
  collection: CollectionDetails | undefined;
  @Input()
  dbName: string | undefined;

  limit: number = 10;
  offset: number = 0;

  data: CollectionDataResponse = {
    data: [],
    limit: 10,
    offset: 0,
    total_records: 0,
  };
  collManagementService: CollectionManagementService = inject(
    CollectionManagementService
  );
  messageService: MessageService = inject(MessageService);
  clipboard: Clipboard = inject(Clipboard);
  selectedData: CollectionData[] = [];

  ngOnInit(): void {
    if (this.dbName && this.collection?.loaded) this.loadData();
  }
  loadData() {
    if (this.dbName && this.collection?.loaded) {
      this.collManagementService
        .getAllData(this.dbName, this.collection.name, this.limit, this.offset)
        .subscribe({
          next: (res: CollectionDataResponse) => {
            this.data = res;
          },
          error: (err) => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Error',
              detail: err.error,
            });
          },
        });
    }
  }
  onPageChange(event: any) {
    this.limit = event.rows;
    this.offset = event.first / event.rows;
    this.loadData();
  }
  onCopy(text: any) {
    this.clipboard.copy(JSON.stringify(text));
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'Field successfully copied',
    });
  }
  onDeleteData() {
    if (this.dbName && this.collection?.loaded) 
    this.collManagementService
    .deleteData(this.dbName, this.collection.name, this.selectedData.map(el => el.id))
    .subscribe({
      next: (res: string) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Success',
          detail: res,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Error',
          detail: err.error,
        });
      },
    });
  }
}
