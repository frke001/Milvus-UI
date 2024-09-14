import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CollectionResponse } from '../../../../models/CollectionResponse';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EMPTY, Observable, switchMap } from 'rxjs';
import { CollectionManagementService } from '../../services/collection-management.service';
import { MessageService } from 'primeng/api';
import { UiService } from '../../../../core/services/ui.service';
import { CollectionCardComponent } from '../../components/collection-card/collection-card.component';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DatabaseResponse } from '../../../../models/DatabaseResponse';
import { DatabaseManagemnetService } from '../../services/database-managemnet.service';
import { CollectionAddCardComponent } from '../../components/collection-add-card/collection-add-card.component';

@Component({
  selector: 'app-collections-overview',
  standalone: true,
  imports: [
    CollectionCardComponent,
    SkeletonModule,
    FormsModule,
    DropdownModule,
    CollectionAddCardComponent,
  ],
  templateUrl: './collections-overview.component.html',
  styleUrl: './collections-overview.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CollectionsOverviewComponent implements OnInit, OnDestroy {

  collections$!: Observable<CollectionResponse[]>;
  route: ActivatedRoute = inject(ActivatedRoute);
  dbName: string | undefined;
  private router: Router = inject(Router);
  collManagementService: CollectionManagementService = inject(
    CollectionManagementService
  );
  collections: CollectionResponse[] = [];
  messageService: MessageService = inject(MessageService);
  uiService: UiService = inject(UiService);
  databasesNames: string[] = [];
  selectedDb: string = this.uiService.getSelectedDb();
  dbManagementService: DatabaseManagemnetService = inject(
    DatabaseManagemnetService
  );

  constructor() {
    this.collections$ = this.route.params.pipe(
      switchMap((params) => {
        this.dbName = params['db_name'];
        if (this.dbName) {
          this.uiService.setSelectedDb(this.dbName);
          this.selectedDb = this.dbName;
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
    this.dbManagementService.getAllDatabases().subscribe({
      next: (res: DatabaseResponse[]) => {
        this.databasesNames = res.map((el) => el.name);
        this.customSort();
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
  onSelectionChange(event: string) {
    this.uiService.setSelectedDb(event);
    this.router.navigate(['features', 'databases', event, 'collections']);
  }
  customSort() {
    this.databasesNames = this.databasesNames.sort((a, b) => {
      if (a === 'default') return -1;
      if (b === 'default') return 1;
      return 0;
    });
  }
  ngOnDestroy(): void {
    this.uiService.setSelectedDb('default');
  }
  onCollectionAdded(event: CollectionResponse) {
    this.collections = [...this.collections, event]; 
  }
  onCollectionDeleted(event: string) {
    this.collections = this.collections.filter(el => el.name !== event);
  }
}
