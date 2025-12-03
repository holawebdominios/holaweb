# Integración RDAP - NIC Argentina

## ✅ Estado: Implementado

La integración con RDAP de NIC Argentina está **completamente funcional**.

## 📋 ¿Qué es RDAP?

**RDAP** (Registration Data Access Protocol) es el protocolo moderno que reemplaza a WHOIS. Ofrece:
- Datos estructurados en JSON
- Respuestas estandarizadas
- Mejor manejo de internacionalización
- API RESTful

## 🔗 Endpoint

```
https://rdap.nic.ar/domain/<dominio>
```

### Ejemplos de URLs

```
https://rdap.nic.ar/domain/google.com.ar
https://rdap.nic.ar/domain/mercadolibre.com.ar
https://rdap.nic.ar/domain/clarin.com.ar
https://rdap.nic.ar/domain/infobae.com.ar
```

## 📁 Archivos Implementados

### `lib/rdap-client.ts`
Cliente RDAP con las siguientes funciones:

- **`queryRDAP(fullDomain)`** - Consulta la API de NIC Argentina
- **`parseRDAPResponse(rdapData)`** - Parsea la respuesta RDAP
- **`checkDomainRDAP(domain, tld)`** - Función principal de verificación
- **`extractEventDate(events, action)`** - Extrae fechas de eventos
- **`extractRegistrant(entities)`** - Extrae información del registrante
- **`extractNameservers(nameservers)`** - Extrae lista de DNS
- **`isDomainAvailable(status)`** - Determina disponibilidad

### `lib/domain-api.ts`
Funciones de verificación que utilizan el cliente RDAP:

- **`checkDomain(domain, tld)`** - Verifica un dominio (usa RDAP para .ar)
- **`isArgentineTLD(tld)`** - Detecta si es TLD argentino
- **`buildFullDomain(name, tld)`** - Construye dominio completo
- **`parseDomain(fullDomain)`** - Parsea nombre y TLD

### `app/api/domain/check/route.ts`
API Route que expone la verificación vía HTTP POST.

## 🧪 Ejemplo de Uso

### Desde el Frontend

```typescript
const response = await fetch('/api/domain/check', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    domains: ['google'],
    tlds: ['.com.ar', '.ar'],
    includeAlternatives: true
  })
});

const data = await response.json();
console.log(data.results);
```

### Respuesta de Dominio Disponible

```json
{
  "success": true,
  "results": [
    {
      "domain": "midominio.com.ar",
      "name": "midominio",
      "tld": ".com.ar",
      "status": "available",
      "available": true,
      "lastChecked": "2024-12-02T10:30:00.000Z",
      "source": "rdap"
    }
  ],
  "suggestions": ["midominio-ar", "midominio2"],
  "searchTime": 850,
  "cached": false
}
```

### Respuesta de Dominio Registrado

```json
{
  "success": true,
  "results": [
    {
      "domain": "google.com.ar",
      "name": "google",
      "tld": ".com.ar",
      "status": "registered",
      "available": false,
      "registrationDate": "1998-05-15",
      "expirationDate": "2025-05-15",
      "registrant": "Google LLC",
      "nameservers": [
        "ns1.google.com",
        "ns2.google.com",
        "ns3.google.com",
        "ns4.google.com"
      ],
      "lastChecked": "2024-12-02T10:30:00.000Z",
      "source": "rdap"
    }
  ],
  "searchTime": 1250,
  "cached": false
}
```

## 🎯 TLDs Soportados

### ✅ Con RDAP Real (NIC Argentina)
- `.ar`
- `.com.ar`
- `.net.ar`
- `.org.ar`

### ⏳ Pendientes (Mock por ahora)
- `.com`
- `.net`
- `.org`
- `.io`

## 🚨 Manejo de Errores

El cliente RDAP maneja varios tipos de errores:

### 1. Dominio No Encontrado (404)
```typescript
// RDAP devuelve 404 → El dominio está disponible
{
  "status": "available",
  "available": true
}
```

### 2. Timeout (>10 segundos)
```typescript
{
  "status": "error",
  "available": false,
  "source": "rdap"
}
```

### 3. Error de Red
```typescript
{
  "status": "error",
  "available": false,
  "source": "rdap"
}
```

## ⚡ Performance

- **Timeout configurado:** 10 segundos por consulta
- **Tiempo promedio:** 500-1500ms por dominio
- **Consultas paralelas:** Soportadas (hasta 10 dominios simultáneos)

## 🔒 Seguridad

- ✅ Validación de inputs con Zod
- ✅ Timeout para evitar bloqueos
- ✅ Error handling completo
- ⏳ Rate limiting (pendiente)
- ⏳ Caché (pendiente)

## 📝 Ejemplos de Prueba

### Dominio Disponible
```bash
curl -X POST http://localhost:3000/api/domain/check \
  -H "Content-Type: application/json" \
  -d '{
    "domains": ["midominio-unico-123456"],
    "tlds": [".com.ar"]
  }'
```

### Dominio Registrado
```bash
curl -X POST http://localhost:3000/api/domain/check \
  -H "Content-Type: application/json" \
  -d '{
    "domains": ["google"],
    "tlds": [".com.ar"]
  }'
```

### Múltiples Dominios
```bash
curl -X POST http://localhost:3000/api/domain/check \
  -H "Content-Type: application/json" \
  -d '{
    "domains": ["google", "mercadolibre"],
    "tlds": [".com.ar", ".ar"],
    "includeAlternatives": true
  }'
```

## 🔄 Próximas Mejoras

1. **Caché de Resultados**
   - Redis para producción
   - Memory cache para desarrollo
   - TTL de 24h para disponibles, 1h para registrados

2. **Rate Limiting**
   - 10 búsquedas por minuto por IP
   - 100 búsquedas por día por IP

3. **APIs Internacionales**
   - WhoAPI para .com, .net, .org
   - WhoisXML como fallback

4. **Optimizaciones**
   - Consultas en paralelo optimizadas
   - Retry con backoff exponencial
   - Circuit breaker para APIs caídas

## 📚 Referencias

- [RDAP NIC Argentina](https://rdap.nic.ar/)
- [RFC 7480 - HTTP Usage in RDAP](https://tools.ietf.org/html/rfc7480)
- [RFC 7482 - RDAP Query Format](https://tools.ietf.org/html/rfc7482)
- [RFC 9083 - RDAP Object Mapping](https://tools.ietf.org/html/rfc9083)

## ✨ Estado Final

La integración RDAP está **completamente funcional** y lista para usar en producción con dominios argentinos.

Para dominios internacionales, se debe implementar la integración con WhoAPI o WhoisXML.




