# Flujo de Verificación de Dominios

## Descripción General

El verificador de dominios es el core funcional de la plataforma. Permite a usuarios consultar la disponibilidad y obtener información detallada de dominios argentinos e internacionales.

## Arquitectura del Verificador


### Frontend (UI)
```
Usuario → Input → Validación → API Call → Loading → Resultados
```

### Backend (API)
```
API Route → Validación → RDAP/WHOIS → Parse → Cache → Response
```

---

## Flujo Detallado

### 1. Input del Usuario

**Componente**: `DomainSearchForm`

**Proceso**:
1. Usuario ingresa dominio(s) en el input
2. Validación en tiempo real del formato
3. Autocompletado de TLD si no se especifica
4. Sanitización del input (remover http://, www., etc.)

**Validaciones**:
- Longitud: 1-63 caracteres
- Caracteres permitidos: a-z, 0-9, guión (no al inicio/fin)
- No espacios, caracteres especiales
- TLD válido

**Estados del Input**:
```typescript
type InputState = 
  | 'empty'      // Sin texto
  | 'typing'     // Usuario escribiendo
  | 'valid'      // Formato válido
  | 'invalid'    // Formato inválido
  | 'searching'; // Buscando
```

**Ejemplo de UI**:
```
┌─────────────────────────────────────────┐
│  🔍  midominio                          │
│                                         │
│  Sugerencias:                           │
│  • midominio.com.ar                     │
│  • midominio.ar                         │
└─────────────────────────────────────────┘
```

---

### 2. Selección de TLD

**Componente**: `TLDSelector`

**Opciones**:
- **Todos**: Buscar en todos los TLDs configurados
- **Solo .ar**: Dominios argentinos
- **Personalizados**: Selección múltiple

**UI Sugerida**:
```
[ ] .ar        [ ] .com.ar     [ ] .net.ar
[ ] .org.ar    [ ] .com        [ ] .net
```

O dropdown con búsqueda:
```
┌─────────────────────────┐
│ Seleccionar TLDs ▼      │
├─────────────────────────┤
│ ☑ .ar                   │
│ ☑ .com.ar               │
│ ☑ .net.ar               │
│ ☐ .org.ar               │
│ ☐ .com                  │
└─────────────────────────┘
```

---

### 3. Consulta a API

**Endpoint**: `POST /api/domain/check`

**Request**:
```typescript
{
  "domains": ["ejemplo"],
  "tlds": [".ar", ".com.ar", ".net.ar"],
  "includeAlternatives": true
}
```

**Response**:
```typescript
{
  "results": [
    {
      "domain": "ejemplo.ar",
      "status": "registered",
      "available": false,
      "registrationDate": "2020-05-15",
      "expirationDate": "2025-05-15",
      "registrant": "Empresa SA",
      "nameservers": ["ns1.example.com", "ns2.example.com"]
    },
    {
      "domain": "ejemplo.com.ar",
      "status": "available",
      "available": true
    }
  ],
  "suggestions": [
    "ejemplo-ar.com.ar",
    "miempresa.com.ar"
  ],
  "searchTime": 1250,
  "cached": false
}
```

---

## Integración con RDAP (NIC Argentina)

### Endpoint RDAP
```
https://rdap.nic.ar/domain/{dominio}
```

### Ejemplo de Consulta

**Request**:
```bash
GET https://rdap.nic.ar/domain/ejemplo.com.ar
```

**Response** (simplificada):
```json
{
  "objectClassName": "domain",
  "ldhName": "ejemplo.com.ar",
  "status": ["active"],
  "events": [
    {
      "eventAction": "registration",
      "eventDate": "2020-05-15T10:00:00Z"
    },
    {
      "eventAction": "expiration",
      "eventDate": "2025-05-15T10:00:00Z"
    }
  ],
  "entities": [
    {
      "roles": ["registrant"],
      "vcardArray": [...]
    }
  ],
  "nameservers": [
    {
      "ldhName": "ns1.example.com"
    }
  ]
}
```

### Mapeo a Nuestro Modelo

**Función**: `lib/domain-api.ts → parseRDAPResponse()`

```typescript
function parseRDAPResponse(rdapData: any): DomainInfo {
  return {
    domain: rdapData.ldhName,
    name: rdapData.ldhName.split('.')[0],
    tld: `.${rdapData.ldhName.split('.').slice(1).join('.')}`,
    status: rdapData.status.includes('active') ? 'registered' : 'available',
    available: !rdapData.status.includes('active'),
    registrationDate: findEvent(rdapData.events, 'registration'),
    expirationDate: findEvent(rdapData.events, 'expiration'),
    registrant: extractRegistrant(rdapData.entities),
    nameservers: rdapData.nameservers?.map(ns => ns.ldhName),
    lastChecked: new Date().toISOString(),
    source: 'rdap'
  };
}
```

---

## Integración con APIs Internacionales

### Proveedores Sugeridos

#### 1. WhoAPI
```
Endpoint: https://api.whoapi.com/
Planes: Freemium con límites
TLDs: 500+ internacionales
```

#### 2. WhoisXML API
```
Endpoint: https://www.whoisxmlapi.com/
Planes: Pay-per-use
TLDs: 3000+ internacionales
```

#### 3. Domainr
```
Endpoint: https://domainr.com/api/
Planes: Freemium
Especialidad: Sugerencias inteligentes
```

### Estrategia de Integración

**Prioridad**:
1. RDAP NIC Argentina (dominios .ar)
2. WhoAPI (dominios internacionales)
3. Fallback a WhoisXML si WhoAPI falla
4. Domainr solo para sugerencias

**Implementación**:
```typescript
// lib/domain-api.ts

async function checkDomain(domain: string, tld: TLD): Promise<DomainInfo> {
  const fullDomain = `${domain}${tld}`;
  
  // Determinar proveedor según TLD
  if (isArgentineTLD(tld)) {
    return await checkRDAP(fullDomain);
  } else {
    return await checkWhoAPI(fullDomain);
  }
}

async function checkRDAP(domain: string): Promise<DomainInfo> {
  try {
    const response = await fetch(`https://rdap.nic.ar/domain/${domain}`);
    const data = await response.json();
    return parseRDAPResponse(data);
  } catch (error) {
    return handleRDAPError(error, domain);
  }
}

async function checkWhoAPI(domain: string): Promise<DomainInfo> {
  // Implementación con WhoAPI
  // Incluir API key desde variables de entorno
}
```

---

## Estados de la UI

### Loading States

**Componente**: `SearchResults`

```typescript
type SearchState = 
  | 'idle'       // Sin búsqueda
  | 'validating' // Validando input
  | 'searching'  // Consultando APIs
  | 'success'    // Resultados listos
  | 'error';     // Error en consulta

// UI por estado
switch (searchState) {
  case 'idle':
    return <EmptyState />;
  case 'validating':
    return <ValidatingIndicator />;
  case 'searching':
    return <LoadingSkeletons />;
  case 'success':
    return <ResultsList />;
  case 'error':
    return <ErrorMessage />;
}
```

### Skeleton Loaders

Durante la búsqueda, mostrar skeletons:
```
┌─────────────────────────────┐
│ ░░░░░░░░.com.ar             │
│ ░░░░░░░░░░░░░░              │
│ ░░░░░░░░░░                  │
└─────────────────────────────┘
```

---

## Presentación de Resultados

### Dominio Disponible

```
┌─────────────────────────────────────────┐
│  ✓  ejemplo.com.ar                      │
│                                         │
│  DISPONIBLE                             │
│                                         │
│  Este dominio está libre y puede ser   │
│  registrado.                            │
│                                         │
│  [ Contratar Gestión ]  [ Ver en NIC ] │
└─────────────────────────────────────────┘
```

### Dominio Registrado

```
┌─────────────────────────────────────────┐
│  ⓘ  ejemplo.com.ar                      │
│                                         │
│  REGISTRADO                             │
│                                         │
│  Registrado: 15/05/2020                 │
│  Vence: 15/05/2025                      │
│  Registrante: Empresa SA                │
│  DNS: ns1.example.com                   │
│                                         │
│  [ Gestionar ]  [ Ver en NIC ]         │
└─────────────────────────────────────────┘
```

### Dominio Premium

```
┌─────────────────────────────────────────┐
│  ⭐  premium.com.ar                     │
│                                         │
│  PREMIUM - $50,000                      │
│                                         │
│  Este dominio está disponible como     │
│  premium. Contactanos para más info.   │
│                                         │
│  [ Consultar Precio ]                  │
└─────────────────────────────────────────┘
```

### Error en Consulta

```
┌─────────────────────────────────────────┐
│  ✕  ejemplo.com.ar                      │
│                                         │
│  ERROR AL VERIFICAR                     │
│                                         │
│  No pudimos verificar este dominio.    │
│  Por favor, intentá nuevamente.        │
│                                         │
│  [ Reintentar ]                        │
└─────────────────────────────────────────┘
```

---

## Sugerencias Inteligentes

### Algoritmo de Sugerencias

Cuando un dominio está tomado, sugerir:

1. **Variaciones de nombre**:
   - Con guión: `mi-dominio.com.ar`
   - Con número: `midominio1.com.ar`
   - Abreviado: `midom.com.ar`

2. **Otros TLDs**:
   - Si `.com.ar` está tomado, probar `.ar`, `.net.ar`

3. **Sinónimos**:
   - `empresa` → `compania`, `negocio`
   - `tienda` → `shop`, `store`

4. **Geolocalización**:
   - `midominio-bsas.com.ar`
   - `midominio-argentina.com`

**Componente**: `DomainSuggestions`

```typescript
interface DomainSuggestionsProps {
  originalDomain: string;
  suggestions: DomainInfo[];
  onSelect: (domain: string) => void;
}
```

---

## Caché y Optimización

### Estrategia de Caché

**Nivel 1: Cliente (localStorage)**
- Búsquedas recientes (últimas 10)
- TTL: 1 hora
- Solo para mostrar historial

**Nivel 2: Servidor (Memory/Redis)**
- Resultados de dominios populares
- TTL: 24 horas para disponibles
- TTL: 1 hora para registrados
- Invalidación manual si es necesario

**Nivel 3: CDN (Vercel Edge)**
- Respuestas de API cacheadas
- TTL: Configurable por endpoint

### Rate Limiting

**Límites públicos**:
- 10 búsquedas por minuto por IP
- 100 búsquedas por día por IP
- Cooldown de 2 segundos entre búsquedas

**Implementación**:
```typescript
// middleware.ts o API route
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for');
  
  const { success, remaining } = await rateLimit(ip, {
    limit: 10,
    window: '1m'
  });
  
  if (!success) {
    return Response.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  // Continuar con la búsqueda...
}
```

---

## Error Handling

### Tipos de Errores

```typescript
export type DomainCheckError = 
  | 'INVALID_FORMAT'      // Formato inválido
  | 'TLD_NOT_SUPPORTED'   // TLD no soportado
  | 'API_ERROR'           // Error en API externa
  | 'RATE_LIMIT'          // Límite excedido
  | 'NETWORK_ERROR'       // Error de red
  | 'TIMEOUT'             // Timeout
  | 'UNKNOWN';            // Error desconocido

export interface DomainCheckErrorResponse {
  error: DomainCheckError;
  message: string;
  details?: string;
  retryAfter?: number; // Segundos para reintentar
}
```

### Mensajes de Error Amigables

```typescript
const errorMessages: Record<DomainCheckError, string> = {
  INVALID_FORMAT: "El formato del dominio no es válido. Verificá que solo contenga letras, números y guiones.",
  TLD_NOT_SUPPORTED: "Esta extensión de dominio no está soportada aún.",
  API_ERROR: "Hubo un problema al verificar el dominio. Por favor, intentá nuevamente.",
  RATE_LIMIT: "Realizaste muchas búsquedas. Por favor, esperá unos segundos.",
  NETWORK_ERROR: "Problema de conexión. Verificá tu internet e intentá nuevamente.",
  TIMEOUT: "La búsqueda tardó demasiado. Por favor, intentá nuevamente.",
  UNKNOWN: "Ocurrió un error inesperado. Contactanos si el problema persiste."
};
```

---

## API Routes (Next.js)

### 1. Verificar Dominio
**Endpoint**: `POST /api/domain/check`

**Request**:
```typescript
{
  "domains": ["ejemplo"],
  "tlds": [".com.ar", ".ar"],
  "includeAlternatives": true
}
```

**Response**:
```typescript
{
  "success": true,
  "results": DomainInfo[],
  "suggestions": DomainInfo[],
  "searchTime": 1250,
  "cached": false
}
```

**Implementación** (estructura):
```typescript
// app/api/domain/check/route.ts

export async function POST(request: Request) {
  try {
    // 1. Parse y validar request
    const body = await request.json();
    const validated = domainSearchSchema.parse(body);
    
    // 2. Rate limiting
    const rateLimitResult = await checkRateLimit(request);
    if (!rateLimitResult.success) {
      return rateLimitError();
    }
    
    // 3. Verificar caché
    const cached = await checkCache(validated.domains);
    if (cached) {
      return Response.json({ ...cached, cached: true });
    }
    
    // 4. Consultar APIs externas
    const results = await Promise.all(
      validated.domains.map(domain => 
        checkDomainAvailability(domain, validated.tlds)
      )
    );
    
    // 5. Generar sugerencias si se solicita
    const suggestions = validated.includeAlternatives
      ? await generateSuggestions(validated.domains[0])
      : [];
    
    // 6. Guardar en caché
    await saveToCache(results);
    
    // 7. Retornar respuesta
    return Response.json({
      success: true,
      results,
      suggestions,
      searchTime: Date.now() - startTime,
      cached: false
    });
    
  } catch (error) {
    return handleAPIError(error);
  }
}
```

---

### 2. Obtener Sugerencias
**Endpoint**: `GET /api/domain/suggestions?q={domain}`

**Response**:
```typescript
{
  "suggestions": [
    "ejemplo-ar.com.ar",
    "ejemplo2.com.ar",
    "miempresa.com.ar"
  ]
}
```

---

### 3. Verificar Disponibilidad Rápida
**Endpoint**: `GET /api/domain/quick-check?domain={domain}`

**Response**:
```typescript
{
  "domain": "ejemplo.com.ar",
  "available": false,
  "status": "registered"
}
```

---

## Funciones Helper

### `lib/domain-api.ts`

```typescript
// Verificar si es TLD argentino
export function isArgentineTLD(tld: string): boolean {
  return ['.ar', '.com.ar', '.net.ar', '.org.ar'].includes(tld);
}

// Construir dominio completo
export function buildFullDomain(name: string, tld: TLD): string {
  return `${name}${tld}`;
}

// Extraer nombre y TLD de dominio completo
export function parseDomain(fullDomain: string): { name: string; tld: TLD } {
  const parts = fullDomain.split('.');
  const name = parts[0];
  const tld = `.${parts.slice(1).join('.')}` as TLD;
  return { name, tld };
}

// Validar formato de dominio
export function validateDomainFormat(domain: string): boolean {
  const regex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/i;
  return regex.test(domain);
}

// Sanitizar input de usuario
export function sanitizeDomainInput(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
    .split('/')[0];
}
```

---

## Testing del Verificador

### Casos de Prueba

```typescript
describe('Domain Check Flow', () => {
  test('Dominio disponible', async () => {
    const result = await checkDomain('dominio-libre-123', '.com.ar');
    expect(result.available).toBe(true);
    expect(result.status).toBe('available');
  });
  
  test('Dominio registrado', async () => {
    const result = await checkDomain('google', '.com.ar');
    expect(result.available).toBe(false);
    expect(result.status).toBe('registered');
    expect(result.registrationDate).toBeDefined();
  });
  
  test('Formato inválido', async () => {
    await expect(
      checkDomain('-invalid-', '.com.ar')
    ).rejects.toThrow('Formato inválido');
  });
  
  test('Rate limit', async () => {
    // Hacer 11 requests seguidos
    for (let i = 0; i < 11; i++) {
      if (i < 10) {
        await checkDomain(`test${i}`, '.com.ar');
      } else {
        await expect(
          checkDomain('test11', '.com.ar')
        ).rejects.toThrow('Rate limit');
      }
    }
  });
});
```

---

## Roadmap de Implementación

### Fase 1: UI Básica (Sprint 3.1)
- [ ] Componente DomainSearchForm
- [ ] Validación de input
- [ ] Estados de loading
- [ ] Diseño de cards de resultados

### Fase 2: Integración RDAP (Sprint 3.2)
- [ ] API route para verificación
- [ ] Integración con RDAP NIC Argentina
- [ ] Parser de respuestas RDAP
- [ ] Manejo de errores

### Fase 3: Caché y Optimización (Sprint 3.3)
- [ ] Sistema de caché
- [ ] Rate limiting
- [ ] Optimización de consultas
- [ ] Logging de búsquedas

### Fase 4: Features Avanzadas (Sprint 3.4)
- [ ] Búsqueda múltiple
- [ ] Sugerencias inteligentes
- [ ] Integración con APIs internacionales
- [ ] Historial de búsquedas

---

## Consideraciones de Seguridad

### Input Sanitization
- Escapar caracteres especiales
- Limitar longitud de input
- Validar contra inyecciones
- Rate limiting estricto

### API Keys
- Variables de entorno para keys
- Rotación periódica
- Monitoreo de uso
- Límites por key

### CORS
```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://tudominio.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST' },
        ],
      },
    ];
  },
};
```

---

## Monitoreo y Logs

### Eventos a Loggear
- Búsquedas realizadas
- Errores de API
- Tiempos de respuesta
- Dominios más buscados
- Rate limits alcanzados

### Estructura de Log
```typescript
interface SearchLog {
  timestamp: string;
  ip: string;
  domain: string;
  tld: TLD;
  result: DomainStatus;
  responseTime: number;
  cached: boolean;
  error?: string;
}
```

---

## Mejoras Futuras

### Fase 2+
- [ ] Búsqueda por lotes (CSV upload)
- [ ] Comparación lado a lado
- [ ] Exportar resultados (PDF/CSV)
- [ ] Guardar búsquedas (requiere login)
- [ ] Alertas personalizadas
- [ ] Integración con registradores
- [ ] Compra directa de dominios

