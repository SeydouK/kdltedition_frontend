import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuoteService } from '../../../core/services/quote.service';
import { Quote } from '../../../core/models/quote.model';
import { QUOTE_STATUS } from '../../../core/config/status';
import { formatDate, formatPrice } from '../../../core/utils/format.utils';

@Component({
  selector: 'app-my-quotes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-quotes.html',
  styleUrl: './my-quotes.css',
})
export class MyQuotes implements OnInit {
  quotes: Quote[] = [];
  loading = true;
  error = false;

  readonly statuses = QUOTE_STATUS;
  readonly formatPrice = formatPrice;
  readonly formatDate = formatDate;
  readonly skeletons = [1, 2, 3];

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
}
