import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-databases-overview',
  standalone: true,
  imports: [ToastModule, ButtonModule],
  templateUrl: './databases-overview.component.html',
  styleUrl: './databases-overview.component.css',
  providers: [],
})
export class DatabasesOverviewComponent implements OnInit{

  messageService: MessageService = inject(MessageService)

  ngOnInit(): void {
    // this.messageService.add({
    //   severity: 'error',
    //   summary: 'Error',
    //   detail: "E",
    // })
  }
  click(){
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'E',
    });
  }

}
