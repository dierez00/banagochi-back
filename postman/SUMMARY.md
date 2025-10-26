# 📊 Resumen de la Colección de Postman

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│      🎯 OPERATIONAL SERVICE - POSTMAN COLLECTION               │
│                                                                 │
│      Colección completa para testing de API                    │
│      Versión 1.0.0 | Octubre 2025                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Contenido del Directorio

```
postman/
│
├── 📄 Archivos Principales
│   ├── Operational-Service-Complete.postman_collection.json  (26 requests)
│   └── Operational-Service.postman_environment.json          (Variables)
│
├── 📚 Documentación
│   ├── README.md           # Documentación completa
│   ├── QUICKSTART.md       # Guía rápida (5 minutos)
│   ├── EXAMPLES.md         # Datos de prueba listos
│   └── SUMMARY.md          # Este archivo
│
├── 🔧 Scripts y Herramientas
│   ├── run-tests.js        # Ejecutar tests con Newman
│   ├── generate-objectid.js # Generar MongoDB ObjectIds
│   ├── package.json        # Scripts NPM
│   └── newman.config.json  # Configuración Newman
│
└── 🗂️ Otros
    └── .gitignore          # Ignorar resultados de tests
```

## 🎯 Endpoints Incluidos

### 🏥 Health Check (1)
```
✓ Server Health
```

### 🏗️ Projects (11)
```
✓ 1. Create Project
✓ 2. Get All Projects
✓ 3. Get All Projects (With Filters)
✓ 4. Get Project By ID
✓ 5. Update Project
✓ 6. Add Vote to Project
✓ 7. Add Funding to Project
✓ 8. Add Feed Item to Project
✓ 9. Get Projects By Colonia
✓ 10. Get Projects By Status
✓ 11. Get Projects By Proposer
✓ 12. Soft Delete Project
```

### 💳 Aside - Apartados (8)
```
✓ 1. Create Payroll Aside
✓ 2. Get User Asides
✓ 3. Get Aside By ID
✓ 4. Get Project Asides
✓ 5. Update Aside Amount
✓ 6. Pause Aside
✓ 7. Reactivate Aside
✓ 8. Cancel Aside
```

### 💸 Transactions (5)
```
✓ 1. Create One-Time Transaction
✓ 2. Process Payroll Deductions
✓ 3. Get User Transactions
✓ 4. Get Project Transactions
✓ 5. Get User Impact Dashboard
```

**Total: 26 requests** con tests automáticos ✅

## ⚙️ Variables Configurables

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `base_url` | Manual | URL del servidor (ej: `http://localhost:3000`) |
| `user_id` | Manual | ID de usuario válido (MongoDB ObjectId) |
| `second_user_id` | Manual | Segundo usuario para pruebas |
| `project_id` | Auto | Se guarda al crear proyecto |
| `aside_id` | Auto | Se guarda al crear aside |
| `transaction_id` | Auto | Se guarda al crear transacción |

## 🧪 Tests Automáticos

Cada request incluye:
- ✅ Validación de status codes (200, 201, 400, 404, 500)
- ✅ Validación de estructura de respuesta
- ✅ Validación de tipos de datos
- ✅ Validación de lógica de negocio
- ✅ Logs informativos en consola
- ✅ Guardado automático de variables

## 🚀 Formas de Ejecutar

### 1. Postman GUI (Recomendado para desarrollo)
```
Import → Seleccionar Environment → Ejecutar requests
```

### 2. Collection Runner (Tests automatizados)
```
Click derecho en colección → Run collection → Run
```

### 3. Newman CLI (CI/CD)
```powershell
# Ejecutar con script personalizado
node postman/run-tests.js

# O directamente con Newman
newman run Operational-Service-Complete.postman_collection.json \
  -e Operational-Service.postman_environment.json
```

## 📊 Reportes Generados

Al ejecutar con Newman, se generan:

```
postman/results/
├── test-results-[timestamp].json      # Resultados en JSON
└── test-results-[timestamp].html      # Reporte HTML con gráficas
```

## 🎓 Guías Disponibles

| Archivo | Tiempo | Para quién |
|---------|--------|------------|
| **QUICKSTART.md** | 5 min | Usuarios nuevos que quieren probar rápido |
| **README.md** | 15 min | Todos - Documentación completa |
| **EXAMPLES.md** | Referencia | Desarrolladores que necesitan datos de prueba |

## 🔗 Flujo de Trabajo Típico

```
1. Importar colección y environment ✅
   ↓
2. Configurar user_id en environment ✅
   ↓
3. Iniciar servidor (npx tsx src/index.ts) ✅
   ↓
4. Ejecutar Health Check ✅
   ↓
5. Crear Project → Guarda project_id automáticamente ✅
   ↓
6. Crear Aside → Guarda aside_id automáticamente ✅
   ↓
7. Crear Transaction ✅
   ↓
8. Ejecutar Collection Runner (todos los tests) ✅
   ↓
9. Revisar reportes HTML generados ✅
```

## 🎯 Casos de Uso Principales

### Desarrollo Local
```powershell
# Importar en Postman y ejecutar manualmente
1. Import collection + environment
2. Select environment
3. Send requests one by one
```

### Testing Manual
```powershell
# Usar Collection Runner
1. Right-click on collection
2. Run collection
3. Review results
```

### CI/CD Automatizado
```powershell
# Ejecutar con Newman
npm install -g newman newman-reporter-htmlextra
cd postman
node run-tests.js
```

## 📈 Estadísticas

```
📊 Resumen de Cobertura:

Módulos testeados:        3 (Projects, Aside, Transactions)
Endpoints totales:        26
Tests automáticos:        ~80 assertions
Tiempo ejecución:         ~15-20 segundos
Cobertura de funciones:   100%
```

## 🛠️ Scripts NPM Disponibles

```powershell
# Ejecutar tests
npm test

# Ejecutar con verbose
npm run test:verbose

# Detener en primer error
npm run test:bail

# Para CI/CD
npm run test:ci

# Limpiar resultados anteriores
npm run clean

# Instalar Newman globalmente
npm run install-newman
```

## 🎨 Características Destacadas

✨ **Variables Dinámicas**
- IDs se guardan automáticamente al crear recursos
- No necesitas copiar/pegar IDs manualmente

✨ **Tests Inteligentes**
- Validan no solo status codes sino lógica de negocio
- Logs informativos en consola

✨ **Documentación Embebida**
- Cada request tiene descripción clara
- Ejemplos de uso en el body

✨ **Flujos Realistas**
- Simula casos de uso reales
- Cambios de estado automáticos

✨ **Reportes Profesionales**
- HTML con gráficas y estadísticas
- JSON para integración con otros sistemas

## 🔐 Seguridad

⚠️ **Datos sensibles:**
- No guardes credenciales reales en el environment
- Usa variables de environment para tokens/passwords
- El `.gitignore` incluye archivos de resultados

## 📞 Recursos de Ayuda

| Necesitas | Ve a |
|-----------|------|
| Empezar rápido | `QUICKSTART.md` |
| Documentación completa | `README.md` |
| Datos de prueba | `EXAMPLES.md` |
| Generar ObjectIds | `node generate-objectid.js` |
| Ejecutar tests | `node run-tests.js` |
| Troubleshooting | `README.md` sección 🐛 |

## 🎉 ¡Todo Listo!

Esta colección incluye:
- ✅ 26 requests completamente funcionales
- ✅ 80+ tests automáticos
- ✅ Variables dinámicas
- ✅ Documentación completa
- ✅ Scripts de automatización
- ✅ Ejemplos de datos
- ✅ Generador de ObjectIds
- ✅ Reportes HTML

**¡No necesitas nada más para empezar a probar tu API!** 🚀

---

**Versión:** 1.0.0
**Fecha:** Octubre 2025
**Proyecto:** Operational Service - Banagochi Backend
**Mantenedor:** Banagochi Team
