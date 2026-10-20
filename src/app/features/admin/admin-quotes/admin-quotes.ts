import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuoteService } from '../../../core/services/quote.service';
import { Quote, QuoteStatus } from '../../../core/models/quote.model';
import { QUOTE_STATUS } from '../../../core/config/status';
import { extractError } from '../../../core/utils/http.utils';
import { formatDate, formatPrice } from '../../../core/utils/format.utils';

type QuoteFilter = 'ALL' | QuoteStatus;

@Component({
  selector: 'app-admin-quotes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-quotes.html',
  styleUrl: './admin-quotes.css',
})
export class AdminQuotes implements OnInit {
  quotes: Quote[] = [];
  loading = true;
  error = false;

  // Par défaut, on affiche ce qui reste à traiter.
  filter: QuoteFilter = 'PENDING';

  // Formulaire de réponse, ouvert sur un seul devis à la fois
  openId: number | null = null;
  price: number | null = null;
  message = '';
  submitting = false;
  priceError = '';
  errorMessage = '';

  readonly statuses = QUOTE_STATUS;
  readonly formatPrice = formatPrice;
  readonly formatDate = formatDate;
  readonly skeletons = [1, 2, 3];

  readonly filters: { key: QuoteFilter; label: string }[] = [
    { key: 'PENDING', label: 'En attente' },
    { key: 'ANSWERED', label: 'Répondus' },
    { key: 'REJECTED', label: 'Refusés' },
    { key: 'ALL', label: 'Tous' },
  ];

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.quoteService.getAllQuotes().subscribe({
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

  get visibleQuotes(): Quote[] {
    return this.filter === 'ALL'
      ? this.quotes
      : this.quotes.filter((quote) => quote.status === this.filter);
  }

  count(filter: QuoteFilter): number {
    return filter === 'ALL'
      ? this.quotes.length
      : this.quotes.filter((quote) => quote.status === filter).length;
  }

  toggle(quote: Quote): void {
    this.openId = this.openId === quote.id ? null : quote.id;
    this.price = null;
    this.message = '';
    this.priceError = '';
    this.errorMessage = '';
  }

  respond(quote: Quote, status: 'ANSWERED' | 'REJECTED'): void {
    this.priceError = '';
    this.errorMessage = '';

    if (status === 'ANSWERED' && (this.price === null || !(this.price > 0))) {
      this.priceError = 'Indiquez un prix supérieur à 0.';
      return;
    }

    this.submitting = true;

    this.quoteService
      .respond(quote.id, {
        status,
        proposedPrice: status === 'ANSWERED' ? (this.price ?? undefined) : undefined,
        staffResponse: this.message.trim() || undefined,
      })
      .subscribe({
        next: (updated) => {
          this.quotes = this.quotes.map((q) => (q.id === updated.id ? updated : q));
          this.submitting = false;
          this.openId = null;
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage = extractError(err, "Impossible d'envoyer la réponse.");
        },
      });
  }
}
