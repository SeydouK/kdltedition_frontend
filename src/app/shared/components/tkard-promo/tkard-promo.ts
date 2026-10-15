import { Component } from '@angular/core';
import { CONTACT_EMAIL, TKARD_GO_URL } from '../../../core/config/links';

@Component({
  selector: 'app-tkard-promo',
  standalone: true,
  templateUrl: './tkard-promo.html',
  styleUrl: './tkard-promo.css',
})
export class TkardPromo {
  readonly url = TKARD_GO_URL;
  readonly contactMailto =
    'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent("Demande d'accès à TKARD GO");

  readonly features = [
    "Une carte physique à puce NFC : approchez-la d'un smartphone compatible, votre fiche s'ouvre",
    'Une fiche publique à partager en un simple lien',
    'Un QR code pour la remettre en main propre',
    'Votre contact enregistré dans le téléphone en un clic',
    'Un formulaire pour recueillir les coordonnées de vos prospects',
    'La numérisation de vos cartes papier par reconnaissance de texte',
    "L'export de vos contacts vers Excel",
  ];
}
