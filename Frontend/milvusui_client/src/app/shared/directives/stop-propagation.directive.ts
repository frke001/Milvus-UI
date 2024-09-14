import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appStopPropagation]',
  standalone: true
})
export class StopPropagationDirective {

  constructor() { }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.stopPropagation(); 
  }
}
