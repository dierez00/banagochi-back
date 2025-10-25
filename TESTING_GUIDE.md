# Test de Verificación Biométrica

## Prueba Rápida con cURL

### 1. Probar que el servidor está corriendo
```bash
curl http://localhost:3000/api/users/getall
```

### 2. Registro de Usuario (Requiere archivos reales)

**Nota**: Reemplaza `/ruta/a/selfie.jpg` y `/ruta/a/ine.jpg` con rutas reales a tus imágenes.

```bash
curl -X POST http://localhost:3000/api/users/register \
  -F "name=Juan Pérez" \
  -F "email=juan@example.com" \
  -F "password=Password123!" \
  -F "role=[{\"type\":\"user\"}]" \
  -F "selfie=@/ruta/a/selfie.jpg" \
  -F "ine=@/ruta/a/ine.jpg"
```

### 3. Login con Dispositivo Nuevo (Requiere archivos reales)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -F "email=juan@example.com" \
  -F "password=Password123!" \
  -F "deviceId=device-test-123" \
  -F "deviceName=Mi Computadora" \
  -F "selfie=@/ruta/a/selfie.jpg" \
  -F "ine=@/ruta/a/ine.jpg"
```

### 4. Login con Dispositivo Conocido (Sin archivos)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123!",
    "deviceId": "device-test-123",
    "deviceName": "Mi Computadora"
  }'
```

## Prueba con Postman

### Setup:
1. Abre Postman
2. Crea una nueva colección llamada "Biometric Auth"

### Request 1: Registro

- **Método**: POST
- **URL**: `http://localhost:3000/api/users/register`
- **Body**: form-data
  - name: `Juan Pérez` (text)
  - email: `juan@example.com` (text)
  - password: `Password123!` (text)
  - role: `[{"type":"user"}]` (text)
  - selfie: [Seleccionar archivo de imagen] (file)
  - ine: [Seleccionar archivo de imagen] (file)

### Request 2: Login Dispositivo Nuevo

- **Método**: POST
- **URL**: `http://localhost:3000/api/auth/login`
- **Body**: form-data
  - email: `juan@example.com` (text)
  - password: `Password123!` (text)
  - deviceId: `device-uuid-123` (text)
  - deviceName: `Mi Laptop` (text)
  - selfie: [Seleccionar archivo de imagen] (file)
  - ine: [Seleccionar archivo de imagen] (file)

### Request 3: Login Dispositivo Conocido

- **Método**: POST
- **URL**: `http://localhost:3000/api/auth/login`
- **Headers**: 
  - Content-Type: `application/json`
- **Body**: raw JSON
```json
{
  "email": "juan@example.com",
  "password": "Password123!",
  "deviceId": "device-uuid-123",
  "deviceName": "Mi Laptop"
}
```

### Request 4: Ver Dispositivos

- **Método**: GET
- **URL**: `http://localhost:3000/api/users/{userId}/devices`
- **Headers**: 
  - Authorization: `Bearer {token}`

### Request 5: Logout de un Dispositivo

- **Método**: POST
- **URL**: `http://localhost:3000/api/users/{userId}/logout-device`
- **Headers**: 
  - Content-Type: `application/json`
  - Authorization: `Bearer {token}`
- **Body**: raw JSON
```json
{
  "deviceId": "device-uuid-123"
}
```

### Request 6: Logout de Todos los Dispositivos

- **Método**: POST
- **URL**: `http://localhost:3000/api/users/{userId}/logout-all`
- **Headers**: 
  - Authorization: `Bearer {token}`

## Respuestas Esperadas

### Registro Exitoso (201)
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
    "role": [{"type": "user"}],
    "status": true
  }
}
```

### Login Exitoso con Dispositivo Nuevo (200)
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
    "role": [{"type": "user"}]
  }
}
```

### Login Exitoso con Dispositivo Conocido (200)
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isNewDevice": false,
  "user": {
    "id": "6735f40622f94c7f62673f9c",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": [{"type": "user"}]
  }
}
```

### Verificación Biométrica Fallida (403)
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

## Checklist de Pruebas

- [ ] Servidor corre sin errores
- [ ] Registro sin archivos es rechazado
- [ ] Registro con archivos válidos funciona
- [ ] Score biométrico >= 0.6
- [ ] Cosine similarity >= 0.4
- [ ] Login primer dispositivo requiere verificación
- [ ] Login dispositivo conocido no requiere verificación
- [ ] Login dispositivo nuevo requiere verificación
- [ ] Se pueden ver dispositivos conectados
- [ ] Se puede cerrar sesión en un dispositivo
- [ ] Se puede cerrar sesión en todos los dispositivos
- [ ] Tokens se almacenan correctamente
- [ ] LastLogin se actualiza correctamente

## Solución de Problemas

### Error: "Cannot find module 'axios'"
```bash
npm install axios form-data multer
```

### Error: "Se requiere verificación biométrica"
- Asegúrate de enviar los archivos selfie e ine como form-data
- Verifica que los archivos sean imágenes válidas

### Error: "La verificación biométrica no cumple con los requisitos"
- Las imágenes deben ser de la misma persona
- La selfie debe ser clara y de buena calidad
- El INE debe mostrar claramente la foto

### Error: "Timeout en la verificación biométrica"
- El servicio externo puede estar sobrecargado
- Intenta nuevamente en unos segundos
- Verifica tu conexión a internet

## Notas Importantes

1. **Imágenes de Prueba**: Las imágenes de selfie e INE deben ser de la misma persona
2. **Tamaño**: Máximo 5MB por archivo
3. **Formato**: Solo imágenes (jpg, jpeg, png, etc.)
4. **DeviceId**: Debe ser único y persistente por dispositivo
5. **Tokens**: Se almacenan en la base de datos y en el cache (15 minutos TTL)
