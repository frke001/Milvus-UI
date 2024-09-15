import {
  Component,
  EventEmitter,
  inject,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { IndexType } from '../../../../models/CollectionRequest';
import { DropdownModule } from 'primeng/dropdown';
import { index_type_desc } from '../../../../models/CollectionRequest';
import { TooltipModule } from 'primeng/tooltip';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CollectionManagementService } from '../../services/collection-management.service';
import { UiService } from '../../../../core/services/ui.service';
import { MessageService } from 'primeng/api';
import { CollectionResponse } from '../../../../models/CollectionResponse';
@Component({
  selector: 'app-collection-add-card',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    TooltipModule,
    InputSwitchModule,
  ],
  templateUrl: './collection-add-card.component.html',
  styleUrl: './collection-add-card.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CollectionAddCardComponent {
  visible: boolean = false;
  fb: FormBuilder = inject(FormBuilder);
  indexType = new FormControl<IndexType>(IndexType.FLAT, [Validators.required]);
  form = new FormGroup({
    name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern('^[a-zA-Z_][a-zA-Z0-9_]*$'),
    ]),
    indexType: this.indexType,
  });
  indexTypes: string[] = Object.values(IndexType);
  colManagementService: CollectionManagementService = inject(
    CollectionManagementService
  );
  uiService: UiService = inject(UiService);
  messageService: MessageService = inject(MessageService);

  @Output()
  onCollectionAdd: EventEmitter<CollectionResponse> =
    new EventEmitter<CollectionResponse>();
  isLoading: boolean = false;
  showDialog() {
    this.visible = true;
    this.form.reset();
  }
  onSave() {
    this.isLoading = true;
    if (this.form.valid) {
      let request = {
        name: this.form.value.name!,
        index_type: this.indexType.value!,
        index_params: this.removeUnwantedControls(),
      };
      let dbName = this.uiService.getSelectedDb();
      this.colManagementService.createCollection(dbName, request).subscribe({
        next: (res: CollectionResponse) => {
          this.visible = false;
          this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: `Collection ${this.form.value.name!} created successfully.`,
          });
          this.onCollectionAdd.emit(res);
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
  }

  onClose() {
    this.visible = false;
    this.removeUnwantedControls();
  }

  onSelectionChange($event: any) {
    if (this.form.value.indexType)
      this.addDynamicControls(this.form.value.indexType);
  }
  getIndexDesc(type: IndexType) {
    return index_type_desc.find((el) => el.type == type)?.desc;
  }
  private addDynamicControls(indexType: IndexType) {
    const baseControls = {
      name: this.form.get('name') as FormControl,
      indexType: this.form.get('indexType') as FormControl,
    };

    const controls = this.getControlsForIndexType(indexType);
    this.form = this.fb.group({
      ...baseControls,
      ...controls,
    });
  }

  private getControlsForIndexType(indexType: IndexType) {
    switch (indexType) {
      case IndexType.IVF_FLAT:
        return {
          nlist: new FormControl<number | null>(null, [
            Validators.required,
            Validators.min(1),
            Validators.max(65536),
          ]),
        };
      case IndexType.IVF_SQ8:
        return {
          nlist: new FormControl<number | null>(null, [
            Validators.required,
            Validators.min(1),
            Validators.max(65536),
          ]),
        };
      case IndexType.IVF_PQ:
        return {
          nlist: new FormControl<number | null>(null, [
            Validators.required,
            Validators.min(1),
            Validators.max(65536),
          ]),
          m: new FormControl<number | null>(null, [
            Validators.required,
            this.divisibleBy384Validator,
          ]),
        };
      case IndexType.HNSW:
        return {
          M: new FormControl<number | null>(null, [
            Validators.required,
            Validators.min(2),
            Validators.max(2048),
          ]),
          efConstruction: new FormControl<number | null>(null, [
            Validators.required,
            Validators.min(1),
          ]),
        };
      case IndexType.SCANN:
        return {
          nlist: new FormControl<number | null>(null, [
            Validators.required,
            Validators.min(1),
            Validators.max(65536),
          ]),
          with_raw_data: new FormControl<boolean>(false, Validators.required),
        };
      default:
        return {};
    }
  }
  removeUnwantedControls() {
    const controlsToKeep = ['name', 'indexType'];

    const newControls = Object.keys(this.form.controls)
      .filter((controlName) => !controlsToKeep.includes(controlName))
      .reduce((acc, controlName) => {
        acc[controlName] = this.form.get(controlName)!;
        return acc;
      }, {} as { [key: string]: AbstractControl });

      const formData = Object.keys(newControls).reduce((acc, controlName) => {
        acc[controlName] = newControls[controlName].value;
        return acc;
      }, {} as { [key: string]: any });
    return formData;
  }

  public divisibleBy384Validator = (
    control: AbstractControl
  ): { [key: string]: boolean } | null => {
    const value = control.value;
    if (value !== null && 384 % value !== 0) {
      return { notDivisibleBy384: true };
    }
    return null;
  };
}
