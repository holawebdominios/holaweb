# 🔧 Guía de Configuración: Firebase + Mercado Pago

## 📋 Prerequisitos

- Cuenta de Google
- Cuenta de Mercado Pago
- Proyecto creado en Firebase Console

---

## 🔥 Configuración de Firebase

### **1. Crear Proyecto en Firebase**

1. Ve a https://console.firebase.google.com/
2. Click en "Agregar proyecto"
3. Nombre: "Hola Web" (o el que prefieras)
4. Habilitar Google Analytics (opcional)
5. Click "Crear proyecto"

---

### **2. Habilitar Firebase Authentication**

1. En Firebase Console, ve a **Authentication**
2. Click en "Comenzar"
3. Habilitar proveedores:
   - **Email/Password**: Click en Email/Password → Habilitar → Guardar
   - **Google**: Click en Google → Habilitar → Configurar email de soporte → Guardar

---

### **3. Crear Firestore Database**

1. En Firebase Console, ve a **Firestore Database**
2. Click en "Crear base de datos"
3. Seleccionar **Modo de producción** (configuraremos reglas después)
4. Elegir ubicación: `southamerica-east1` (São Paulo - más cerca de Argentina)
5. Click "Habilitar"

---

### **4. Reglas de Seguridad de Firestore**

En Firestore Database → Reglas, usar estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función helper para verificar autenticación
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Función helper para verificar ownership
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // USERS: Solo el usuario puede leer/escribir su propio documento
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isOwner(userId);
      allow delete: if false; // No permitir eliminación
    }
    
    // DOMAINS: Solo el usuario puede ver sus dominios
    match /domains/{domainId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if isSignedIn();
      allow update: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow delete: if false; // No permitir eliminación directa
    }
    
    // ORDERS: Solo el usuario puede ver sus órdenes
    match /orders/{orderId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if true; // Permitir crear (checkout invitado)
      allow update: if false; // Solo el backend puede actualizar
      allow delete: if false;
    }
    
    // ALERTS: Solo lectura para el usuario
    match /alerts/{alertId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow write: if false; // Solo el backend gestiona alertas
    }
  }
}
```

---

### **5. Obtener Credenciales de Firebase**

#### **A. Credenciales del Cliente (Frontend)**

1. En Firebase Console → Project Settings (⚙️)
2. En la sección "Tus apps", selecciona la app web (o créala)
3. Copia los valores de `firebaseConfig`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

#### **B. Credenciales del Admin (Backend)**

1. En Firebase Console → Project Settings → Service Accounts
2. Click en "Generar nueva clave privada"
3. Se descarga un archivo JSON
4. Extraer valores:

```
FIREBASE_PROJECT_ID=tu-proyecto
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**IMPORTANTE:** La private key debe incluir los `\n` como string literal.

---

## 💳 Configuración de Mercado Pago

### **1. Crear Cuenta de Vendedor**

1. Ve a https://www.mercadopago.com.ar/
2. Crea una cuenta o inicia sesión
3. Completa los datos de vendedor
4. Verifica tu identidad

---

### **2. Obtener Credenciales**

1. Ve a https://www.mercadopago.com.ar/developers/panel
2. Click en tu aplicación (o crea una nueva)
3. Ve a "Credenciales"

#### **Modo Test (Desarrollo):**
```
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-123456-abc...
MERCADOPAGO_PUBLIC_KEY=TEST-abc123...
```

#### **Modo Producción (Cuando estés listo):**
```
MERCADOPAGO_ACCESS_TOKEN=APP_USR-1234567890-123456-abc...
MERCADOPAGO_PUBLIC_KEY=APP_USR-abc123...
```

---

### **3. Configurar Webhooks en Mercado Pago**

1. En el panel de desarrolladores → Tu aplicación
2. Ve a "Webhooks"
3. Agregar URL de notificaciones:

```
https://tu-dominio.vercel.app/api/payments/mercadopago/webhook
```

O en desarrollo (usando ngrok):
```
https://abc123.ngrok.io/api/payments/mercadopago/webhook
```

4. Seleccionar eventos:
   - ✅ Pagos
   - ✅ Plan de suscripción
   - ✅ Pago recurrente

---

## 🔐 Archivo .env.local

Crea un archivo `.env.local` con TODAS las variables:

```bash
# Copiar env.example
cp env.example .env.local

# Editar con tus valores
nano .env.local
```

**Ejemplo completo:**

```bash
# SITE
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Hola Web

# FIREBASE CLIENT
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=holaweb-123.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=holaweb-123
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=holaweb-123.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123

# FIREBASE ADMIN
FIREBASE_PROJECT_ID=holaweb-123
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@holaweb-123.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# MERCADO PAGO (TEST)
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-123456-abc123def456
MERCADOPAGO_PUBLIC_KEY=TEST-abc123-def456-ghi789

# CONTACTO
NEXT_PUBLIC_WHATSAPP=5491112345678
NEXT_PUBLIC_EMAIL=holawebdominios@gmail.com
NEXT_PUBLIC_PHONE=+541112345678
```

---

## 🧪 Testing

### **1. Probar Firebase Auth**

```bash
# Iniciar servidor
npm run dev

# Ir a /register
http://localhost:3000/register

# Crear cuenta con email
# Verificar en Firebase Console → Authentication
```

### **2. Probar Mercado Pago (Modo Test)**

**Tarjetas de prueba:**

✅ **Aprobada:**
```
Número: 5031 7557 3453 0604
CVV: 123
Vencimiento: 11/25
Nombre: APRO
DNI: 12345678
```

❌ **Rechazada:**
```
Número: 5031 4332 1540 6351
CVV: 123
Vencimiento: 11/25
Nombre: OTHE
DNI: 12345678
```

**Flujo de prueba:**
```
1. Buscar dominio en home
2. Click "Adquirir Dominio"
3. Completar checkout
4. Click "Proceder al Pago"
5. Usar tarjeta de test
6. Verificar webhook en logs
7. Verificar orden en Firestore (status: paid)
8. Verificar dominio creado en Firestore
```

---

## 🚀 Deploy en Vercel

### **Configurar Variables de Entorno en Vercel:**

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agregar TODAS las variables (excepto las que empiezan con `NEXT_PUBLIC_` en desarrollo)
4. Para `NEXT_PUBLIC_*`: agregar en todos los ambientes (Production, Preview, Development)
5. Para las demás: solo Production y Preview

**Variables críticas en Vercel:**
- ✅ Todas las `NEXT_PUBLIC_FIREBASE_*`
- ✅ Todas las `FIREBASE_*` (admin)
- ✅ `MERCADOPAGO_ACCESS_TOKEN` y `MERCADOPAGO_PUBLIC_KEY`
- ✅ `NEXT_PUBLIC_SITE_URL` (usar URL de Vercel)

---

## 🐛 Troubleshooting

### **Error: "Firebase App not initialized"**
- Verificar que todas las `NEXT_PUBLIC_FIREBASE_*` estén configuradas
- Reiniciar servidor después de agregar variables

### **Error: "Invalid service account"**
- Verificar formato de `FIREBASE_PRIVATE_KEY`
- Debe incluir los `\n` como string literal
- Envolver en comillas dobles

### **Error: "Mercado Pago authentication failed"**
- Verificar `MERCADOPAGO_ACCESS_TOKEN`
- En desarrollo, usar credenciales TEST
- En producción, usar credenciales de producción

### **Webhook no se ejecuta:**
- Verificar URL del webhook en panel de MP
- En desarrollo local, usar ngrok:
  ```bash
  ngrok http 3000
  # Copiar URL https://abc123.ngrok.io
  # Configurar en MP: https://abc123.ngrok.io/api/payments/mercadopago/webhook
  ```

---

## ✅ Checklist de Configuración

- [ ] Proyecto creado en Firebase
- [ ] Authentication habilitado (Email + Google)
- [ ] Firestore Database creado
- [ ] Reglas de seguridad configuradas
- [ ] Credenciales de cliente obtenidas
- [ ] Service Account descargado
- [ ] Cuenta de Mercado Pago creada
- [ ] Credenciales de MP obtenidas (TEST)
- [ ] Archivo `.env.local` creado
- [ ] Todas las variables configuradas
- [ ] Servidor reiniciado
- [ ] Test de login exitoso
- [ ] Test de registro exitoso
- [ ] Test de checkout exitoso (con tarjeta test)
- [ ] Webhook funcionando

---

## 📞 Soporte

Si encuentras problemas:
1. Verificar logs en la consola del navegador
2. Verificar logs del servidor (terminal)
3. Verificar logs en Firebase Console
4. Verificar logs en Mercado Pago Dashboard

---

**Última actualización:** Diciembre 2024

