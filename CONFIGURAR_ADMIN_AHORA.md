# 🚀 CONFIGURAR ADMIN - PASO A PASO RÁPIDO

## ✅ CAMBIOS APLICADOS

1. ✅ Navbar/Footer públicos NO se muestran en `/admin/*`
2. ✅ Endpoint `/api/auth/logout` creado
3. ✅ Layout separado para admin

---

## 🔥 CONFIGURAR PERMISOS AHORA

### **OPCIÓN A: Usuario Ya Existe en Firebase**

Si **ya creaste** `admin@admin.com` en Firebase Console:

**1. Abre una terminal y ejecuta:**
```bash
curl -X POST http://localhost:3000/api/admin/init
```

**O en la consola del navegador (F12):**
```javascript
fetch('http://localhost:3000/api/admin/init', { 
  method: 'POST' 
})
.then(r => r.json())
.then(data => {
  console.log('✅ Resultado:', data);
  alert(data.message || JSON.stringify(data));
});
```

**Deberías ver:**
```json
{
  "success": true,
  "message": "✅ Usuario admin@admin.com configurado como admin",
  "uid": "...",
  "instructions": [...]
}
```

---

### **OPCIÓN B: Usuario NO Existe**

Si **NO creaste** `admin@admin.com` en Firebase Console:

**1. Ve a Firebase Console:**
   - https://console.firebase.google.com/
   - Selecciona tu proyecto
   - Authentication → Users → Add user

**2. Crea el usuario:**
   ```
   Email: admin@admin.com
   Password: Admin123!
   ```

**3. Ejecuta el comando de la Opción A**

---

## 🧪 VERIFICAR

**Después de ejecutar el init:**

1. Recarga la página de login: `http://localhost:3000/admin/login`

2. **Verifica que NO veas:**
   - ❌ Logo "Hola Web" arriba a la izquierda
   - ❌ Enlaces (Inicio, Planes, FAQ, etc.)
   - ❌ Footer con redes sociales
   - ❌ Botón de WhatsApp flotante

3. **Deberías ver SOLO:**
   - ✅ Fondo oscuro con patrón
   - ✅ Card de login centrada
   - ✅ "Panel Admin" con escudo 🛡️
   - ✅ Campos de email y contraseña
   - ✅ Nada más

4. **Login:**
   ```
   Email: admin@admin.com
   Password: Admin123!
   ```

5. **Después del login:**
   - ✅ Dashboard con sidebar negro
   - ✅ Navbar admin (arriba)
   - ✅ Stats cards
   - ✅ Sin navbar/footer público

---

## 📊 QUÉ VER EN LOS LOGS

Cuando ejecutes `fetch('/api/admin/init', ...)` deberías ver en la **terminal del servidor**:

```
[Admin Init] Buscando usuario: admin@admin.com
[Admin Init] Usuario encontrado, UID: abc123xyz...
[Admin Init] ✅ Custom claim establecido
[Admin Init] ✅ Documento en Firestore creado/actualizado
POST /api/admin/init 200 in 1234ms
```

---

## ⚡ EJECUTA ESTO AHORA

**En la consola del navegador (F12 → Console):**

```javascript
fetch('http://localhost:3000/api/admin/init', { 
  method: 'POST' 
})
.then(r => r.json())
.then(data => {
  console.log('📊 Resultado completo:', data);
  
  if (data.success) {
    console.log('✅ ÉXITO!');
    console.log('UID:', data.uid);
    console.log('Instrucciones:', data.instructions);
    alert('✅ Admin configurado! Recarga la página de login');
  } else {
    console.log('❌ ERROR:', data.error);
    alert('❌ ' + data.error);
  }
})
.catch(err => {
  console.error('❌ Error de red:', err);
  alert('Error: ' + err.message);
});
```

---

## 🎯 DESPUÉS DE EJECUTAR

1. **Cierra TODAS las pestañas** del navegador
2. **Abre nueva pestaña:** `http://localhost:3000/admin/login`
3. **Verifica visualmente:**
   - Sin navbar público ✅
   - Sin footer público ✅
   - Solo card de login ✅
4. **Login con admin@admin.com**
5. **Deberías acceder al dashboard**

---

**¡Ejecuta el comando ahora y dime qué resultado ves!** 🚀

