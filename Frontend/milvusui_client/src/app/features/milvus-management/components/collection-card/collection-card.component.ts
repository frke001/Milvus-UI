import { Component, EventEmitter, inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CollectionResponse } from '../../../../models/CollectionResponse';
import { UiService } from '../../../../core/services/ui.service';
import { ChipModule } from 'primeng/chip';
import { CollectionManagementService } from '../../services/collection-management.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-collection-card',
  standalone: true,
  imports: [CardModule, ChipModule],
  templateUrl: './collection-card.component.html',
  styleUrl: './collection-card.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CollectionCardComponent {
  @Input()
  collection: CollectionResponse | null = null;
  nameToDelete: string | undefined = '';
  uiService: UiService = inject(UiService);
  collManagementService: CollectionManagementService = inject(
    CollectionManagementService
  );
  messageService: MessageService = inject(MessageService);

  @Output() onCollDelete: EventEmitter<string> = new EventEmitter<string>();

  onCollectionDelete(collName: string | undefined) {
    this.nameToDelete = collName;
    this.collManagementService
      .deleteCollection(this.uiService.getSelectedDb(), collName!)
      .subscribe({
        next: (res: string) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: res,
          });
          this.onCollDelete.emit(collName);
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
