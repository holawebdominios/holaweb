/**
 * CONFIGURACIÓN DE MARCA - HOLA EMPRESA
 * Centralización de colores, textos y constantes de marca
 */

export const BRAND = {
  // Nombre
  name: 'Hola Empresa',
  slogan: 'El 0800 de siempre, pero ahora con Hola',
  
  // Colores (usar con Tailwind: bg-brand-blue, text-brand-yellow, etc.)
  colors: {
    blue: '#0066CC',        // Azul principal (CTAs, enlaces)
    blueDark: '#004D99',    // Azul oscuro (hover)
    yellow: '#FFCC4D',      // Amarillo brand (destacados)
    yellowDark: '#F6A823',  // Amarillo oscuro (hover)
    lightBg: '#F2F6FB',     // Fondo secciones claras
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

