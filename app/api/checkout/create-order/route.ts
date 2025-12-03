import { NextRequest, NextResponse } from 'next/server';
import { optionalAuth, isAdminConfigured } from '@/lib/firebase-admin';
import { createOrder } from '@/lib/firestore-utils';
import { checkDomain } from '@/lib/domain-api';
import { getMercadoPagoPlan, getSubscriptionUrl, isValidMercadoPagoPeriod, PeriodId } from '@/config/mercadopago-plans';
import { CreateOrderResponse } from '@/types/firestore';
import { z } from 'zod';

// Validación del request
const createOrderSchema = z.object({
  domain: z.string().min(1, 'Dominio requerido'),
  periodId: z.enum(['PERIOD_1_MONTH', 'PERIOD_1_YEAR', 'PERIOD_2_YEARS']),
  customerData: z.object({
    name: z.string().min(1, 'Nombre requerido'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(1, 'Teléfono requerido'),
    company: z.string().optional(),
    cuit: z.string().optional(),
  }).optional(),
});

/**
 * POST /api/checkout/create-order
 * Crea una orden y devuelve el link de suscripción de Mercado Pago
 * 
 * SEGURIDAD:
 * - Los precios ya están configurados en Mercado Pago (planes de suscripción)
 * - Solo devuelve el link correcto según el período
 * - Verifica disponibilidad del dominio
 * - Usa userId del token verificado (si está autenticado)
 */
export async function POST(request: NextRequest) {
  try {
    // MODO DEMO: Si Firebase no está configurado
    if (!isAdminConfigured) {
      return NextResponse.json({
        success: false,
        error: 'Sistema no configurado',
        demo: true,
        message: 'Para habilitar el sistema completo, configura Firebase. Ver: docs/SETUP_FIREBASE_MP.md',
      }, { status: 503 });
    }
    
    // Verificar autenticación (opcional - permite checkout invitado)
    const authUser = await optionalAuth(request);
    
    // Parse y validar body
    const body = await request.json();
    const validated = createOrderSchema.parse(body);
    
    // 1. Verificar que el periodId es válido
    if (!isValidMercadoPagoPeriod(validated.periodId)) {
      return NextResponse.json(
        { success: false, error: 'Período inválido' },
        { status: 400 }
      );
    }
    
    // 2. Verificar disponibilidad del dominio
    // Extraer nombre y TLD del dominio completo
    const domainParts = validated.domain.split('.');
    const domainName = domainParts[0];
    const tld = '.' + domainParts.slice(1).join('.');
    
    try {
      const domainCheck = await checkDomain(domainName, tld as any);
      
      if (!domainCheck.available) {
        return NextResponse.json(
          { success: false, error: 'El dominio no está disponible' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Error verificando dominio:', error);
      return NextResponse.json(
        { success: false, error: 'Error al verificar disponibilidad del dominio' },
        { status: 500 }
      );
    }
    
    // 3. Obtener información del plan de Mercado Pago
    const mpPlan = getMercadoPagoPlan(validated.periodId);
    
    // 4. Crear orden en Firestore con estado "pending"
    let orderId: string;
    let orderNumber: string;
    
    try {
      const result = await createOrder({
        userId: authUser?.uid, // Opcional para checkout invitado
        domain: validated.domain,
        period: mpPlan.periodMonths,
        amount: mpPlan.totalPrice,
        discount: mpPlan.discount,
        total: mpPlan.totalPrice,
        paymentMethod: 'mercadopago',
        metadata: validated.customerData ? {
          customerEmail: validated.customerData.email,
          customerName: validated.customerData.name,
          customerPhone: validated.customerData.phone,
          customerCompany: validated.customerData.company,
          customerCuit: validated.customerData.cuit,
          preapprovalPlanId: mpPlan.preapprovalPlanId,
        } : {
          preapprovalPlanId: mpPlan.preapprovalPlanId,
        },
      });
      
      orderId = result.id;
      orderNumber = result.orderNumber;
      
      console.log('[Checkout] Orden creada:', {
        orderId,
        orderNumber,
        domain: validated.domain,
        plan: mpPlan.period,
      });
    } catch (firestoreError) {
      console.error('Error creando orden en Firestore:', firestoreError);
      throw new Error('Error al crear orden en la base de datos');
    }
    
    // 5. Obtener URL de suscripción de Mercado Pago
    const subscriptionUrl = getSubscriptionUrl(
      validated.periodId,
      orderId,
      validated.domain
    );
    
    console.log('[Checkout] URL de suscripción:', subscriptionUrl);
    
    // 6. Devolver URL de suscripción para redirección
    const result: CreateOrderResponse = {
      success: true,
      orderId,
      orderNumber,
      total: mpPlan.totalPrice,
      mercadopago: {
        init_point: subscriptionUrl,
        preferenceId: mpPlan.preapprovalPlanId,
      },
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error creando orden:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Error al crear orden' },
      { status: 500 }
    );
  }
}

