import { Component } from '@angular/core';
import { TKARD_GO_URL } from '../../../core/links';

@Component({
  selector: 'app-tkard-promo',
  standalone: true,
  templateUrl: './tkard-promo.html',
  styleUrl: './tkard-promo.css',
})
export class TkardPromo {
  readonly url = TKARD_GO_URL;

  readonly features = [
    'Une fiche publique à partager en un simple lien',
    'Un QR code pour la remettre en main propre',
    'Votre contact enregistré dans le téléphone (vCard)',
    'Un formulaire pour recueillir les contacts de vos prospects',
    'La numérisation de vos cartes papier par reconnaissance de texte',
  ];
}
