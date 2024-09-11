import { Component, EventEmitter, inject, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DatabaseManagemnetService } from '../../services/database-managemnet.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-db-card',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './add-db-card.component.html',
  styleUrl: './add-db-card.component.css',
})
export class AddDbCardComponent {
  visible: boolean = false;
  form = new FormGroup({
    name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
  });
  private dbManagementService: DatabaseManagemnetService = inject(
    DatabaseManagemnetService
  );
  private messageService: MessageService = inject(MessageService);

  @Output()
  onDatabaseAdd: EventEmitter<string> = new EventEmitter<string>();
  showDialog() {
    this.visible = true;
    this.form.reset();
  }
  onSave() {
    if (this.form.value.name)
      this.dbManagementService.createDatabase({
        name: this.form.value.name,
      }).subscribe({
        next: (res: string) =>{
          this.visible = false;
          this.messageService.add({
            severity: "info",
            summary: "Success",
            detail: res
          });
          if(this.form.value.name)
            this.onDatabaseAdd.emit(this.form.value.name);
        },
        error: (err) => {
          this.messageService.add({
            severity: "warn",
            summary: "Error",
            detail: err.error
          });
        }
      });
  }
  onClose() {
    this.visible = false;
  }
}
