/**
 * CONFIGURACIÓN DE MARCA - HOLA EMPRESA
 * Centralización de colores, textos y constantes de marca
 */

export const BRAND = {
  // Nombre
  name: 'Hola Empresa',
  slogan: 'El 0800 de siempre, pero ahora con Hola',
  
  // Colores (usar con Tailwind: bg-brand-blue, text-brand-orange, etc.)
  colors: {
    blue: '#13314c',        // Azul principal (navbar, footer)
    blueDark: '#0a1f30',    // Azul oscuro (hover)
    orange: '#ff9900',      // Naranja principal (CTAs)
    orangeDark: '#ff8800',  // Naranja oscuro (hover)
    cream: '#faf8f5',       // Fondo crema
    light: '#ffffff',       // Blanco
    success: '#10b981',     // Verde (badges)
  },
  
  // Contacto
  contact: {
    whatsapp: '+5491169004037',
    whatsappFormatted: '+54 9 11 6900-4037',
    email: 'holawebdominios@gmail.com',
    phone: '+541134976239',
    phoneFormatted: '+54 11 3497-6239',
  },
  
  // Horarios
  schedule: 'Lunes a Viernes 9:00 - 18:00',
  
  // Social
  social: {
    whatsapp: 'https://wa.me/5491169004037',
    email: 'mailto:holawebdominios@gmail.com',
  },
} as const;

export type Brand = typeof BRAND;

