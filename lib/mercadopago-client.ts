import { MercadoPagoConfig } from 'mercadopago';

/**
 * Cliente de Mercado Pago (Singleton)
 * Se inicializa con el access token desde variables de entorno
 */

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

export const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: accessToken || 'TEST-demo-token',
  options: {
    timeout: 5000,
    idempotencyKey: 'hola-empresa',
  }
});

