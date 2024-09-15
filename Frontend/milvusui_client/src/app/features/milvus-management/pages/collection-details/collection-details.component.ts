import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, switchMap } from 'rxjs';
import { CollectionDetails } from '../../../../models/CollectionDetails';
import { CollectionManagementService } from '../../services/collection-management.service';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { CollectionOverviewComponent } from '../../components/collection-overview/collection-overview.component';
import { CollectionDataComponent } from '../../components/collection-data/collection-data.component';
import { CollectionSearchComponent } from '../../components/collection-search/collection-search.component';
import { UiService } from '../../../../core/services/ui.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-collection-details',
  standalone: true,
  imports: [TabViewModule, CollectionOverviewComponent, CollectionDataComponent, CollectionSearchComponent, SkeletonModule],
  templateUrl: './collection-details.component.html',
  styleUrl: './collection-details.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CollectionDetailsComponent implements OnInit {
  collection$!: Observable<CollectionDetails>;
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  collName: string | undefined;
  dbName: string | undefined;
  collManagementService: CollectionManagementService = inject(CollectionManagementService);
  collection: CollectionDetails | undefined;
  messageService: MessageService = inject(MessageService);
  uiService: UiService = inject(UiService);

  constructor(){
    this.collection$ = this.route.params.pipe(
      switchMap((params) => {
        this.dbName = params['db_name']
        this.collName = params['coll_name'];
        if (this.collName && this.dbName) {
          return this.collManagementService.getCollectionDetails(this.dbName, this.collName);
        } else {
          return EMPTY;
        }
      })
    );
  }
  ngOnInit(): void {
    this.collection$.subscribe({
      next: (res: CollectionDetails) => {
        this.collection = res;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Error',
          detail: err.error,
        });
      }
    })
  }

  onBackClick() {
    this.router.navigate(['features', 'databases', this.dbName, 'collections']);
  }
}
