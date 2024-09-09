import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
  
})
export class UiService {
  activetheme: string = 'dark';
  private _loading: WritableSignal<number> = signal<number>(0);

  getTheme() {
    return this.activetheme;
  }

  setTheme(theme: string) {
    let themeLink = document.getElementById('app-theme') as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = theme + '.css';
    }
    this.activetheme = theme;
  }

  public enableLoader(): void {
    this._loading.set(this._loading() + 1);
  }

  public disableLoader(): void {
    if (this._loading() === 0) return;
    this._loading.set(this._loading() - 1);
  }

  public get isLoading(): boolean {
    return this._loading() > 0;
  }
}
