// Estado de disponibilidad del dominio
export type DomainStatus = 
  | 'available'      // Disponible para registrar
  | 'registered'     // Ya registrado
  | 'premium'        // Premium/reservado
  | 'restricted'     // Restringido
  | 'error'          // Error en consulta
  | 'checking';      // Consultando...

// TLDs soportados
export type TLD = 
  | '.ar'
  | '.com.ar'
  | '.net.ar'
  | '.org.ar'
  | '.com'
  | '.net'
  | '.org'
  | '.io';

// Información completa del dominio
export interface DomainInfo {
  domain: string;                    // Nombre completo (ej: "ejemplo.com.ar")
  name: string;                      // Solo el nombre (ej: "ejemplo")
  tld: TLD;                          // Extensión
  status: DomainStatus;              // Estado
  available: boolean;                // Disponible o no
  
  // Información WHOIS/RDAP (si está registrado)
  registrationDate?: string;         // Fecha de registro
  expirationDate?: string;           // Fecha de vencimiento
  registrant?: string;               // Registrante
  registrar?: string;                // Registrador
  nameservers?: string[];            // DNS
  
  // Metadata
  lastChecked: string;               // Última verificación
  source: 'rdap' | 'whois' | 'cache'; // Fuente de datos
  
  // UI
  isPremium?: boolean;               // Si es premium
  suggestedPrice?: number;           // Precio sugerido
  alternativeSuggestions?: string[]; // Sugerencias alternativas
}

// Request de búsqueda
export interface DomainSearchRequest {
  query: string;                     // Búsqueda del usuario
  tlds: TLD[];                       // TLDs a verificar
  includeAlternatives?: boolean;     // Incluir sugerencias
}

// Response de búsqueda
export interface DomainSearchResponse {
  results: DomainInfo[];             // Resultados
  suggestions: DomainInfo[];         // Sugerencias
  searchTime: number;                // Tiempo de búsqueda (ms)
  cached: boolean;                   // Si vino de caché
}

export type DomainCheckError = 
  | 'INVALID_FORMAT'
  | 'TLD_NOT_SUPPORTED'
  | 'API_ERROR'
  | 'RATE_LIMIT'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN';

