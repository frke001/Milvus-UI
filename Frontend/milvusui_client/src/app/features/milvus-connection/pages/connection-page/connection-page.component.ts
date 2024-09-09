import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UiService } from '../../../../core/services/ui.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ConnectionService } from '../../services/connection.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpinnerModule } from 'primeng/spinner';

@Component({
  selector: 'app-connection-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputSwitchModule,
    ToastModule,
    RippleModule,
    CardModule,
    ImageModule,
    InputTextModule,
    TooltipModule,
    SpinnerModule,
  ],
  templateUrl: './connection-page.component.html',
  styleUrl: './connection-page.component.css',
  providers: [MessageService],
})
export class ConnectionPageComponent implements OnInit {
  checked: boolean = true;
  private selectedTheme: string = 'dark';
  uiService: UiService = inject(UiService);
  private messageService: MessageService = inject(MessageService);
  private connectionService: ConnectionService = inject(ConnectionService);
  private destroyRef = inject(DestroyRef);
  private router: Router = inject(Router);

  form = new FormGroup({
    uri: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
    ]),
  });
  ngOnInit(): void {
    this.uiService.setTheme(this.selectedTheme);
  }
  // onThemeChange(theme: string): void {
  //   this.selectedTheme = theme;
  //   this.uiService.setTheme(theme);
  // }

  connect() {
    //this.uiService.enableLoader();
    this.form.disable();
    if (this.form.value.uri) {
      this.connectionService
        .connectToMilvus({ uri: this.form.value.uri })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: string) => {
            this.router.navigate(['features']);
            localStorage.setItem("connected", JSON.stringify(this.form.value.uri))
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res,
            });
            this.form.enable();
          },
          error: (err) => {
            this.form.enable();
            this.form.reset();
            //this.uiService.showError(err.error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error,
            });
          },
        });
    }
    //this.uiService.disableLoader();
  }
}
