import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NoticeService {
  private message: string | null = null;

  set(message: string): void {
    this.message = message;
  }

  // Renvoie le message en attente et l'efface : il ne s'affiche qu'une fois.
  consume(): string | null {
    const message = this.message;
    this.message = null;
    return message;
  }
}
