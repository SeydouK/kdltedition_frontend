import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuoteService } from '../../../core/services/quote.service';
import { Quote, QuoteStatus } from '../../../core/models/quote.model';

@Component({
  selector: 'app-my-quotes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-quotes.html',
  styleUrl: './my-quotes.css',
})
export class MyQuotes implements OnInit {
  quotes: Quote[] = [];
  loading = true;
  error = false;

  private readonly statusLabels: Record<QuoteStatus, string> = {
    PENDING: 'En attente de réponse',
    ANSWERED: 'Réponse reçue',
    REJECTED: 'Non retenu',
  };

  private readonly statusClasses: Record<QuoteStatus, string> = {
    PENDING: 'bg-slate-100 text-slate-700',
    ANSWERED: 'bg-green-50 text-green-700',
    REJECTED: 'bg-red-50 text-red-700',
  };

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.quoteService.getMyQuotes().subscribe({
      next: (data) => {
        this.quotes = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  statusLabel(status: QuoteStatus): string {
    return this.statusLabels[status] ?? status;
  }

  statusClass(status: QuoteStatus): string {
    return this.statusClasses[status] ?? 'bg-slate-100 text-slate-700';
  }

  formatPrice(price?: number): string {
    if (price == null) return '-';
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
