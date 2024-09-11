import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CollectionResponse } from '../../../../models/CollectionResponse';
import { UiService } from '../../../../core/services/ui.service';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-collection-card',
  standalone: true,
  imports: [CardModule, ChipModule],
  templateUrl: './collection-card.component.html',
  styleUrl: './collection-card.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CollectionCardComponent {
  @Input()
  collection: CollectionResponse | null = null;
  nameToDelete: string | undefined = '';
  uiService: UiService = inject(UiService);
}
