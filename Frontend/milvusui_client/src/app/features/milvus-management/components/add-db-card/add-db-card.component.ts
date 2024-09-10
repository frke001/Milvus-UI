import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-add-db-card',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule],
  templateUrl: './add-db-card.component.html',
  styleUrl: './add-db-card.component.css'
})
export class AddDbCardComponent {
  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }
}
