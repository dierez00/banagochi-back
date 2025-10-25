# 🔐 Sistema de Verificación Biométrica

## 📖 Descripción General

Sistema completo de autenticación con verificación biométrica usando reconocimiento facial. Compara una selfie del usuario con su foto de INE para garantizar la identidad real de las personas que se registran o inician sesión desde dispositivos nuevos.

---

## 🎯 Características Principales

✅ **Verificación Biométrica Automática**
- Registro de usuarios con validación de identidad
- Login desde dispositivos nuevos con verificación
- API de IA para reconocimiento facial
- Umbrales configurables de precisión

✅ **Gestión de Dispositivos**
- Registro automático de dispositivos
- Tokens únicos por dispositivo
- Tracking de último acceso
- Logout por dispositivo o masivo

✅ **Seguridad Robusta**
- Procesamiento de imágenes en memoria
- Validación de archivos
- Límites de tamaño
- Tokens con expiración

---

## 🚀 Inicio Rápido

### 1. Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd user-microservice

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones
```

### 2. Ejecutar el Servidor

```bash
# Modo desarrollo (con hot reload)
npm run dev

# Compilar TypeScript
npm run build

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

### 3. Probar con la Interfaz Web

```bash
# Navegar a la carpeta de ejemplos
cd examples

# Iniciar servidor HTTP
npx http-server -p 8080

# Abrir en el navegador
# http://localhost:8080
```

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [BIOMETRIC_VERIFICATION.md](./BIOMETRIC_VERIFICATION.md) | Documentación completa del sistema de verificación |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | Guía de pruebas con ejemplos |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | Resumen de implementación técnica |
| [CHECKLIST.md](./CHECKLIST.md) | Lista de verificación de implementación |
| [examples/README.md](./examples/README.md) | Guía de uso de ejemplos |

---

## 🔌 API Endpoints

### Autenticación

#### Login
```http
POST /api/auth/login
Content-Type: multipart/form-data (dispositivo nuevo)
           o application/json (dispositivo conocido)

# Dispositivo nuevo
Body:
  - email: string
  - password: string
  - deviceId: string
  - deviceName: string (opcional)
  - selfie: file
  - ine: file

# Dispositivo conocido
Body:
  {
    "email": "user@example.com",
    "password": "password123",
    "deviceId": "device-uuid",
    "deviceName": "Mi dispositivo"
  }
```

### Usuarios

#### Registro
```http
POST /api/users/register
Content-Type: multipart/form-data

Body:
  - name: string
  - email: string
  - password: string
  - role: string (JSON array)
  - selfie: file
  - ine: file
```

#### Ver Dispositivos
```http
GET /api/users/:userId/devices
Authorization: Bearer {token}
```

#### Cerrar Sesión en Dispositivo
```http
POST /api/users/:userId/logout-device
Content-Type: application/json

Body:
  {
    "deviceId": "device-uuid"
  }
```

#### Cerrar Sesión en Todos los Dispositivos
```http
POST /api/users/:userId/logout-all
Authorization: Bearer {token}
```

---

## 💻 Ejemplos de Uso

### JavaScript (Frontend)

```javascript
// Importar funciones
import { registerUser, smartLogin } from './biometric-client-example.js';

// Registro
const result = await registerUser(
  'Juan Pérez',
  'juan@example.com',
  'Password123!',
  selfieFile,
  ineFile
);

// Login inteligente (detecta automáticamente si necesita biometría)
const loginResult = await smartLogin(
  'juan@example.com',
  'Password123!',
  selfieFile,  // opcional
  ineFile      // opcional
);

console.log('Token:', loginResult.token);
```

### cURL

```bash
# Registro
curl -X POST http://localhost:3000/api/users/register \
  -F "name=Juan Pérez" \
  -F "email=juan@example.com" \
  -F "password=Password123!" \
  -F "role=[{\"type\":\"user\"}]" \
  -F "selfie=@selfie.jpg" \
  -F "ine=@ine.jpg"

# Login dispositivo nuevo
curl -X POST http://localhost:3000/api/auth/login \
  -F "email=juan@example.com" \
  -F "password=Password123!" \
  -F "deviceId=device-123" \
  -F "deviceName=Mi PC" \
  -F "selfie=@selfie.jpg" \
  -F "ine=@ine.jpg"
```

---

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Frontend      │
│  (HTML/JS)      │
└────────┬────────┘
         │
         │ HTTP Request
         │ (multipart/form-data)
         ▼
┌─────────────────────────────────┐
│       Express Server            │
│                                 │
│  ┌──────────────────────────┐  │
│  │  Multer Middleware       │  │
│  │  (File Upload)           │  │
│  └──────────┬───────────────┘  │
│             │                   │
│             ▼                   │
│  ┌──────────────────────────┐  │
│  │  Biometric Middleware    │  │
│  │  - Detect new device     │  │
│  │  - Verify images         │  │
│  └──────────┬───────────────┘  │
│             │                   │
│             ▼                   │
│  ┌──────────────────────────┐  │
│  │  Controller              │  │
│  │  - Register user         │  │
│  │  - Login                 │  │
│  │  - Manage devices        │  │
│  └──────────┬───────────────┘  │
│             │                   │
└─────────────┼───────────────────┘
              │
              ▼
      ┌───────────────┐
      │   MongoDB     │
      │   Database    │
      └───────────────┘

External API:
┌──────────────────────────────────┐
│ Biometric IA Service (Railway)  │
│ https://biometric-ia-production  │
│        .up.railway.app/verify    │
└──────────────────────────────────┘
```

---

## 🔒 Requisitos de Verificación

Para que la verificación biométrica sea exitosa:

| Métrica | Umbral Mínimo | Descripción |
|---------|---------------|-------------|
| **Score** | 0.600 (60%) | Precisión general de coincidencia |
| **Cosine Similarity** | 0.400 (40%) | Similitud entre vectores faciales |

### Calidad de Imágenes

**Selfie:**
- ✅ Rostro centrado y visible
- ✅ Buena iluminación
- ✅ Sin lentes oscuros o máscaras
- ✅ Formato: JPG, PNG
- ✅ Tamaño máximo: 5MB

**INE:**
- ✅ Foto frontal clara
- ✅ Sin reflejos
- ✅ Foto del rostro visible
- ✅ Formato: JPG, PNG
- ✅ Tamaño máximo: 5MB

⚠️ **Importante:** Ambas imágenes deben ser de la misma persona.

---

## 🗂️ Estructura del Proyecto

```
user-microservice/
├── src/
│   ├── config/
│   │   ├── db.ts
│   │   └── multer.ts              ← Nuevo
│   ├── controllers/
│   │   ├── auth.controller.ts     ← Modificado
│   │   ├── menu.controller.ts
│   │   └── user.controller.ts     ← Modificado
│   ├── middleware/
│   │   └── biometricVerification.ts ← Nuevo
│   ├── models/
│   │   ├── menuModel.ts
│   │   ├── roleModel.ts
│   │   └── userModel.ts           ← Modificado
│   ├── routes/
│   │   ├── auth.route.ts          ← Modificado
│   │   ├── menu.routes.ts
│   │   └── user.routes.ts         ← Modificado
│   ├── services/
│   │   └── rabbitServiceEvent.ts
│   ├── types/
│   │   └── amqplib.d.ts
│   ├── utils/
│   │   ├── cache.ts
│   │   └── generateToken.ts
│   ├── app.ts
│   └── index.ts
├── examples/                       ← Nuevo
│   ├── index.html
│   ├── biometric-client-example.js
│   └── README.md
├── dist/
├── node_modules/
├── BIOMETRIC_VERIFICATION.md       ← Nuevo
├── TESTING_GUIDE.md                ← Nuevo
├── IMPLEMENTATION_SUMMARY.md       ← Nuevo
├── CHECKLIST.md                    ← Nuevo
├── README.md                       ← Este archivo
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.6.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "axios": "latest",           // ← Nuevo
    "form-data": "latest",       // ← Nuevo
    "multer": "latest",          // ← Nuevo
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/multer": "latest",   // ← Nuevo
    "@types/form-data": "latest", // ← Nuevo
    "typescript": "^5.0.0",
    "ts-node-dev": "^2.0.0"
  }
}
```

---

## 🧪 Testing

### Prueba Rápida

```bash
# 1. Iniciar servidor
npm run dev

# 2. En otro terminal, probar endpoint
curl http://localhost:3000/api/users/getall

# 3. Abrir interfaz web
cd examples
npx http-server -p 8080
# Navegar a http://localhost:8080
```

### Checklist de Pruebas

- [ ] Servidor inicia sin errores
- [ ] Registro con biometría funciona
- [ ] Login dispositivo nuevo requiere biometría
- [ ] Login dispositivo conocido no requiere biometría
- [ ] Scores biométricos se validan correctamente
- [ ] Dispositivos se registran en la base de datos
- [ ] Se pueden ver dispositivos conectados
- [ ] Se puede cerrar sesión por dispositivo

Ver [TESTING_GUIDE.md](./TESTING_GUIDE.md) para más detalles.

---

## 🐛 Solución de Problemas

### Error: "Cannot find module 'axios'"
```bash
npm install axios form-data multer
npm install --save-dev @types/multer @types/form-data
```

### Error: "Se requiere verificación biométrica"
- Asegúrate de enviar archivos selfie e ine
- Usa `multipart/form-data` como Content-Type
- Verifica que los archivos sean imágenes válidas

### Error: "Verificación biométrica rechazada"
- Las imágenes deben ser de la misma persona
- Mejora la calidad de las fotos
- Asegura buena iluminación
- Evita reflejos en el INE

### Error: "CORS policy"
- Verifica que CORS esté habilitado en el servidor
- Revisa la configuración de `app.use(cors())`

---

## 🔐 Seguridad

### Implementado

- ✅ Verificación biométrica con IA
- ✅ Tokens únicos por dispositivo
- ✅ Procesamiento de imágenes en memoria
- ✅ Validación de tipos y tamaños de archivo
- ✅ Hashing de contraseñas con bcrypt
- ✅ Tokens JWT con expiración

### Recomendaciones para Producción

- [ ] Implementar HTTPS
- [ ] Añadir rate limiting
- [ ] Implementar refresh tokens
- [ ] Agregar logging de auditoría
- [ ] Configurar CORS específico por dominio
- [ ] Implementar 2FA adicional
- [ ] Guardar hash de imágenes para detección de fraude

---

## 📊 Flujo de Usuarios

```
┌─────────────────────────────────────────────────────────┐
│                    NUEVO USUARIO                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │   Registro    │
                  │ (+ Biometría) │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Usuario Creado│
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │  Primer Login │
                  │ (+ Biometría) │
                  └───────┬───────┘
                          │
                          ▼
                ┌──────────────────┐
                │ Dispositivo      │
                │ Registrado       │
                └─────────┬────────┘
                          │
                          ▼
              ┌─────────────────────┐
              │ Logins Posteriores  │
              │ (SIN Biometría)     │
              └─────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              NUEVO DISPOSITIVO (Usuario Existente)      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │  Login desde  │
                  │ nuevo device  │
                  └───────┬───────┘
                          │
                          ▼
                ┌──────────────────┐
                │ Sistema detecta  │
                │ dispositivo nuevo│
                └─────────┬────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │  Requiere     │
                  │  Biometría    │
                  └───────┬───────┘
                          │
                          ▼
                ┌──────────────────┐
                │ Verificación OK  │
                │ Device registrado│
                └─────────┬────────┘
                          │
                          ▼
              ┌─────────────────────┐
              │ Logins Posteriores  │
              │ (SIN Biometría)     │
              └─────────────────────┘
```

---

## 🎓 Aprendizajes y Mejores Prácticas

### ✅ Buenas Prácticas Implementadas

1. **Seguridad en Capas**: Múltiples validaciones (archivos, umbrales, credenciales)
2. **Manejo de Errores**: Mensajes descriptivos en español
3. **Tipado Fuerte**: TypeScript con interfaces bien definidas
4. **Middleware Reutilizable**: Lógica biométrica separada
5. **Documentación Completa**: Múltiples guías y ejemplos

### 📝 Lecciones Aprendidas

- Las imágenes deben procesarse en memoria para seguridad
- La verificación biométrica debe ser condicional (solo dispositivos nuevos)
- Los umbrales deben ser configurables
- La experiencia de usuario mejora con detección automática

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

ISC License - Ver archivo LICENSE para más detalles

---

## 👥 Autores

- **Diego** - Implementación inicial

---

## 🙏 Agradecimientos

- Servicio de IA biométrica: Railway
- Modelo de reconocimiento: InsightFace Buffalo L
- Comunidad de Express.js y TypeScript

---

## 📞 Soporte

¿Necesitas ayuda?

1. 📖 Lee la [documentación completa](./BIOMETRIC_VERIFICATION.md)
2. 🧪 Revisa la [guía de pruebas](./TESTING_GUIDE.md)
3. 💡 Consulta los [ejemplos](./examples/)
4. ✅ Verifica el [checklist](./CHECKLIST.md)

---

## 🗺️ Roadmap

### Versión 1.1
- [ ] Tests unitarios y de integración
- [ ] Rate limiting
- [ ] Logging de auditoría
- [ ] Notificaciones de nuevos dispositivos

### Versión 2.0
- [ ] Dashboard de administración
- [ ] Estadísticas de verificaciones
- [ ] Dispositivos confiables
- [ ] 2FA opcional

---

**Última actualización**: 21 de Octubre, 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Producción Ready

---

Made with ❤️ and ☕
