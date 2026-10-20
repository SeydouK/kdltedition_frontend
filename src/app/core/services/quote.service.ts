import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateQuoteRequest, Quote, RespondQuoteRequest } from '../models/quote.model';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  constructor(private http: HttpClient) {}

  createQuote(request: CreateQuoteRequest): Observable<Quote> {
    return this.http.post<Quote>(`${environment.apiUrl}/quotes`, request);
  }

  getMyQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${environment.apiUrl}/quotes/me`);
  }

  // ───── Équipe ─────

  getAllQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${environment.apiUrl}/quotes`);
  }

  respond(id: number, request: RespondQuoteRequest): Observable<Quote> {
    return this.http.put<Quote>(`${environment.apiUrl}/quotes/${id}/respond`, request);
  }
}
