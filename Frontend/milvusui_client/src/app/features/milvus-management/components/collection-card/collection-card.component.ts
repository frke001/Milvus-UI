import { Component, EventEmitter, inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CollectionResponse } from '../../../../models/CollectionResponse';
import { UiService } from '../../../../core/services/ui.service';
import { ChipModule } from 'primeng/chip';
import { CollectionManagementService } from '../../services/collection-management.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { StopPropagationDirective } from '../../../../shared/directives/stop-propagation.directive';

@Component({
  selector: 'app-collection-card',
  standalone: true,
  imports: [CardModule, ChipModule, StopPropagationDirective],
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
  router: Router = inject(Router);
  isLoading: boolean = false;

  onCollectionDelete(collName: string | undefined) {
    this.isLoading = true;
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
      });
  }
  onCollectionClick(collName: string | undefined) {
    if(collName){
      this.router.navigate(['features', 'databases', this.uiService.getSelectedDb(), 'collections', collName]);
    }
  }
}
