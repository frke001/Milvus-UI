import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { UiService } from '../../../core/services/ui.service';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { ConnectionService } from '../../../features/milvus-connection/services/connection.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-wrapper',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    ToastModule,
    ButtonModule,
    ImageModule,
    CardModule,
    TooltipModule,
    ToggleButtonModule,
    RippleModule,
    MenubarModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './wrapper.component.html',
  styleUrl: './wrapper.component.css',
  providers: [MessageService],
})
export class WrapperComponent implements OnInit {
  checked: boolean = true;
  selectedTheme: string = 'dark';
  messageService: MessageService = inject(MessageService);
  uiService: UiService = inject(UiService);
  uri: string = '';
  private primeNgConfig: PrimeNGConfig = inject(PrimeNGConfig);
  private connectionService: ConnectionService = inject(ConnectionService);
  private destroyRef = inject(DestroyRef);
  private router: Router = inject(Router);
  items: MenuItem[] = [
    {
      label: 'Databases',
      icon: 'pi pi-home',
    },
    {
      label: 'Collection',
      icon: 'pi pi-home',
    },
  ];
  ngOnInit() {
    let temp = sessionStorage.getItem('connected');
    if (temp) {
      this.uri = JSON.parse(temp);
    }
    this.primeNgConfig.ripple = true;
  }
  onDisconnectClick() {
    this.connectionService
      .disconnectFromMilvus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: string) => {
          sessionStorage.removeItem('connected');
          this.router.navigate(['']);
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
  onThemeChange(theme: string): void {
    this.selectedTheme = theme;
    this.uiService.setTheme(theme);
    this.checked = !this.checked;
  }
  onHomeClick() {
    this.router.navigate(['features']);
  }
}
