import { DomainInfo, TLD } from '@/types/domain';

// Interfaz de respuesta RDAP de NIC Argentina
interface RDAPResponse {
  objectClassName: string;
  ldhName: string;
  status?: string[];
  events?: Array<{
    eventAction: string;
    eventDate: string;
  }>;
  entities?: Array<{
    roles: string[];
    vcardArray?: any[];
  }>;
  nameservers?: Array<{
    ldhName: string;
  }>;
  errorCode?: number;
  title?: string;
  description?: string[];
}

// URL base de RDAP NIC Argentina
const RDAP_BASE_URL = 'https://rdap.nic.ar/domain/';

/**
 * Consulta RDAP de NIC Argentina para un dominio
 */
export async function queryRDAP(fullDomain: string): Promise<RDAPResponse> {
  const url = `${RDAP_BASE_URL}${fullDomain}`;
  
  try {
    // Crear AbortController para timeout manual
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Si el dominio no existe, RDAP devuelve 404
      if (response.status === 404) {
        return {
          objectClassName: 'domain',
          ldhName: fullDomain,
          status: ['not found'],
        };
      }
      
      throw new Error(`RDAP error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('TIMEOUT');
    }
    throw error;
  }
}

/**
 * Extrae la fecha de un evento RDAP
 */
function extractEventDate(events: RDAPResponse['events'], eventAction: string): string | undefined {
  if (!events) return undefined;
  
  const event = events.find(e => e.eventAction === eventAction);
  if (!event) return undefined;
  
  // Convertir ISO date a formato más legible
  const date = new Date(event.eventDate);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Extrae el registrante de las entidades RDAP
 */
function extractRegistrant(entities: RDAPResponse['entities']): string | undefined {
  if (!entities) return undefined;
  
  // Buscar entidad con rol 'registrant'
  const registrant = entities.find(e => e.roles.includes('registrant'));
  if (!registrant || !registrant.vcardArray) return undefined;
  
  try {
    // El vcard array tiene formato específico
    // ["vcard", [["version", {}, "text", "4.0"], ["fn", {}, "text", "Nombre"], ...]]
    const vcard = registrant.vcardArray[1];
    const fnEntry = vcard.find((entry: any[]) => entry[0] === 'fn');
    
    if (fnEntry && fnEntry[3]) {
      return fnEntry[3];
    }
  } catch (error) {
    console.error('Error extrayendo registrante:', error);
  }
  
  return undefined;
}

/**
 * Extrae nameservers de la respuesta RDAP
 */
function extractNameservers(nameservers: RDAPResponse['nameservers']): string[] | undefined {
  if (!nameservers || nameservers.length === 0) return undefined;
  
  return nameservers.map(ns => ns.ldhName);
}

/**
 * Determina si el dominio está disponible basado en el status RDAP
 */
function isDomainAvailable(status?: string[]): boolean {
  if (!status || status.length === 0) return true;
  
  // Estados que indican que el dominio está registrado
  const registeredStates = [
    'active',
    'ok',
    'locked',
    'clientHold',
    'serverHold',
    'pendingDelete',
    'pendingTransfer',
    'pendingUpdate'
  ];
  
  // Si tiene algún estado de registrado, no está disponible
  return !status.some(s => registeredStates.includes(s));
}

/**
 * Parsea la respuesta RDAP a nuestro formato DomainInfo
 */
export function parseRDAPResponse(rdapData: RDAPResponse, domain: string, tld: TLD): DomainInfo {
  const available = isDomainAvailable(rdapData.status);
  
  return {
    domain: rdapData.ldhName || `${domain}${tld}`,
    name: domain,
    tld,
    status: available ? 'available' : 'registered',
    available,
    registrationDate: available ? undefined : extractEventDate(rdapData.events, 'registration'),
    expirationDate: available ? undefined : extractEventDate(rdapData.events, 'expiration'),
    registrant: available ? undefined : extractRegistrant(rdapData.entities),
    nameservers: available ? undefined : extractNameservers(rdapData.nameservers),
    lastChecked: new Date().toISOString(),
    source: 'rdap',
  };
}

/**
 * Verifica un dominio argentino usando RDAP de NIC Argentina
 */
export async function checkDomainRDAP(domain: string, tld: TLD): Promise<DomainInfo> {
  const fullDomain = `${domain}${tld}`;
  
  console.log(`[RDAP] Verificando dominio: ${fullDomain}`);
  
  try {
    const rdapData = await queryRDAP(fullDomain);
    console.log(`[RDAP] Respuesta para ${fullDomain}:`, {
      status: rdapData.status,
      hasEvents: !!rdapData.events,
      hasEntities: !!rdapData.entities,
      hasNameservers: !!rdapData.nameservers
    });
    
    const result = parseRDAPResponse(rdapData, domain, tld);
    console.log(`[RDAP] Resultado parseado:`, {
      domain: result.domain,
      available: result.available,
      status: result.status
    });
    
    return result;
  } catch (error) {
    console.error(`[RDAP] Error verificando dominio ${fullDomain}:`, error);
    
    // Retornar error en formato DomainInfo
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


