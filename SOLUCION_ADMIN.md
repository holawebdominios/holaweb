# 🔧 SOLUCIÓN: Configurar Admin

## ✅ Problemas Solucionados

1. ✅ Endpoint `/api/auth/logout` creado
2. ✅ Navbar/Footer públicos NO aparecen en `/admin/*`
3. ⏳ Falta configurar permisos de admin

---

## 🚀 CONFIGURAR PERMISOS DE ADMIN

### **Opción 1: Usuario Ya Creado en Firebase Console**

Si **ya creaste** `admin@admin.com` en Firebase Console:

1. Abre la consola del navegador (F12) en `http://localhost:3000`
2. Ejecuta:
   ```javascript
   fetch('/api/admin/init', { method: 'POST' })
     .then(r => r.json())
     .then(data => {
       console.log('Resultado:', data);
       if (data.success) {
         alert('✅ Admin configurado! Ahora puedes iniciar sesión');
       } else {
         alert('❌ Error: ' + data.error);
       }
     });
   ```

3. Si ves error "Usuario no encontrado", pasa a la Opción 2

---

### **Opción 2: Crear Usuario en Firebase Console**

Si el usuario **NO existe** o da error:

#### **Paso 1: Ir a Firebase Console**
1. Abre: https://console.firebase.google.com/
2. Selecciona tu proyecto: **"hola-empresa"** (o el que uses)
3. Ve a **Authentication** en el menú lateral
4. Click en la pestaña **"Users"**

#### **Paso 2: Agregar Usuario**
1. Click en **"Add user"** (botón azul arriba a la derecha)
2. Completa el formulario:
   ```
   Email address: admin@admin.com
   Password: [Elige una contraseña SEGURA - ej: Admin123!@#]
   ```
3. Click **"Add user"**
4. ✅ El usuario se crea y aparece en la lista

#### **Paso 3: Copiar UID (Opcional)**
En la lista de usuarios, verás algo como:
```
admin@admin.com
User UID: eF7x9K2mP4Qa8Rb1Sd5T3...
```

Copia ese UID por si lo necesitas.

#### **Paso 4: Ejecutar Inicialización**
Ahora ejecuta el comando del **Paso 2 de la Opción 1**.

---

## 🧪 VERIFICAR QUE FUNCIONÓ

### **En Firebase Console:**

1. Ve a **Authentication → Users**
2. Click en `admin@admin.com`
3. Scroll hasta **"Custom claims"**
4. Deberías ver: `{ "admin": true }`

### **En Firestore:**

1. Ve a **Firestore Database**
2. Abre colección `users`
3. Busca el documento con el email `admin@admin.com`
4. Deberías ver:
   ```javascript
   {
     email: "admin@admin.com",
     name: "Administrador",
     role: "admin",
     plan: "enterprise",
     ...
   }
   ```

---

## 🔑 INTENTAR LOGIN NUEVAMENTE

1. Ve a: `http://localhost:3000/admin/login`
2. Credenciales:
   ```
   Email: admin@admin.com
   Password: [la que elegiste]
   ```
3. Click **"Acceder al Panel"**
4. Deberías ver:
   - ✅ Toast: "Acceso concedido"
   - ✅ Redirección a `/admin` (dashboard)
   - ✅ Sin navbar/footer público
   - ✅ Solo layout del admin (sidebar + navbar admin)

---

## 🎯 Cómo Debería Verse

### **Login Admin** (`/admin/login`):
```
┌────────────────────────────┐
│                            │
│        [🛡️]                │
│     Panel Admin            │
│  Acceso restringido a      │
│   administradores          │
│                            │
│  Email: [input]            │
│  Contraseña: [input]       │
│                            │
│  [Acceder al Panel]        │
│                            │
│  🔒 Conexión segura        │
└────────────────────────────┘
```

**SIN navbar ni footer público** ✅

### **Dashboard Admin** (`/admin`):
```
┌─────────────────────────────────────────┐
│ [≡] Panel Admin    [Admin ▼] [Logout]  │ ← Navbar Admin
├─────────┬───────────────────────────────┤
│ • Dash  │ Dashboard                     │ ← Sidebar
│ Users   │                               │
│ Orders  │ [Stats: Usuarios, Órdenes,    │
│ Domains │  Revenue, Dominios]           │
│ Setting │                               │
│         │ Órdenes Recientes:            │
│         │ • pepin.com.ar - $70,800      │
└─────────┴───────────────────────────────┘
```

**SIN navbar ni footer público** ✅

---

## ❌ Si Sigue Sin Funcionar

### **Debugging:**

1. **Revisa logs del servidor** (terminal donde corre `npm run dev`):
   ```
   [Admin Init] Buscando usuario: admin@admin.com
   [Admin Init] Usuario encontrado, UID: ...
   [Admin Init] ✅ Custom claim establecido
   [Admin Init] ✅ Documento en Firestore creado/actualizado
   ```

2. **Revisa consola del navegador** (F12):
   - ¿Hay errores?
   - ¿El fetch devolvió success?

3. **Verifica Firebase Console:**
   - ¿El usuario existe?
   - ¿Tiene custom claim?

---

## 🔄 REINTENTAR TODO DESDE CERO

Si nada funciona, reinicia:

```bash
# 1. Eliminar usuario en Firebase Console (si existe)
# 2. Crear nuevo usuario admin@admin.com
# 3. Reiniciar servidor
npm run dev

# 4. En consola del navegador
fetch('/api/admin/init', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)

# 5. Cerrar todas las pestañas
# 6. Abrir nueva pestaña en /admin/login
# 7. Login
```

---

**¡Ahora intenta nuevamente!** 🚀

1. Recarga `http://localhost:3000/admin/login`
2. Login con admin@admin.com
3. Deberías ver el dashboard admin sin navbar/footer público

