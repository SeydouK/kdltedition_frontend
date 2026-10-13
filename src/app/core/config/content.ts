export interface ProcessStep {
  icon: string;
  label: string;
  text: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: 'pi-comments',
    label: 'Conseil',
    text: 'Comprendre votre besoin avant de proposer une solution.',
  },
  { icon: 'pi-pencil', label: 'Conception', text: 'Transformer votre idée en produit concret.' },
  {
    icon: 'pi-table',
    label: 'Mise en page',
    text: 'Une présentation soignée, cohérente avec votre identité.',
  },
  { icon: 'pi-print', label: 'Impression', text: 'Qualité, régularité et personnalisation.' },
  {
    icon: 'pi-check-circle',
    label: 'Finition',
    text: "Des finitions adaptées à l'usage du support.",
  },
  {
    icon: 'pi-truck',
    label: 'Livraison',
    text: 'Le respect des engagements et des délais de production.',
  },
];

export const SECTORS: string[] = [
  'Santé',
  'Entreprises',
  'Institutions',
  'Associations',
  'Éducation',
  'Commerce',
  'Événementiel',
];
