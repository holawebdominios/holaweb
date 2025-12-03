# 🎨 REBRANDING: HOLA WEB → HOLA EMPRESA

## ✅ CAMBIOS APLICADOS

### **1. Paleta de Colores Centralizada**
✅ `tailwind.config.ts` actualizado con:
```typescript
brand: {
  blue: '#13314c',        // Azul principal
  blueDark: '#0a1f30',    // Azul oscuro (hover)
  orange: '#ff9900',      // Naranja CTAs
  orangeDark: '#ff8800',  // Naranja hover
  cream: '#faf8f5',       // Fondo crema
  light: '#ffffff',       // Blanco
  success: '#10b981',     // Verde badges
}
```

**Uso en código:**
```tsx
className="bg-brand-blue text-white hover:bg-brand-blueDark"
className="bg-brand-orange hover:bg-brand-orangeDark"
```

### **2. Configuración de Marca**
✅ `config/brand.ts` creado con:
- Nombre: "Hola Empresa"
- Slogan: "El 0800 de siempre, pero ahora con Hola"
- Colores centralizados
- Contacto y redes sociales

### **3. Metadata y SEO**
✅ `app/layout.tsx`:
```typescript
title: 'Hola Empresa - Verificación de Dominios .AR | El 0800 de siempre, pero ahora con Hola'
description: 'El 0800 de siempre, pero ahora con Hola...'
```

### **4. Componentes Actualizados**
✅ Alt tags de imágenes:
- Navbar: "Hola Empresa"
- Footer: "Hola Empresa"
- Login: "Hola Empresa"
- Register: "Hola Empresa"

---

## ⏳ PENDIENTE DE COMPLETAR

### **Archivos con "Hola Web" a reemplazar:**

1. ✅ `app/layout.tsx` - HECHO
2. ✅ `components/layout/Navbar.tsx` - HECHO
3. ✅ `components/layout/Footer.tsx` - HECHO
4. ✅ `app/login/page.tsx` - HECHO
5. ✅ `app/register/page.tsx` - HECHO
6. ⏳ `config/site.ts`
7. ⏳ `app/planes/page.tsx`
8. ⏳ `lib/mercadopago-client.ts`
9. ⏳ `env.example`
10. ⏳ Documentación (SETUP, CHANGELOG, etc.)

---

## 🎯 LUGARES CLAVE PARA EL SLOGAN

### **Dónde usarlo:**

1. ✅ **Metadata/SEO** - Ya agregado
2. ⏳ **Hero Section** - Subtítulo o descripción
3. ⏳ **Sección "Por Qué Nosotros"** - En beneficios
4. ⏳ **Footer** - Descripción de marca
5. ⏳ **About/Nosotros** - Presentación

**Ejemplo de uso:**

```tsx
<p className="text-xl text-gray-300">
  {BRAND.slogan}
</p>
```

---

## 🎨 APLICACIÓN DE COLORES POR SECCIÓN

### **Navbar**
```tsx
className="bg-brand-blue text-white"
// Active link:
className="bg-brand-orange text-white"
```

### **Hero**
```tsx
// Overlay:
className="bg-gradient-to-r from-brand-blue/90 to-brand-blueDark/90"
// CTA:
className="bg-brand-orange hover:bg-brand-orangeDark"
// Highlights:
className="text-brand-orange"
```

### **Planes**
```tsx
// Card destacada:
className="border-brand-orange"
// Badge "Popular":
className="bg-brand-orange text-white"
// Badge descuento:
className="bg-brand-success text-white"
```

### **Cómo Funciona**
```tsx
// Fondo:
className="bg-brand-cream"
// Número:
className="bg-brand-orange text-white"
// Línea conectora:
className="border-brand-orange/30"
```

### **Beneficios**
```tsx
// Fondo:
className="bg-brand-light"
// Iconos:
className="text-brand-blue" // o "text-brand-success"
```

### **CTA Final**
```tsx
// Fondo completo:
className="bg-brand-orange"
// Botón primario:
className="bg-white text-brand-orange hover:bg-gray-50"
// Botón secundario:
className="border-white text-white hover:bg-white/10"
```

### **Footer**
```tsx
className="bg-brand-blueDark text-white"
```

---

## 📝 PRÓXIMOS PASOS

1. **Completar reemplazo de nombres** en archivos restantes
2. **Aplicar paleta de colores** a componentes principales
3. **Agregar slogan** en secciones clave
4. **Unificar estados hover** con colores de marca
5. **Actualizar documentación** con nuevo nombre

---

## 🔧 COMANDO PARA REEMPLAZAR EN MASA

```bash
# Buscar todas las ocurrencias
grep -r "Hola Web" --include="*.tsx" --include="*.ts" .

# O usar find & replace en VS Code:
# Ctrl + Shift + H
# Find: Hola Web
# Replace: Hola Empresa
# Replace All
```

---

**Estado actual:** ~40% completado
**Siguiente:** Completar reemplazos y aplicar colores de marca

---

¿Querés que continúe con el rebranding completo o preferís revisar lo que ya está?

