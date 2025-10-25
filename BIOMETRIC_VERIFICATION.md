# Sistema de Verificación Biométrica

## Descripción

Este microservicio implementa un sistema de verificación biométrica que compara una selfie del usuario con su foto de INE usando IA. La verificación es **obligatoria** en dos escenarios:

1. **Registro de nuevo usuario**
2. **Login desde un dispositivo nuevo**

## Requisitos de Verificación

Para que la verificación biométrica sea exitosa, debe cumplir con los siguientes umbrales:

- **Score**: Mínimo 0.600 (60%)
- **Cosine Similarity**: Mínimo 0.400 (40%)

## Endpoints

### 1. Registro de Usuario

**POST** `/api/users/register`

**Content-Type**: `multipart/form-data`

**Campos requeridos**:
- `name` (string): Nombre del usuario
- `email` (string): Email del usuario
- `password` (string): Contraseña
- `role` (JSON string): Array de roles
- `selfie` (file): Imagen de selfie del usuario
- `ine` (file): Imagen del INE del usuario

**Ejemplo con cURL**:
```bash
curl -X POST http://localhost:3000/api/users/register \
  -F "name=Juan Pérez" \
  -F "email=juan@example.com" \
  -F "password=Password123!" \
  -F "role=[{\"type\":\"user\"}]" \
  -F "selfie=@/path/to/selfie.jpg" \
  -F "ine=@/path/to/ine.jpg"
```

**Ejemplo con JavaScript (FormData)**:
```javascript
const formData = new FormData();
formData.append('name', 'Juan Pérez');
formData.append('email', 'juan@example.com');
formData.append('password', 'Password123!');
formData.append('role', JSON.stringify([{ type: 'user' }]));
formData.append('selfie', selfieFile); // File object
formData.append('ine', ineFile); // File object

const response = await fetch('/api/users/register', {
  method: 'POST',
  body: formData
});
```

**Respuesta exitosa** (201):
```json
{
  "message": "User created successfully",
  "biometricVerification": {
    "verified": true,
    "score": 0.8129,
    "cosine_similarity": 0.6257,
    "model": "insightface-buffalo_l",
    "timestamp": "2025-10-21T10:30:00.000Z"
  },
  "user": {
    "id": "6735f40622f94c7f62673f9c",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": [{ "type": "user" }],
    "status": true
  }
}
```

### 2. Login

**POST** `/api/auth/login`

**Content-Type**: `multipart/form-data` (solo para dispositivos nuevos) o `application/json` (para dispositivos conocidos)

#### Login con Dispositivo Conocido

**Campos requeridos**:
- `email` (string): Email del usuario
- `password` (string): Contraseña
- `deviceId` (string): Identificador único del dispositivo
- `deviceName` (string, opcional): Nombre del dispositivo

**Ejemplo**:
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'juan@example.com',
    password: 'Password123!',
    deviceId: 'device-uuid-123',
    deviceName: 'iPhone 13'
  })
});
```

#### Login con Dispositivo Nuevo

**Campos requeridos**:
- `email` (string): Email del usuario
- `password` (string): Contraseña
- `deviceId` (string): Identificador único del dispositivo nuevo
- `deviceName` (string, opcional): Nombre del dispositivo
- `selfie` (file): Imagen de selfie del usuario
- `ine` (file): Imagen del INE del usuario

**Ejemplo con FormData**:
```javascript
const formData = new FormData();
formData.append('email', 'juan@example.com');
formData.append('password', 'Password123!');
formData.append('deviceId', 'new-device-uuid-456');
formData.append('deviceName', 'iPad Pro');
formData.append('selfie', selfieFile);
formData.append('ine', ineFile);

const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: formData
});
```

**Respuesta exitosa** (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isNewDevice": true,
  "biometricVerification": {
    "verified": true,
    "score": 0.8129,
    "cosine_similarity": 0.6257,
    "model": "insightface-buffalo_l",
    "timestamp": "2025-10-21T10:30:00.000Z"
  },
  "user": {
    "id": "6735f40622f94c7f62673f9c",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": [{ "type": "user" }]
  }
}
```

### 3. Ver Dispositivos Conectados

**GET** `/api/users/:userId/devices`

**Respuesta** (200):
```json
{
  "message": "Devices retrieved successfully",
  "devices": [
    {
      "deviceId": "device-uuid-123",
      "deviceName": "iPhone 13",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "lastLogin": "2025-10-21T10:30:00.000Z"
    },
    {
      "deviceId": "device-uuid-456",
      "deviceName": "iPad Pro",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "lastLogin": "2025-10-20T15:20:00.000Z"
    }
  ]
}
```

### 4. Cerrar Sesión en un Dispositivo

**POST** `/api/users/:userId/logout-device`

**Body**:
```json
{
  "deviceId": "device-uuid-123"
}
```

### 5. Cerrar Sesión en Todos los Dispositivos

**POST** `/api/users/:userId/logout-all`

## Errores Comunes

### 1. Verificación Biométrica Rechazada

**Status**: 403
```json
{
  "message": "La verificación biométrica no cumple con los requisitos mínimos",
  "score": 0.450,
  "cosine_similarity": 0.320,
  "required": {
    "score": 0.600,
    "cosine_similarity": 0.400
  }
}
```

### 2. Archivos Faltantes

**Status**: 400
```json
{
  "message": "Se requieren ambos archivos: selfie e INE"
}
```

### 3. Dispositivo Nuevo sin Verificación

**Status**: 400
```json
{
  "message": "Dispositivo nuevo detectado. Se requiere verificación biométrica (selfie e INE)",
  "isNewDevice": true,
  "requiresBiometric": true
}
```

### 4. Error en Servicio Biométrico

**Status**: 500
```json
{
  "message": "Error en el servicio de verificación biométrica",
  "details": { ... }
}
```

## Límites de Archivos

- **Tamaño máximo por archivo**: 5 MB
- **Formatos aceptados**: Imágenes (jpg, jpeg, png, gif, etc.)
- **Cantidad de archivos**: 2 (selfie e INE)

## Generación de Device ID en el Frontend

### Opción 1: UUID en localStorage (Recomendado)

```javascript
function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem('deviceId');
  
  if (!deviceId) {
    // Generar UUID v4
    deviceId = crypto.randomUUID();
    localStorage.setItem('deviceId', deviceId);
  }
  
  return deviceId;
}

// Usar en el login
const deviceId = getOrCreateDeviceId();
```

### Opción 2: UUID Manual

```javascript
function generateDeviceId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

## Flujo de Trabajo

### Registro de Usuario

1. Usuario completa el formulario de registro
2. Usuario toma una selfie
3. Usuario sube foto de su INE
4. Frontend envía todo a `/api/users/register`
5. Backend verifica biométricamente las imágenes
6. Si la verificación es exitosa (score ≥ 0.6 y cosine_similarity ≥ 0.4), se crea el usuario
7. Usuario recibe confirmación

### Login Primer Dispositivo

1. Usuario ingresa email y password
2. Frontend genera un deviceId único
3. Frontend detecta que es primer login
4. Usuario toma una selfie
5. Usuario sube foto de su INE
6. Frontend envía todo a `/api/auth/login`
7. Backend verifica biométricamente
8. Si es exitoso, se registra el dispositivo y se devuelve el token

### Login Dispositivo Conocido

1. Usuario ingresa email y password
2. Frontend envía deviceId guardado
3. Backend verifica que el dispositivo existe
4. Login exitoso sin verificación biométrica

### Login Dispositivo Nuevo (Usuario Existente)

1. Usuario ingresa email y password en nuevo dispositivo
2. Frontend genera nuevo deviceId
3. Backend detecta que es dispositivo nuevo
4. Usuario debe completar verificación biométrica
5. Si es exitosa, se registra el nuevo dispositivo

## Variables de Entorno

No se requieren variables de entorno adicionales para el servicio de verificación biométrica, ya que se usa un servicio externo en Railway.

## Notas de Seguridad

1. Las imágenes se procesan en memoria y no se almacenan en disco
2. Los tokens de dispositivo se almacenan en la base de datos
3. La verificación biométrica usa el modelo `insightface-buffalo_l`
4. El timeout de la petición biométrica es de 30 segundos

## Testing

### Probar Registro con Postman

1. Crear nueva petición POST a `http://localhost:3000/api/users/register`
2. En la pestaña "Body", seleccionar "form-data"
3. Agregar los campos:
   - `name`: text
   - `email`: text
   - `password`: text
   - `role`: text con valor `[{"type":"user"}]`
   - `selfie`: file
   - `ine`: file
4. Enviar la petición

### Probar Login con Dispositivo Nuevo

1. Crear nueva petición POST a `http://localhost:3000/api/auth/login`
2. En la pestaña "Body", seleccionar "form-data"
3. Agregar los campos:
   - `email`: text
   - `password`: text
   - `deviceId`: text con un UUID
   - `deviceName`: text (opcional)
   - `selfie`: file
   - `ine`: file
4. Enviar la petición
