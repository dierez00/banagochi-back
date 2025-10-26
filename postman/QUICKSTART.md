# ⚡ Quick Start Guide

Guía rápida para empezar a usar la colección de Postman en **5 minutos**.

## 🚀 Pasos Rápidos

### 1️⃣ Importar en Postman (30 segundos)

1. Abre Postman
2. Click **Import** → Arrastra estos archivos:
   - `Operational-Service-Complete.postman_collection.json`
   - `Operational-Service.postman_environment.json`
3. ✅ Listo!

### 2️⃣ Configurar Environment (1 minuto)

1. Selecciona el environment: **Operational Service - Local Environment** (esquina superior derecha)
2. Click en el ⚙️ (Settings) → Edit
3. **IMPORTANTE:** Actualiza `user_id` con un ObjectId real:

```javascript
// En tu base de datos MongoDB:
db.users.insertOne({ name: "Test User", email: "test@example.com" })
// Copia el _id generado (ejemplo: 67123abc456def789012345)
```

4. Pega el ID en la variable `user_id`
5. Click **Save**

### 3️⃣ Iniciar el servidor (30 segundos)

```powershell
cd C:\Users\diego\OneDrive\Escritorio\hack\operational-service
npx tsx src/index.ts
```

Deberías ver:
```
Connected to MongoDB
Server running on port 3000
```

### 4️⃣ Probar tu primer request (1 minuto)

1. Ve a la carpeta **Health Check**
2. Click en **Server Health**
3. Click **Send** → Deberías ver: `200 OK`

### 5️⃣ Crear tu primer proyecto (2 minutos)

1. Ve a **Projects** → **1. Create Project**
2. Click **Send**
3. ✅ El `project_id` se guarda automáticamente!
4. Ahora puedes ejecutar los demás requests en orden

---

## 🎯 Flujo Recomendado para Primera Prueba

Ejecuta estos 5 requests en orden:

1. **Health Check** → `Server Health` ✅
2. **Projects** → `1. Create Project` ✅ (guarda project_id)
3. **Projects** → `4. Get Project By ID` ✅
4. **Aside** → `1. Create Payroll Aside` ✅ (guarda aside_id)
5. **Transactions** → `1. Create One-Time Transaction` ✅

**¡Listo!** Ya probaste los 3 módulos principales.

---

## 🔧 Solución Rápida de Problemas

### ❌ "Cannot connect to server"
```powershell
# Verifica que el servidor esté corriendo:
cd operational-service
npx tsx src/index.ts
```

### ❌ "Invalid user ID"
```javascript
// Genera un ObjectId válido:
const { ObjectId } = require('mongodb');
console.log(new ObjectId().toString());
// O usa: 507f1f77bcf86cd799439011 (ejemplo válido)
```

### ❌ "Project not found"
```
1. Ejecuta primero "1. Create Project"
2. El project_id se guarda automáticamente
3. Los demás requests lo usan automáticamente
```

---

## 📊 Ejecutar TODOS los tests automáticamente

### Opción 1: En Postman GUI
1. Click derecho en **"Operational Service - Complete API"**
2. **Run collection**
3. **Run** → ¡Ejecuta los 26 requests!

### Opción 2: Desde Terminal (Newman)
```powershell
# Instalar Newman
npm install -g newman newman-reporter-htmlextra

# Ejecutar tests
cd postman
node run-tests.js
```

---

## 📚 Próximos Pasos

- 📖 Lee [README.md](README.md) para documentación completa
- 📝 Revisa [EXAMPLES.md](EXAMPLES.md) para más datos de prueba
- 🧪 Ejecuta el **Collection Runner** para tests automáticos

---

## 🎉 ¡Eso es todo!

Ya tienes:
- ✅ 26 requests listos para usar
- ✅ Tests automáticos configurados
- ✅ Variables dinámicas funcionando
- ✅ Ejemplos de datos de prueba

**Tiempo total:** ~5 minutos

---

**¿Necesitas ayuda?** Revisa el [README.md](README.md) completo o la sección de Troubleshooting.
