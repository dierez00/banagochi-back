# 📮 Postman Collection - Operational Service

Colección completa de Postman para probar los tres módulos principales del servicio operacional: **Projects**, **Aside (Apartados)** y **Transactions**.

## 📦 Archivos incluidos

```
postman/
├── Operational-Service-Complete.postman_collection.json  # Colección completa (26 requests)
├── Operational-Service.postman_environment.json          # Variables de entorno
└── README.md                                             # Este archivo
```

## 🚀 Importar en Postman

### Método 1: Drag & Drop
1. Abre Postman Desktop
2. Click en **Import** (esquina superior izquierda)
3. Arrastra ambos archivos `.json` a la ventana
4. Click en **Import**

### Método 2: File Browser
1. Click en **Import**
2. Click en **files**
3. Selecciona ambos archivos
4. Click en **Import**

## ⚙️ Configuración inicial

### 1. Seleccionar el Environment

En la esquina superior derecha, selecciona: **Operational Service - Local Environment**

### 2. Configurar variables críticas

⚠️ **IMPORTANTE:** Antes de ejecutar, actualiza estas variables:

| Variable | Valor por defecto | Descripción | ¿Debo actualizarlo? |
|----------|-------------------|-------------|---------------------|
| `base_url` | `http://localhost:3000` | URL del servidor | ✅ Si usas otro puerto |
| `user_id` | `507f1f77bcf86cd799439011` | ID de usuario válido | ✅ **SÍ, OBLIGATORIO** |
| `second_user_id` | `507f1f77bcf86cd799439012` | Segundo usuario para pruebas | ✅ Opcional |
| `project_id` | *(vacío)* | Se llena automáticamente | ❌ No |
| `aside_id` | *(vacío)* | Se llena automáticamente | ❌ No |
| `transaction_id` | *(vacío)* | Se llena automáticamente | ❌ No |

### 3. Obtener un User ID real

#### Opción A: Crear usuario manualmente en MongoDB
```javascript
// En MongoDB Compass o mongosh:
db.users.insertOne({
  name: "Test User",
  email: "test@example.com",
  createdAt: new Date()
})
// Copia el _id generado
```

#### Opción B: Si tienes un servicio de usuarios
```bash
# Llama a tu API de usuarios
curl http://localhost:3001/api/users
# Copia un _id válido
```

#### Opción C: Generar un ObjectId válido
```javascript
// En Node.js REPL o navegador console
const { ObjectId } = require('mongodb');
console.log(new ObjectId().toString());
// Ejemplo: 65abc123def4567890123456
```

Luego actualiza la variable `user_id` en el Environment:
1. Click en **Environments** (icono ⚙️)
2. Click en **Operational Service - Local Environment**
3. Actualiza el valor de `user_id`
4. Click en **Save** (💾)

## 📋 Estructura de la colección

### 🏥 Health Check (1 request)
- ✅ Server Health - Verifica que el servidor esté corriendo

### 🏗️ Projects (11 requests)
1. Create Project
2. Get All Projects
3. Get All Projects (With Filters)
4. Get Project By ID
5. Update Project
6. Add Vote to Project
7. Add Funding to Project
8. Add Feed Item to Project
9. Get Projects By Colonia
10. Get Projects By Status
11. Get Projects By Proposer
12. Soft Delete Project

### 💳 Aside - Apartados (8 requests)
1. Create Payroll Aside
2. Get User Asides
3. Get Aside By ID
4. Get Project Asides
5. Update Aside Amount
6. Pause Aside
7. Reactivate Aside
8. Cancel Aside

### 💸 Transactions (5 requests)
1. Create One-Time Transaction
2. Process Payroll Deductions
3. Get User Transactions
4. Get Project Transactions
5. Get User Impact Dashboard

**Total: 26 requests** con tests automáticos

## 🎯 Orden de ejecución recomendado

### Flujo completo de prueba:

```
1. Health Check
   └─ Server Health ✅

2. Projects Module
   ├─ Create Project ✅ (guarda project_id)
   ├─ Get All Projects
   ├─ Get Project By ID
   ├─ Add Vote to Project
   ├─ Update Project
   └─ Add Feed Item

3. Aside Module
   ├─ Create Payroll Aside ✅ (guarda aside_id)
   ├─ Get User Asides
   ├─ Get Aside By ID
   ├─ Update Aside Amount
   ├─ Pause Aside
   └─ Reactivate Aside

4. Transactions Module
   ├─ Create One-Time Transaction ✅
   ├─ Get User Transactions
   ├─ Get Project Transactions
   ├─ Process Payroll Deductions
   └─ Get User Impact Dashboard 📊

5. Cleanup (opcional)
   └─ Soft Delete Project
```

### 🏃 Ejecutar todo con Collection Runner

1. Click derecho en la colección **"Operational Service - Complete API"**
2. Click en **"Run collection"**
3. Asegúrate de que el environment esté seleccionado
4. Click en **"Run Operational Service..."**
5. Postman ejecutará todos los requests en orden

⚠️ **Nota:** Algunos requests dependen de datos previos. Recomendamos ejecutarlos en el orden listado.

## 🧪 Tests automáticos incluidos

Cada request incluye tests que verifican:

✅ **Status codes** (200, 201, 400, 404, 500)
✅ **Estructura de respuesta** (`success`, `message`, `data`)
✅ **Tipos de datos** (arrays, objects, strings, numbers)
✅ **Validación de campos** (IDs, estados, montos)
✅ **Lógica de negocio** (cambios de estado automáticos)
✅ **Variables automáticas** (guarda IDs para requests posteriores)

### Ver resultados de tests:
- En la pestaña **Test Results** de cada request
- En el **Collection Runner** al final de la ejecución
- En la **Console** (View → Show Postman Console) para logs detallados

## 📊 Ejemplos de uso

### Crear un proyecto
```http
POST http://localhost:3000/api/projects
Content-Type: application/json

{
  "title": "Nueva Plaza Central",
  "description": "Construcción de plaza pública",
  "colonia": "Centro",
  "proposerId": "{{user_id}}",
  "fundingGoal": 500000,
  "votingStats": {
    "votesNeeded": 100
  },
  "supplierInfo": {
    "name": "Constructora ABC S.A. de C.V.",
    "account": "012345678901234567"
  }
}
```

### Crear apartado de nómina
```http
POST http://localhost:3000/api/asides
Content-Type: application/json

{
  "userId": "{{user_id}}",
  "projectId": "{{project_id}}",
  "amountPerCycle": 500,
  "frequency": "BIWEEKLY"
}
```

### Crear transacción única
```http
POST http://localhost:3000/api/transactions/one-time
Content-Type: application/json

{
  "userId": "{{user_id}}",
  "projectId": "{{project_id}}",
  "amount": 1000,
  "source": "ONE_TIME"
}
```

### Consultar dashboard de impacto
```http
GET http://localhost:3000/api/transactions/user/{{user_id}}/dashboard
```

## 🔄 Estados y flujos

### Estados de Projects
| Estado | Descripción | Transición |
|--------|-------------|------------|
| `VOTING` | En votación | → `FUNDING` (al alcanzar votos) |
| `FUNDING` | Recibiendo fondos | → `IN_PROGRESS` (al alcanzar meta) |
| `IN_PROGRESS` | En ejecución | → `COMPLETED` (manualmente) |
| `COMPLETED` | Completado | - |
| `REJECTED` | Rechazado | - |

### Estados de Aside
| Estado | Descripción | Acciones disponibles |
|--------|-------------|---------------------|
| `ACTIVE` | Activo, deducciones en proceso | Pausar, Cancelar, Actualizar monto |
| `PAUSED` | Pausado temporalmente | Reactivar, Cancelar |
| `CANCELLED` | Cancelado permanentemente | Ninguna (final) |

### Estados de Transactions
| Estado | Descripción |
|--------|-------------|
| `pending` | Pendiente de procesar |
| `completed` | Completada exitosamente |
| `failed` | Falló el procesamiento |

### Frecuencias de Aside
- `WEEKLY` - Semanal
- `BIWEEKLY` - Quincenal
- `MONTHLY` - Mensual

## 🐛 Troubleshooting

### ❌ Error: "Invalid project or voter ID"
**Solución:**
- Verifica que `user_id` sea un MongoDB ObjectId válido (24 caracteres hexadecimales)
- Ejemplo válido: `507f1f77bcf86cd799439011`
- Actualiza la variable en el Environment

### ❌ Error: "Project not found"
**Solución:**
- Ejecuta primero **"1. Create Project"** para generar un `project_id`
- Verifica que el proyecto no haya sido eliminado
- Revisa que `project_id` esté guardado en las variables

### ❌ Error: "User already voted for this project"
**Solución:**
- Usa un `voterId` diferente en el body
- O crea un nuevo proyecto

### ❌ Error: "Project is not in funding stage"
**Solución:**
- El proyecto debe estar en estado `FUNDING` para recibir fondos
- Agrega suficientes votos primero (ejecuta "Add Vote" varias veces con diferentes voters)

### ❌ Error: "Cannot connect to server"
**Solución:**
```powershell
# Verifica que el servidor esté corriendo
cd C:\Users\diego\OneDrive\Escritorio\hack\operational-service
npx tsx src/index.ts

# Verifica el puerto en app.ts o index.ts
# Actualiza base_url si es necesario
```

### ❌ Error: "Aside must be ACTIVE to update"
**Solución:**
- Solo puedes actualizar el monto de un aside con estado `ACTIVE`
- Si está `PAUSED`, primero reactívalo
- Si está `CANCELLED`, debes crear uno nuevo

## 📚 Datos de prueba útiles

### MongoDB ObjectIds válidos de ejemplo
```javascript
// User IDs
507f1f77bcf86cd799439011
507f1f77bcf86cd799439012
507f1f77bcf86cd799439013

// Para generar más:
const { ObjectId } = require('mongodb');
console.log(new ObjectId().toString());
```

### Colonias de ejemplo
- Centro
- Polanco
- Roma Norte
- Condesa
- Coyoacán

### Montos de ejemplo
```javascript
// Para apartados (deducciones mensuales típicas)
amountPerCycle: 250   // $250 MXN quincenal
amountPerCycle: 500   // $500 MXN quincenal
amountPerCycle: 1000  // $1,000 MXN quincenal

// Para transacciones únicas
amount: 5000    // $5,000 MXN
amount: 10000   // $10,000 MXN
amount: 50000   // $50,000 MXN
```

## 🔧 Configuración avanzada

### Variables de colección vs Environment

**Variables de Colección** (auto-generadas):
- `project_id` - Se guarda al crear un proyecto
- `aside_id` - Se guarda al crear un aside
- `transaction_id` - Se guarda al crear una transacción

**Variables de Environment** (debes configurar):
- `base_url` - URL del servidor
- `user_id` - Usuario principal para pruebas
- `second_user_id` - Usuario secundario (opcional)

### Scripts personalizados

Cada request tiene scripts en las pestañas:
- **Pre-request Script** - Se ejecuta ANTES del request
- **Tests** - Se ejecuta DESPUÉS del request

Ejemplo de script personalizado:
```javascript
// En Pre-request Script
pm.collectionVariables.set('timestamp', Date.now());

// En Tests
const response = pm.response.json();
console.log('Response data:', response.data);

pm.test('Custom validation', function() {
    pm.expect(response.data.amount).to.be.above(0);
});
```

## 🎨 Personalización

### Cambiar el puerto del servidor
```javascript
// En Environment
base_url: "http://localhost:4000"  // Cambia a tu puerto
```

### Agregar headers de autenticación
```javascript
// En Collection → Authorization
Type: Bearer Token
Token: {{auth_token}}

// O en cada request individualmente
```

## 📈 Reportes y CI/CD

### Exportar resultados del Runner
1. Ejecuta la colección con el Runner
2. Click en **Export Results**
3. Selecciona formato JSON o CSV

### Usar con Newman (CLI)
```bash
# Instalar Newman
npm install -g newman

# Ejecutar la colección
newman run postman/Operational-Service-Complete.postman_collection.json \
  -e postman/Operational-Service.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export results.json

# Con reporte HTML
npm install -g newman-reporter-htmlextra
newman run postman/Operational-Service-Complete.postman_collection.json \
  -e postman/Operational-Service.postman_environment.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export report.html
```

## 🤝 Contribuir

Para agregar nuevos requests:
1. Crea el request en Postman
2. Agrega tests automáticos
3. Exporta la colección actualizada
4. Actualiza este README

## 📝 Changelog

### v1.0.0 (2025-10-25)
- ✅ 26 requests completos (Projects, Aside, Transactions)
- ✅ Tests automáticos en todos los endpoints
- ✅ Variables dinámicas auto-guardadas
- ✅ Documentación completa
- ✅ Ejemplos de datos de prueba

## 📞 Soporte

Si encuentras problemas:
1. Verifica que el servidor esté corriendo
2. Revisa que MongoDB esté conectado
3. Confirma que las variables de environment estén configuradas
4. Revisa la Postman Console para logs detallados

---

**Proyecto:** Operational Service - Banagochi Backend
**Fecha:** Octubre 2025
**Versión:** 1.0.0
**Endpoints totales:** 26
**Módulos:** 3 (Projects, Aside, Transactions)

¡Happy testing! 🚀
