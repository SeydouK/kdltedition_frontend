import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TkardPromo } from '../../shared/components/tkard-promo/tkard-promo';
import { PROCESS_STEPS } from '../../core/config/content';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, TkardPromo],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  readonly steps = PROCESS_STEPS;

  readonly services = [
    {
      icon: 'pi-print',
      title: 'Impression professionnelle',
      text: 'Travaux courants et productions personnalisées, avec une attention particulière à la qualité, à la régularité et à la finition.',
    },
    {
      icon: 'pi-heart',
      title: 'Papeterie médicale',
      text: 'Carnets mère-enfant, ordonnanciers sécurisés, fiches médicales, en-têtes et blocs pour cabinets, cliniques et pharmacies.',
    },
    {
      icon: 'pi-book',
      title: 'Édition',
      text: "Nos propres carnets, répertoires et supports pédagogiques autour de la santé, de l'éducation et de la prévention.",
    },
    {
      icon: 'pi-pencil',
      title: 'Conception et mise en page',
      text: "Nous vous accompagnons depuis l'idée initiale, ou nous intervenons sur un projet existant.",
    },
    {
      icon: 'pi-palette',
      title: 'Produits sur mesure',
      text: "Chaque support est adapté à l'identité et aux besoins de votre organisation. Décrivez votre projet, nous vous répondons par un devis.",
    },
    {
      icon: 'pi-mobile',
      title: 'Solutions numériques',
      text: "TKARD GO, notre carte de visite numérique à puce NFC, prolonge l'imprimé vers le digital.",
    },
  ];
}
