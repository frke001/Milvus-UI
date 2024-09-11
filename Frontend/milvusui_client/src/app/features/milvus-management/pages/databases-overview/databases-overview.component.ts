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

@Component({
  selector: 'app-databases-overview',
  standalone: true,
  imports: [
    ToastModule,
    ButtonModule,
    DatabaseCardComponent,
    AddDbCardComponent,
    AddDbCardComponent,
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
    this.dbManagementService
      .getAllDatabases()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: DatabaseResponse[]) => {
          // this.messageService.add({
          //   severity: 'info',
          //   summary: 'Success',
          //   detail: 'Successfully fetched databases',
          // });
          this.databases = res;
          this.customSort();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error,
          });
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
  onDelete(event: string) {
    debugger;
    this.databases = this.databases.filter((el) => el.name !== event);
  }
  onDatabaseAdd(event: string) {
    this.databases.push({
      name: event,
      collections_count: 0,
    });
  }
}
