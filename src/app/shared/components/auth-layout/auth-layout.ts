import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
  host: { class: 'block' },
})
export class AuthLayout {
  readonly title = input.required<string>();
  readonly points = input<string[]>([]);
  readonly currentYear = new Date().getFullYear();
}
