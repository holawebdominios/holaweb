import { DomainInfo, TLD } from '@/types/domain';
import { checkDomainRDAP } from './rdap-client';

// Verificar si es TLD argentino
export function isArgentineTLD(tld: string): boolean {
  return ['.ar', '.com.ar', '.net.ar', '.org.ar'].includes(tld);
}

// Construir dominio completo
export function buildFullDomain(name: string, tld: TLD): string {
  return `${name}${tld}`;
}

// Extraer nombre y TLD de dominio completo
export function parseDomain(fullDomain: string): { name: string; tld: string } {
  const parts = fullDomain.split('.');
  const name = parts[0];
  const tld = `.${parts.slice(1).join('.')}`;
  return { name, tld };
}

// Función principal de verificación con RDAP real
export async function checkDomain(domain: string, tld: TLD): Promise<DomainInfo> {
  const fullDomain = `${domain}${tld}`;
  
  try {
    // Si es TLD argentino, usar RDAP de NIC Argentina
    if (isArgentineTLD(tld)) {
      return await checkDomainRDAP(domain, tld);
    }
    
    // Para TLDs internacionales, por ahora retornar mock
    // TODO: Integrar WhoAPI o WhoisXML para dominios internacionales
    console.log(`Verificación de ${fullDomain} - TLD internacional (mock)`);
    
    return {
      domain: fullDomain,
      name: domain,
      tld,
      status: 'error',
      available: false,
      lastChecked: new Date().toISOString(),
      source: 'rdap',
    };
  } catch (error) {
    console.error(`Error verificando dominio ${fullDomain}:`, error);
    
    return {
      domain: fullDomain,
      name: domain,
      tld,
      status: 'error',
      available: false,
      lastChecked: new Date().toISOString(),
      source: 'rdap',
    };
  }
}

// Generar sugerencias
export function generateSuggestions(domain: string): string[] {
  return [
    `${domain}-ar`,
    `${domain}2`,
    `mi-${domain}`,
    `${domain}-online`
  ];
}

