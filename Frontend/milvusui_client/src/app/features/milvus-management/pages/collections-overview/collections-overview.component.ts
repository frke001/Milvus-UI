import { Component, inject, OnInit } from '@angular/core';
import { CollectionResponse } from '../../../../models/CollectionResponse';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, switchMap } from 'rxjs';
import { CollectionManagementService } from '../../services/collection-management.service';
import { MessageService } from 'primeng/api';
import { UiService } from '../../../../core/services/ui.service';
import { CollectionCardComponent } from '../../components/collection-card/collection-card.component';

@Component({
  selector: 'app-collections-overview',
  standalone: true,
  imports: [CollectionCardComponent],
  templateUrl: './collections-overview.component.html',
  styleUrl: './collections-overview.component.css',
})
export class CollectionsOverviewComponent implements OnInit {
  collections$!: Observable<CollectionResponse[]>;
  route = inject(ActivatedRoute);
  dbName: string | undefined;
  collManagementService: CollectionManagementService = inject(
    CollectionManagementService
  );
  collections: CollectionResponse[] = [];
  messageService: MessageService = inject(MessageService);
  uiService: UiService = inject(UiService);

  constructor() {
    this.collections$ = this.route.params.pipe(
      switchMap((params) => {
        this.dbName = params['db_name'];
        console.log(this.dbName);
        this.dbName;
        if (this.dbName) {
          this.uiService.setSelectedDb(this.dbName);
          return this.collManagementService.getAllConnections(this.dbName);
        } else {
          return EMPTY;
        }
      })
    );
  }
  ngOnInit(): void {
    this.collections$.subscribe({
      next: (res: CollectionResponse[]) => {
        this.collections = res;
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
