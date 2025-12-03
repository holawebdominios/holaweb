/**
 * PLANES DE SUSCRIPCIÓN DE MERCADO PAGO
 * Estos son los preapproval_plan_id configurados en Mercado Pago
 * 
 * IMPORTANTE: Estos IDs vienen del panel de Mercado Pago
 * No deben ser modificados a menos que se creen nuevos planes en MP
 */

export type PeriodId = 'PERIOD_1_MONTH' | 'PERIOD_1_YEAR' | 'PERIOD_2_YEARS';

export interface MercadoPagoPlan {
  id: PeriodId;
  preapprovalPlanId: string;
  subscriptionUrl: string;
  period: string;
  periodMonths: number;
  pricePerMonth: number;
  totalPrice: number;
  discount: number;
}

/**
 * Configuración de planes de Mercado Pago
 * FUENTE DE VERDAD para suscripciones
 */
export const MERCADOPAGO_PLANS: Record<PeriodId, MercadoPagoPlan> = {
  PERIOD_1_MONTH: {
    id: 'PERIOD_1_MONTH',
    preapprovalPlanId: 'b21689b7fa8e48839d591d23b87f2f1b',
    subscriptionUrl: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=b21689b7fa8e48839d591d23b87f2f1b',
    period: '1 mes',
    periodMonths: 1,
    pricePerMonth: 5900,
    totalPrice: 5900,
    discount: 0,
  },
  PERIOD_1_YEAR: {
    id: 'PERIOD_1_YEAR',
    preapprovalPlanId: '4d00df0a99b34973857c28b10012d1bd',
    subscriptionUrl: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=4d00df0a99b34973857c28b10012d1bd',
    period: '12 meses',
    periodMonths: 12,
    pricePerMonth: 5900,
    totalPrice: 5900 * 12,
    discount: 0,
  },
  PERIOD_2_YEARS: {
    id: 'PERIOD_2_YEARS',
    preapprovalPlanId: '7f13f82fe69545308fea8056fe4ef83d',
    subscriptionUrl: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=7f13f82fe69545308fea8056fe4ef83d',
    period: '24 meses',
    periodMonths: 24,
    pricePerMonth: 5900,
    totalPrice: 5900 * 24,
    discount: 0,
  },
};

/**
 * Obtiene el plan de suscripción para un período
 */
export function getMercadoPagoPlan(periodId: PeriodId): MercadoPagoPlan {
  const plan = MERCADOPAGO_PLANS[periodId];
  
  if (!plan) {
    throw new Error(`Plan no encontrado: ${periodId}`);
  }
  
  return plan;
}

/**
 * Valida que un periodId es válido
 */
export function isValidMercadoPagoPeriod(periodId: string): periodId is PeriodId {
  return periodId in MERCADOPAGO_PLANS;
}

/**
 * Obtiene la URL de suscripción para un período específico
 * Agrega parámetros adicionales a la URL
 */
export function getSubscriptionUrl(
  periodId: PeriodId,
  orderId: string,
  domain: string
): string {
  const plan = getMercadoPagoPlan(periodId);
  
  // Agregar parámetros a la URL para tracking
  const url = new URL(plan.subscriptionUrl);
  url.searchParams.append('external_reference', orderId);
  url.searchParams.append('reason', `Dominio: ${domain}`);
  
  return url.toString();
}

