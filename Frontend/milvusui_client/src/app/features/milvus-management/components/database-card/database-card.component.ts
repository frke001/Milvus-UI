import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { DatabaseResponse } from '../../../../models/DatabaseResponse';
import { DatabaseManagemnetService } from '../../services/database-managemnet.service';
import { UiService } from '../../../../core/services/ui.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { NgClass, NgStyle } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';

@Component({
  selector: 'app-database-card',
  standalone: true,
  imports: [CardModule, NgClass, NgStyle, RippleModule],
  templateUrl: './database-card.component.html',
  styleUrl: './database-card.component.css',
  encapsulation: ViewEncapsulation.None,
  //providers: [MessageService]
})
export class DatabaseCardComponent {
  @Input()
  database: DatabaseResponse | null = null;
  @Output()
  onDeleteDatabase: EventEmitter<string> = new EventEmitter<string>();
  dbManagementService: DatabaseManagemnetService = inject(
    DatabaseManagemnetService
  );
  private destroyRef = inject(DestroyRef);
  uiService: UiService = inject(UiService);
  private messageService: MessageService = inject(MessageService);
  nameToDelete: string | undefined = '';
  private router: Router = inject(Router);

  onDeleteClick(dbName: string | undefined) {
    this.nameToDelete = dbName;
    this.dbManagementService.deleteDatabase(dbName).subscribe({
      next: (res: string) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Success',
          detail: res,
        });
        this.onDeleteDatabase.emit(dbName);
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
  onDatabaseClick(dbName: string | undefined) {
    if (dbName) {
      this.uiService.setSelectedDb(dbName);
      this.router.navigate(['features', 'databases', dbName, 'collections']);
    }
  }
}
