# 🔐 CÓMO CREAR EL USUARIO ADMINISTRADOR

## 📋 Requisitos Previos

- Tener acceso a Firebase Console
- Tener el proyecto corriendo en localhost

---

## 🚀 PASO A PASO

### **Paso 1: Crear el usuario en Firebase Console**

1. Abre [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **"hola-empresa"**
3. Ve a **Authentication** (en el menú lateral)
4. Click en la pestaña **"Users"**
5. Click en **"Add user"**
6. Completa:
   - **Email:** `admin@admin.com`
   - **Password:** [Elegí una contraseña segura y guardala]
   - **User ID:** Se genera automáticamente
7. Click en **"Add user"**

✅ El usuario está creado en Firebase Auth

---

### **Paso 2: Configurar permisos de administrador**

1. Asegurate de que el servidor esté corriendo:
   ```bash
   npm run dev
   ```

2. Abre tu navegador en: `http://localhost:3000`

3. Abre la **Consola del Navegador** (F12 → Console)

4. Ejecuta este comando:
   ```javascript
   fetch('/api/admin/init', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' }
   })
   .then(r => r.json())
   .then(data => {
     console.log(data);
     if (data.success) {
       alert('✅ Admin configurado correctamente!');
     } else {
       alert('❌ Error: ' + data.error);
     }
   });
   ```

5. Deberías ver en consola:
   ```json
   {
     "success": true,
     "message": "✅ Usuario admin@admin.com configurado como admin",
     "uid": "abc123...",
     "instructions": [...]
   }
   ```

✅ El usuario ahora tiene permisos de admin

---

### **Paso 3: Iniciar sesión en el Panel Admin**

1. Ve a: `http://localhost:3000/admin/login`

2. Ingresa las credenciales:
   - **Email:** `admin@admin.com`
   - **Password:** [La contraseña que elegiste en el Paso 1]

3. Click en **"Acceder al Panel"**

4. Si todo está correcto, serás redirigido a: `/admin`

✅ ¡Ya tenés acceso al panel de administración!

---

## 🔍 Verificación

### **¿Cómo saber si funcionó?**

**En Firebase Console:**
1. Ve a **Authentication → Users**
2. Buscá `admin@admin.com`
3. Click en el usuario
4. Deberías ver en "Custom claims": `{ "admin": true }`

**En Firestore:**
1. Ve a **Firestore Database**
2. Abre la colección `users`
3. Busca el documento con el UID del admin
4. Deberías ver:
   ```json
   {
     "email": "admin@admin.com",
     "role": "admin",
     "plan": "enterprise",
     ...
   }
   ```

**En la Aplicación:**
1. Login exitoso en `/admin/login`
2. Acceso a `/admin` (dashboard)
3. Navegación disponible: Usuarios, Órdenes, etc.

---

## ❌ Problemas Comunes

### Error: "Usuario admin@admin.com no encontrado"
**Solución:** Primero debes crear el usuario en Firebase Console (Paso 1)

### Error: "Acceso denegado"
**Solución:** 
1. Ejecuta el endpoint `/api/admin/init` nuevamente (Paso 2)
2. Cerrá sesión y volvé a entrar
3. Los custom claims tardan unos segundos en aplicarse

### Error: "Firebase no configurado"
**Solución:** Verifica que tengas las variables de entorno en `.env.local`:
```env
# Firebase Admin
FIREBASE_PROJECT_ID=hola-empresa
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

---

## 🔐 SEGURIDAD IMPORTANTE

### ⚠️ ELIMINAR EL ENDPOINT EN PRODUCCIÓN

**Antes de deployar a producción:**

1. **Elimina el archivo:**
   ```bash
   rm app/api/admin/init/route.ts
   ```

2. **O comenta todo el contenido** para que no funcione

3. En producción, si necesitas otro admin:
   - Crealo manualmente en Firebase Console
   - Usa Firebase Admin SDK desde un script local (no un endpoint público)

---

## 📝 Resumen Rápido

```bash
# 1. Crear usuario en Firebase Console
Email: admin@admin.com
Password: [tu_contraseña_segura]

# 2. Ejecutar en consola del navegador
fetch('/api/admin/init', { method: 'POST' })
  .then(r => r.json()).then(console.log)

# 3. Login en /admin/login
Email: admin@admin.com
Password: [tu_contraseña_segura]

# 4. ✅ Acceso al panel admin
```

---

## 🎯 Flujo Visual

```
Firebase Console
      ↓
Crear admin@admin.com
      ↓
Ejecutar /api/admin/init (una vez)
      ↓
Custom claim: admin: true
      ↓
Firestore: role: "admin"
      ↓
Login en /admin/login
      ↓
✅ Acceso a Panel Admin
```

---

## ✅ Checklist

- [ ] Usuario `admin@admin.com` creado en Firebase Console
- [ ] Endpoint `/api/admin/init` ejecutado exitosamente
- [ ] Custom claim verificado en Firebase Console
- [ ] Documento en Firestore creado con role: "admin"
- [ ] Login exitoso en `/admin/login`
- [ ] Acceso a `/admin` confirmado
- [ ] Endpoint `/api/admin/init` eliminado/deshabilitado en producción

---

**¡Listo! Ya tenés tu usuario administrador configurado.** 🎉

