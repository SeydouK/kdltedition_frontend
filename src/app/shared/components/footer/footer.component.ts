import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT_EMAIL } from '../../../core/config/links';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  readonly contactEmail = CONTACT_EMAIL;
  readonly contactMailto = 'mailto:' + CONTACT_EMAIL;
}
