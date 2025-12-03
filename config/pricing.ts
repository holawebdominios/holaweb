/**
 * CONFIGURACIÓN DE PRECIOS
 * Esta es la ÚNICA fuente de verdad para precios
 * El frontend NUNCA debe calcular precios, solo mostrarlos
 */

export type PeriodId = 'PERIOD_1_YEAR' | 'PERIOD_2_YEARS' | 'PERIOD_3_YEARS';

export interface PricingPeriod {
  id: PeriodId;
  years: number;
  label: string;
  price: number;         // Precio base
  discount: number;      // Porcentaje de descuento
  total: number;         // Precio final
}

/**
 * Precios base por año
 */
const PRICE_PER_YEAR = 5900;

/**
 * Configuración de períodos y descuentos
 * FUENTE DE VERDAD PARA PRECIOS
 */
export const PRICING_PERIODS: Record<PeriodId, PricingPeriod> = {
  PERIOD_1_YEAR: {
    id: 'PERIOD_1_YEAR',
    years: 1,
    label: '1 año',
    price: PRICE_PER_YEAR,
    discount: 0,
    total: PRICE_PER_YEAR,
  },
  PERIOD_2_YEARS: {
    id: 'PERIOD_2_YEARS',
    years: 2,
    label: '2 años',
    price: PRICE_PER_YEAR * 2,
    discount: 10,
    total: Math.round(PRICE_PER_YEAR * 2 * 0.9),
  },
  PERIOD_3_YEARS: {
    id: 'PERIOD_3_YEARS',
    years: 3,
    label: '3 años',
    price: PRICE_PER_YEAR * 3,
    discount: 17,
    total: Math.round(PRICE_PER_YEAR * 3 * 0.83),
  },
};

/**
 * Calcula el precio para un período específico
 * ESTA FUNCIÓN SOLO SE USA EN EL BACKEND
 */
export function calculatePrice(periodId: PeriodId): {
  amount: number;
  discount: number;
  total: number;
  years: number;
} {
  const period = PRICING_PERIODS[periodId];
  
  if (!period) {
    throw new Error(`Período inválido: ${periodId}`);
  }
  
  return {
    amount: period.price,
    discount: period.discount,
    total: period.total,
    years: period.years,
  };
}

/**
 * Valida que un periodId es válido
 */
export function isValidPeriodId(periodId: string): periodId is PeriodId {
  return periodId in PRICING_PERIODS;
}

/**
 * Obtiene todos los períodos disponibles (para mostrar en frontend)
 * Solo incluye datos necesarios para UI, NO lógica de cálculo
 */
export function getAllPeriods(): PricingPeriod[] {
  return Object.values(PRICING_PERIODS);
}

