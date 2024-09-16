import {
  Component,
  inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  TableModule,
  TablePageEvent,
  TableRowSelectEvent,
} from 'primeng/table';
import {
  CollectionData,
  CollectionDataResponse,
} from '../../../../models/CollectionDataResponse';
import { CollectionDetails } from '../../../../models/CollectionDetails';
import { CollectionManagementService } from '../../services/collection-management.service';
import { MessageService } from 'primeng/api';
import { JsonPipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { DeleteDataRequest } from '../../../../models/DeleteDataRequest';
import { UiService } from '../../../../core/services/ui.service';
import { EMPTY, switchMap } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { CollectionInsertDataRequest } from '../../../../models/CollectionInsertDataRequest';
import { CollectionDataInsertResponse } from '../../../../models/CollectionDataInsertResponse';
interface KeyValuePair {
  key: string;
  value: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    TableModule,
    JsonPipe,
    TooltipModule,
    ButtonModule,
    PaginatorModule,
    SkeletonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextareaModule,
    InputTextModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DataTableComponent implements OnInit {
  @Input()
  collection: CollectionDetails | undefined;
  @Input()
  dbName: string | undefined;
  limit: number = 10;
  offset: number = 0;
  data: CollectionDataResponse = {
    data: [],
    limit: 10,
    offset: 0,
    total_records: 0,
  };
  collManagementService: CollectionManagementService = inject(
    CollectionManagementService
  );
  messageService: MessageService = inject(MessageService);
  clipboard: Clipboard = inject(Clipboard);
  selectedData: CollectionData[] = [];
  uiService: UiService = inject(UiService);
  visible: boolean = false;
  isLoading: boolean = false;
  fb: FormBuilder = inject(FormBuilder);
  form = new FormGroup({
    text: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(2500),
    ]),
    keyValuePairs: this.fb.array<any>([]),
  });

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    if (this.dbName && this.collection?.loaded) {
      this.collManagementService
        .getAllData(this.dbName, this.collection.name, this.limit, this.offset)
        .subscribe({
          next: (res: CollectionDataResponse) => {
            this.data = res;
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
  onPageChange(event: any) {
    this.limit = event.rows;
    this.offset = event.first;
    this.loadData();
  }
  onCopy(text: any) {
    this.clipboard.copy(JSON.stringify(text));
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'Field successfully copied',
    });
  }
  onDeleteData() {
    if (this.dbName && this.collection?.loaded) {
      let request: DeleteDataRequest = {
        ids: this.selectedData.map((el) => el.id),
      };
      this.collManagementService
        .deleteData(this.dbName, this.collection.name, request)
        .subscribe({
          next: (res: number) => {
            this.data.data = this.data.data.filter(
              (item) => !request.ids.includes(item.id)
            );
            this.selectedData = [];
            this.data.total_records -= res;
            if (this.data.data.length === 0) {
              this.offset = this.offset + this.limit;
              this.loadData();
            }
            this.messageService.add({
              severity: 'info',
              summary: 'Success',
              detail: `Successfully deleted ${res} records`,
            });
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
  showDialog() {
    this.visible = true;
    this.form.reset();
  }
  onSave() {
    this.isLoading = true;
    if (this.form.valid && this.dbName && this.collection) {
      const formData = this.form.value;
      const keyValuePairs = this.keyValuePairs?.controls ?? [];
      const entries = keyValuePairs.map((element: any) => [element.value.key, element.value.value]);
      const metadata = Object.fromEntries(entries);
      const requestBody: CollectionInsertDataRequest = {
        text: formData.text!,
        metadata: metadata,
      };
      this.collManagementService.insertData(this.dbName, this.collection.name, requestBody).subscribe({
        next: (res: CollectionData) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: `Successfully inserted data`,
          });
          this.visible = false;
          this.isLoading = false;
          if(this.data.data.length < this.limit)
            this.data.data = [...this.data.data, res];
          this.keyValuePairs.clear();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Error',
            detail: err.error,
          });
          this.isLoading = false;
          this.keyValuePairs.clear();
        },
      })
    }
  }
  onClose() {
    this.visible = false;
  }
  get keyValuePairs(): FormArray {
    return this.form.get('keyValuePairs') as FormArray;
  }

  addKeyValuePair(): void {
    const keyValueFormGroup = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
    });
    this.keyValuePairs.push(keyValueFormGroup);
  }

  removeKeyValuePair(index: number): void {
    this.keyValuePairs.removeAt(index);
  }
}
