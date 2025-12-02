export type FAQCategory = 
  | 'general'
  | 'dominios'
  | 'planes'
  | 'pagos'
  | 'tecnico'
  | 'legal';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  keywords?: string[];
  order?: number;
}

export interface FAQGroup {
  category: FAQCategory;
  label: string;
  icon: string;
  items: FAQItem[];
}

