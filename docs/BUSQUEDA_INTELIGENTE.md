# 🧠 Sistema de Búsqueda Inteligente

## Descripción

El sistema detecta automáticamente la intención del usuario y busca en las extensiones apropiadas.

## 🎯 Lógica de Búsqueda

### **Caso 1: Sin TLD especificado**
```
Usuario escribe: "ejemplo"
Sistema busca:   ejemplo.ar, ejemplo.com.ar, ejemplo.net.ar, ejemplo.org.ar
```

### **Caso 2: Con TLD específico**
```
Usuario escribe: "ejemplo.com.ar"
Sistema busca:   ejemplo.com.ar (solo ese)
```

### **Caso 3: Múltiples dominios**
```
Usuario escribe: "ejemplo1, ejemplo2.com.ar, ejemplo3"
Sistema busca:   
  - ejemplo1 → .ar, .com.ar, .net.ar, .org.ar
  - ejemplo2.com.ar → solo .com.ar
  - ejemplo3 → .ar, .com.ar, .net.ar, .org.ar
```

## 📍 Implementación por Componente

### **Hero Section**
- Input: "ejemplo o ejemplo.com.ar"
- Búsqueda: Por defecto solo `.com.ar` (búsqueda rápida)
- Si tiene TLD: Solo ese TLD específico

### **QuickDomainCheckSection** (Si se usa)
- Input: "ejemplo o ejemplo.com.ar"
- Búsqueda: Por defecto solo `.com.ar`
- Si tiene TLD: Solo ese TLD específico

### **/verificar (Página completa)**
- Input: "ejemplo1, ejemplo2, ejemplo.com.ar"
- Búsqueda inteligente: 
  - Sin TLD → Busca en todos los argentinos
  - Con TLD → Busca solo ese
- Info box explicativa visible

## 🎨 UI del Buscador

### **Hero:**
```
┌─────────────────────────────────────┐
│ 🔍 [ejemplo o ejemplo.com.ar____]   │
│                              [Buscar]│
└─────────────────────────────────────┘
```

### **/verificar:**
```
┌─────────────────────────────────────┐
│ 🔍 [ejemplo1, ejemplo2.com.ar____]  │
│                                     │
│ 💡 Búsqueda inteligente:            │
│ • "ejemplo" → busca en todas        │
│ • "ejemplo.com.ar" → busca solo esa │
│                                     │
│              [Verificar Dominios]   │
└─────────────────────────────────────┘
```

## ✅ Ventajas

1. **UX mejorada** - Usuario no necesita seleccionar TLDs
2. **Más rápido** - Menos clicks para el usuario
3. **Inteligente** - Detecta automáticamente la intención
4. **Flexible** - Soporta ambos modos (con y sin TLD)

## 🔧 Código de Ejemplo

```typescript
// Detección de TLD
function parseDomainInput(input: string) {
  const argentineTLDs = ['.ar', '.com.ar', '.net.ar', '.org.ar'];
  
  for (const tld of argentineTLDs) {
    if (input.endsWith(tld)) {
      return {
        base: input.slice(0, -tld.length),
        tld: tld
      };
    }
  }
  
  return { base: input }; // Sin TLD
}

// Uso
const parsed = parseDomainInput('ejemplo.com.ar');
// → { base: 'ejemplo', tld: '.com.ar' }

const parsed2 = parseDomainInput('ejemplo');
// → { base: 'ejemplo' }
```

## 📱 Ejemplos de Uso

### Ejemplo 1: Búsqueda Simple
```
Input: "mercadolibre"
Resultado: 
  ✓ mercadolibre.com.ar (verifica solo .com.ar en Hero)
```

### Ejemplo 2: Búsqueda Específica
```
Input: "mercadolibre.net.ar"
Resultado:
  ✗ mercadolibre.net.ar (REGISTRADO)
```

### Ejemplo 3: Múltiples en /verificar
```
Input: "ejemplo, test.com.ar, midominio"
Resultado:
  - ejemplo.ar
  - ejemplo.com.ar
  - ejemplo.net.ar
  - ejemplo.org.ar
  - test.com.ar (solo)
  - midominio.ar
  - midominio.com.ar
  - midominio.net.ar
  - midominio.org.ar
```

## 🚀 Beneficios para el Usuario

- ✅ **Menos fricción** - No necesita entender qué es un TLD
- ✅ **Más intuitivo** - Funciona como espera
- ✅ **Más rápido** - Menos pasos para verificar
- ✅ **Flexible** - Puede escribir como quiera

---

**Estado:** ✅ Implementado
**Última actualización:** Diciembre 2024

