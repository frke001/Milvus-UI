import { Component, inject, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { CollectionDetails } from '../../../../models/CollectionDetails';
import { TooltipModule } from 'primeng/tooltip';
import { SearchResponse } from '../../../../models/SearchResponse';
import { TableModule } from 'primeng/table';
import { JsonPipe } from '@angular/common';
import { CollectionManagementService } from '../../services/collection-management.service';
import { MessageService } from 'primeng/api';
import { UiService } from '../../../../core/services/ui.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-collection-search',
  standalone: true,
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    InputGroupModule,
    ButtonModule,
    TooltipModule,
    TableModule,
    JsonPipe,
  ],
  templateUrl: './collection-search.component.html',
  styleUrl: './collection-search.component.css',
})
export class CollectionSearchComponent {

  searchTerm: string = '';
  @Input()
  collection: CollectionDetails | undefined;
  @Input()
  dbName: string | undefined;
  topK: number = 5;
  searchResult: SearchResponse[] = [];
  collManagementService: CollectionManagementService = inject(CollectionManagementService);
  messageService: MessageService = inject(MessageService);
  uiService: UiService = inject(UiService);
  clipboard: Clipboard = inject(Clipboard);
  isLoading: boolean = false
  onSearch() {
    this.isLoading = true;
    if(this.dbName && this.collection?.loaded && this.searchTerm !== '')
      this.collManagementService.search(this.dbName, this.collection.name, {
        text: this.searchTerm,
        limit: this.topK
      }).subscribe({
        next: (res: SearchResponse[]) => {
          this.searchResult = res;
          this.searchTerm = '';
          this.isLoading = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Error',
            detail: err.error,
          });
          this.isLoading = false;
        },
      })
  }

  onCopy(text: any) {
    this.clipboard.copy(JSON.stringify(text));
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'Field successfully copied',
    });
  }
}
