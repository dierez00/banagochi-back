# 📝 Ejemplos de Datos para Pruebas

Este archivo contiene datos de ejemplo listos para copiar y pegar en tus requests de Postman.

---

## 🏗️ PROJECTS

### Ejemplo 1: Plaza Pública
```json
{
  "title": "Renovación Plaza del Pueblo",
  "description": "Modernización de la plaza principal con nuevas bancas, árboles, fuente ornamental y área de juegos infantiles",
  "coverImage": "https://images.unsplash.com/photo-1516481157630-4f5e9d7f3bb4",
  "colonia": "Centro",
  "proposerId": "{{user_id}}",
  "fundingGoal": 750000,
  "fundingDeadline": "2025-12-31T23:59:59.999Z",
  "votingStats": {
    "votesNeeded": 150,
    "votesFor": 0,
    "voters": []
  },
  "supplierInfo": {
    "name": "Constructora Urbana S.A. de C.V.",
    "account": "012345678901234567"
  },
  "status": "VOTING"
}
```

### Ejemplo 2: Cancha Deportiva
```json
{
  "title": "Cancha de Fútbol Comunitaria",
  "description": "Construcción de cancha de fútbol con pasto sintético, iluminación LED y gradas para 200 personas",
  "coverImage": "https://images.unsplash.com/photo-1529900748604-07564a03e7a6",
  "colonia": "Polanco",
  "proposerId": "{{user_id}}",
  "fundingGoal": 1200000,
  "fundingDeadline": "2026-03-31T23:59:59.999Z",
  "votingStats": {
    "votesNeeded": 200,
    "votesFor": 0,
    "voters": []
  },
  "supplierInfo": {
    "name": "Deportes y Construcción MX",
    "account": "098765432109876543"
  },
  "status": "VOTING"
}
```

### Ejemplo 3: Biblioteca Comunitaria
```json
{
  "title": "Biblioteca Pública de Barrio",
  "description": "Creación de biblioteca comunitaria con sala de lectura, área de computadoras, sala infantil y jardín de lectura",
  "coverImage": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
  "colonia": "Coyoacán",
  "proposerId": "{{user_id}}",
  "fundingGoal": 900000,
  "fundingDeadline": "2026-06-30T23:59:59.999Z",
  "votingStats": {
    "votesNeeded": 180,
    "votesFor": 0,
    "voters": []
  },
  "supplierInfo": {
    "name": "Arquitectos Culturales S.C.",
    "account": "111222333444555666"
  },
  "status": "VOTING"
}
```

### Ejemplo 4: Centro Comunitario
```json
{
  "title": "Centro de Desarrollo Comunitario",
  "description": "Espacio multiusos para talleres, juntas vecinales, eventos culturales y programas sociales",
  "coverImage": "https://images.unsplash.com/photo-1497366216548-37526070297c",
  "colonia": "Roma Norte",
  "proposerId": "{{user_id}}",
  "fundingGoal": 1500000,
  "fundingDeadline": "2026-09-30T23:59:59.999Z",
  "votingStats": {
    "votesNeeded": 250,
    "votesFor": 0,
    "voters": []
  },
  "supplierInfo": {
    "name": "Construcciones Sociales del Sur",
    "account": "777888999000111222"
  },
  "status": "VOTING"
}
```

### Feed Items de ejemplo
```json
// MILESTONE
{
  "type": "MILESTONE",
  "text": "¡Hemos alcanzado el 50% de la meta de financiamiento! Gracias a todos los contribuyentes.",
  "imageUrl": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
}

// UPDATE
{
  "type": "UPDATE",
  "text": "Los trabajos de excavación han comenzado. Se espera completar esta fase en 2 semanas.",
  "imageUrl": "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
}

// ESCROW_PAYMENT
{
  "type": "ESCROW_PAYMENT",
  "text": "Se ha liberado el primer pago de $250,000 al proveedor para compra de materiales.",
  "imageUrl": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c"
}

// COMPLETED
{
  "type": "COMPLETED",
  "text": "¡Proyecto completado exitosamente! Gracias a todos los que hicieron posible este sueño.",
  "imageUrl": "https://images.unsplash.com/photo-1521791136064-7986c2920216"
}
```

---

## 💳 ASIDE (Apartados)

### Ejemplo 1: Apartado Quincenal Pequeño
```json
{
  "userId": "{{user_id}}",
  "projectId": "{{project_id}}",
  "amountPerCycle": 250,
  "frequency": "BIWEEKLY"
}
```

### Ejemplo 2: Apartado Quincenal Mediano
```json
{
  "userId": "{{user_id}}",
  "projectId": "{{project_id}}",
  "amountPerCycle": 500,
  "frequency": "BIWEEKLY"
}
```

### Ejemplo 3: Apartado Mensual
```json
{
  "userId": "{{user_id}}",
  "projectId": "{{project_id}}",
  "amountPerCycle": 1000,
  "frequency": "MONTHLY"
}
```

### Ejemplo 4: Apartado Semanal
```json
{
  "userId": "{{user_id}}",
  "projectId": "{{project_id}}",
  "amountPerCycle": 150,
  "frequency": "WEEKLY"
}
```

### Actualizar monto de apartado
```json
{
  "amountPerCycle": 750
}
```

---

## 💸 TRANSACTIONS

### Ejemplo 1: Donación Pequeña
```json
{
  "userId": "{{user_id}}",
  "projectId": "{{project_id}}",
  "amount": 500,
  "source": "ONE_TIME"
}
```

### Ejemplo 2: Donación Mediana
```json
{
  "userId": "{{user_id}}",
  "projectId": "{{project_id}}",
  "amount": 5000,
  "source": "ONE_TIME"
}
```

### Ejemplo 3: Donación Grande
```json
{
  "userId": "{{user_id}}",
  "projectId": "{{project_id}}",
  "amount": 25000,
  "source": "ONE_TIME"
}
```

### Ejemplo 4: Donación Empresarial
```json
{
  "userId": "{{user_id}}",
  "projectId": "{{project_id}}",
  "amount": 100000,
  "source": "ONE_TIME"
}
```

---

## 🎯 VOTOS

### Agregar voto simple
```json
{
  "voterId": "{{user_id}}"
}
```

### Agregar voto de segundo usuario
```json
{
  "voterId": "{{second_user_id}}"
}
```

---

## 💰 FINANCIAMIENTO

### Fondeo pequeño
```json
{
  "amount": 10000
}
```

### Fondeo mediano
```json
{
  "amount": 50000
}
```

### Fondeo grande
```json
{
  "amount": 100000
}
```

---

## 🆔 MongoDB ObjectIds de Ejemplo

Usa estos ObjectIds válidos para pruebas:

```
User IDs:
507f1f77bcf86cd799439011
507f1f77bcf86cd799439012
507f1f77bcf86cd799439013
507f1f77bcf86cd799439014
507f1f77bcf86cd799439015

Project IDs:
607f1f77bcf86cd799439011
607f1f77bcf86cd799439012
607f1f77bcf86cd799439013

Aside IDs:
707f1f77bcf86cd799439011
707f1f77bcf86cd799439012

Transaction IDs:
807f1f77bcf86cd799439011
807f1f77bcf86cd799439012
```

### Generar nuevos ObjectIds

#### En Node.js:
```javascript
const { ObjectId } = require('mongodb');
console.log(new ObjectId().toString());
```

#### En navegador:
```javascript
// Función simple para generar ObjectId
function generateObjectId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const random = Math.random().toString(16).substring(2, 18);
  return (timestamp + random).substring(0, 24);
}
console.log(generateObjectId());
```

---

## 🌎 Colonias de México

Lista de colonias para usar en proyectos:

```
- Centro
- Polanco
- Roma Norte
- Roma Sur
- Condesa
- Coyoacán
- San Ángel
- Del Valle
- Narvarte
- Benito Juárez
- Santa Fe
- Insurgentes
- Chapultepec
- Cuauhtémoc
- Reforma
```

---

## 📅 Fechas de Ejemplo

### Para fundingDeadline:
```
Corto plazo (3 meses):  "2026-01-31T23:59:59.999Z"
Mediano plazo (6 meses): "2026-04-30T23:59:59.999Z"
Largo plazo (1 año):    "2026-10-31T23:59:59.999Z"
```

---

## 💡 Tips para Pruebas

### Flujo completo de proyecto:
1. Crear proyecto en estado VOTING
2. Agregar votos hasta alcanzar `votesNeeded`
3. El estado cambia automáticamente a FUNDING
4. Agregar financiamiento hasta alcanzar `fundingGoal`
5. El estado cambia automáticamente a IN_PROGRESS
6. Agregar feed items tipo UPDATE y MILESTONE
7. Agregar feed item tipo COMPLETED
8. El estado cambia a COMPLETED

### Pruebas de apartados:
1. Crear apartado en estado ACTIVE
2. Pausar el apartado → estado PAUSED
3. Reactivar el apartado → estado ACTIVE
4. Actualizar monto
5. Cancelar el apartado → estado CANCELLED (irreversible)

### Pruebas de transacciones:
1. Crear transacción ONE_TIME
2. Ver transacciones del usuario
3. Ver transacciones del proyecto
4. Procesar deducciones de nómina (apartados activos)
5. Ver dashboard de impacto del usuario

---

## 🔗 URLs de Imágenes de Ejemplo

Para coverImage o imageUrl:

```
Plazas:
https://images.unsplash.com/photo-1516481157630-4f5e9d7f3bb4

Deportes:
https://images.unsplash.com/photo-1529900748604-07564a03e7a6

Bibliotecas:
https://images.unsplash.com/photo-1521587760476-6c12a4b040da

Construcción:
https://images.unsplash.com/photo-1581578731548-c64695cc6952

Comunidad:
https://images.unsplash.com/photo-1497366216548-37526070297c

Dinero/Finanzas:
https://images.unsplash.com/photo-1554224155-8d04cb21cd6c

Celebración:
https://images.unsplash.com/photo-1521791136064-7986c2920216
```

---

## 📊 Escenarios de Prueba Completos

### Escenario 1: Proyecto exitoso completo
```
1. POST /api/projects (VOTING)
2. POST /api/projects/{id}/vote × 100 veces (alcanza votesNeeded)
3. Estado cambia a FUNDING
4. POST /api/projects/{id}/funding × varias veces (alcanza fundingGoal)
5. Estado cambia a IN_PROGRESS
6. POST /api/projects/{id}/feed (varios updates)
7. POST /api/projects/{id}/feed (type: COMPLETED)
8. Estado cambia a COMPLETED
```

### Escenario 2: Usuario contribuyendo
```
1. POST /api/asides (crear apartado quincenal $500)
2. POST /api/transactions/one-time ($5000 donación inicial)
3. POST /api/transactions/process-payroll (simular nómina)
4. GET /api/transactions/user/{userId}
5. GET /api/transactions/user/{userId}/dashboard
```

### Escenario 3: Gestión de apartado
```
1. POST /api/asides (ACTIVE)
2. PATCH /api/asides/{id}/amount (actualizar a $750)
3. PATCH /api/asides/{id}/pause (PAUSED)
4. GET /api/asides/user/{userId} (verificar estado)
5. PATCH /api/asides/{id}/reactivate (ACTIVE)
6. PATCH /api/asides/{id}/cancel (CANCELLED)
```

---

**Tip final:** Guarda este archivo para referencia rápida al hacer pruebas manuales en Postman.
