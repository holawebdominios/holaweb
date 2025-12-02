export type PlanType = 'basic' | 'pro' | 'enterprise' | 'custom';
export type BillingPeriod = 'monthly' | 'annual' | 'biannual';

export interface PlanFeature {
  id: string;
  label: string;
  included: boolean;
  value?: string | number;
  tooltip?: string;
  highlighted?: boolean;
}

export interface Plan {
  id: string;
  type: PlanType;
  name: string;
  tagline: string;
  description: string;
  
  pricing: {
    monthly: number;
    annual: number;
    biannual?: number;
    currency: string;
    discount?: {
      percentage: number;
      label: string;
    };
  };
  
  features: PlanFeature[];
  
  limits: {
    domains: number | 'unlimited';
    checks: number | 'unlimited';
    alerts: boolean;
    support: '24/7' | 'business-hours' | 'email';
  };
  
  badge?: string;
  badgeColor?: string;
  highlighted?: boolean;
  ctaLabel?: string;
  ctaAction?: string;
}

