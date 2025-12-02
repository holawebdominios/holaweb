export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: {
    label: string;
    href: string;
    action?: () => void;
  };
  secondaryCTA: {
    label: string;
    href: string;
  };
  backgroundImage: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  link?: string;
}

export interface HowItWorksStep {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  initials: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  project?: string;
  date?: string;
  featured?: boolean;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  address?: string;
  schedule?: {
    days: string;
    hours: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

