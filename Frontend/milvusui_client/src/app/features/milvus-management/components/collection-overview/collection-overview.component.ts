import { Component, inject, Input, OnInit } from '@angular/core';
import { CollectionDetails } from '../../../../models/CollectionDetails';
import { TooltipModule } from 'primeng/tooltip';
import { CollectionManagementService } from '../../services/collection-management.service';
import { UiService } from '../../../../core/services/ui.service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-collection-overview',
  standalone: true,
  imports: [TooltipModule, TableModule],
  templateUrl: './collection-overview.component.html',
  styleUrl: './collection-overview.component.css',
})
export class CollectionOverviewComponent implements OnInit{
  collection: CollectionDetails | undefined;
  fields: any;
  @Input('collection')
  set collectionResolver(value: CollectionDetails | undefined){
    this.collection = value;
    this.fields = this.collection?.fields;
  }
  @Input('dbName')
  dbName: string | undefined;
  collManagementService: CollectionManagementService = inject(
    CollectionManagementService
  );
  uiService: UiService = inject(UiService);
  messageService: MessageService = inject(MessageService);
 
  ngOnInit(): void {
    
  }
  onLoadClick() {
    if (this.collection?.name && this.dbName)
      this.collManagementService
        .loadCollection(this.dbName, this.collection?.name)
        .subscribe({
          next: (res: string) => {
            this.messageService.add({
              severity: 'info',
              summary: 'Success',
              detail: res,
            });
            if(this.collection?.loaded != undefined)
              this.collection.loaded = !this.collection?.loaded;
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
