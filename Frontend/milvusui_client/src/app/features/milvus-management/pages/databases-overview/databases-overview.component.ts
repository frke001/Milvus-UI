import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DatabaseCardComponent } from '../../components/database-card/database-card.component';
import { Observable } from 'rxjs';
import { DatabaseResponse } from '../../../../models/DatabaseResponse';
import { DatabaseManagemnetService } from '../../services/database-managemnet.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UiService } from '../../../../core/services/ui.service';
import { AddDbCardComponent } from '../../components/add-db-card/add-db-card.component';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-databases-overview',
  standalone: true,
  imports: [
    ToastModule,
    ButtonModule,
    DatabaseCardComponent,
    AddDbCardComponent,
    AddDbCardComponent,
    SkeletonModule,
  ],
  templateUrl: './databases-overview.component.html',
  styleUrl: './databases-overview.component.css',
  providers: [],
})
export class DatabasesOverviewComponent implements OnInit {
  messageService: MessageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  dbManagementService: DatabaseManagemnetService = inject(
    DatabaseManagemnetService
  );
  uiService: UiService = inject(UiService);
  databases: DatabaseResponse[] = [];
  ngOnInit(): void {
    this.uiService.enableLoader();
    this.dbManagementService.getAllDatabases().subscribe({
      next: (res: DatabaseResponse[]) => {
        // this.messageService.add({
        //   severity: 'info',
        //   summary: 'Success',
        //   detail: 'Successfully fetched databases',
        // });
        this.databases = res;
        this.customSort();
        this.uiService.disableLoader();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Error',
          detail: err.error,
        });
        this.uiService.disableLoader();
      },
    });
  }

  customSort() {
    this.databases = this.databases.sort((a, b) => {
      if (a.name === 'default') return -1;
      if (b.name === 'default') return 1;
      return 0;
    });
  }
  onDatabaseDeleted(event: string) {
    this.databases = this.databases.filter((el) => el.name !== event);
  }

  onNewDatabaseAdded(event: string) {    
    this.databases = [...this.databases, { name: event, collections_count: 0 }];
  }
}
