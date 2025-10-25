# Ejemplos de Uso - Sistema de Verificación Biométrica

Esta carpeta contiene ejemplos prácticos para probar el sistema de verificación biométrica.

## 📁 Archivos

### 1. `index.html`
**Interfaz web completa** para probar todas las funcionalidades:
- Registro de usuarios con verificación biométrica
- Login con y sin verificación biométrica
- Gestión de dispositivos conectados
- Visualización de resultados de verificación

### 2. `biometric-client-example.js`
**Librería JavaScript** con todas las funciones necesarias:
- `getOrCreateDeviceId()` - Genera y almacena un ID único por dispositivo
- `registerUser()` - Registro con verificación biométrica
- `loginKnownDevice()` - Login desde dispositivo conocido
- `loginNewDevice()` - Login desde dispositivo nuevo con biometría
- `getUserDevices()` - Obtener lista de dispositivos
- `logoutDevice()` - Cerrar sesión en un dispositivo
- `logoutAllDevices()` - Cerrar sesión en todos los dispositivos
- `smartLogin()` - Login automático con detección de dispositivo

## 🚀 Cómo Usar

### Opción 1: Interfaz Web (Recomendado para pruebas)

1. **Inicia el servidor backend**:
```bash
cd ..
npm run dev
```

2. **Abre el archivo HTML**:
   - Navega a la carpeta `examples`
   - Abre `index.html` en tu navegador
   - O usa un servidor local:
   ```bash
   # Con Python 3
   python -m http.server 8080
   
   # Con Node.js (http-server)
   npx http-server -p 8080
   ```

3. **Prueba el sistema**:
   - **Registro**: Completa el formulario y sube selfie e INE
   - **Login**: Ingresa credenciales (se solicitará biometría en dispositivo nuevo)
   - **Dispositivos**: Ver y gestionar dispositivos conectados

### Opción 2: Integrar en tu Proyecto

1. **Copia el archivo JavaScript**:
```bash
cp biometric-client-example.js /tu/proyecto/js/
```

2. **Incluye en tu HTML**:
```html
<script src="js/biometric-client-example.js"></script>
```

3. **Usa las funciones**:
```javascript
// Registro
const result = await registerUser(
  'Juan Pérez',
  'juan@example.com',
  'password123',
  selfieFile,
  ineFile
);

// Login inteligente
const loginResult = await smartLogin(
  'juan@example.com',
  'password123',
  selfieFile,  // opcional
  ineFile      // opcional
);
```

## 📸 Preparar Imágenes de Prueba

Para probar el sistema necesitas:

### Selfie:
- ✅ Foto clara del rostro
- ✅ Buena iluminación
- ✅ Mirando a la cámara
- ✅ Sin lentes oscuros o máscaras
- ✅ Formato: JPG, PNG
- ✅ Tamaño máximo: 5MB

### INE:
- ✅ Foto del lado frontal del INE
- ✅ Foto clara y legible
- ✅ Sin reflejos
- ✅ Formato: JPG, PNG
- ✅ Tamaño máximo: 5MB

**⚠️ IMPORTANTE**: La selfie y el INE deben ser de la misma persona para que la verificación sea exitosa.

## 🧪 Flujos de Prueba

### Flujo 1: Nuevo Usuario

1. Abre `index.html` en el navegador
2. Ve a la pestaña "📝 Registro"
3. Completa el formulario:
   - Nombre: "Juan Pérez"
   - Email: "juan@test.com"
   - Contraseña: "Test123!"
   - Selfie: [selecciona imagen]
   - INE: [selecciona imagen]
4. Haz clic en "Registrarse"
5. Espera la verificación (puede tomar 5-10 segundos)
6. ✅ Deberías ver un mensaje de éxito con los scores

### Flujo 2: Login Primer Dispositivo

1. Ve a la pestaña "🔑 Login"
2. Ingresa:
   - Email: "juan@test.com"
   - Contraseña: "Test123!"
3. Haz clic en "Iniciar Sesión"
4. 📢 El sistema detectará que es un dispositivo nuevo
5. Sube selfie e INE
6. Haz clic en "Iniciar Sesión" nuevamente
7. ✅ Login exitoso con verificación biométrica

### Flujo 3: Login Dispositivo Conocido

1. En el mismo navegador (sin borrar localStorage)
2. Ve a la pestaña "🔑 Login"
3. Ingresa credenciales
4. Haz clic en "Iniciar Sesión"
5. ✅ Login exitoso SIN verificación biométrica

### Flujo 4: Gestión de Dispositivos

1. Después de iniciar sesión
2. Ve a la pestaña "📱 Dispositivos"
3. Verás la lista de dispositivos conectados
4. Puedes cerrar sesión en dispositivos específicos
5. O cerrar sesión en todos los dispositivos

## 🔧 Configuración

### Cambiar URL del API

En `index.html` línea 333:
```javascript
const API_URL = 'http://localhost:3000';
```

En `biometric-client-example.js`, actualiza las URLs en cada función:
```javascript
const response = await fetch('http://tu-servidor.com/api/...', {
  // ...
});
```

### Ajustar Timeout

En el middleware del backend (`src/middleware/biometricVerification.ts`):
```typescript
timeout: 30000, // 30 segundos
```

## 📊 Interpretar Resultados

### Score
- **> 0.8**: ✅ Excelente coincidencia
- **0.6 - 0.8**: ✅ Buena coincidencia (mínimo aceptable)
- **< 0.6**: ❌ Rechazado

### Cosine Similarity
- **> 0.6**: ✅ Muy similar
- **0.4 - 0.6**: ✅ Similar (mínimo aceptable)
- **< 0.4**: ❌ Rechazado

## 🐛 Solución de Problemas

### Error: "CORS policy"
**Solución**: El servidor backend debe tener CORS habilitado:
```javascript
// En tu backend
app.use(cors());
```

### Error: "Cannot read property 'files'"
**Solución**: Asegúrate de que el input type="file" tenga un archivo seleccionado:
```javascript
const file = document.getElementById('selfie').files[0];
if (!file) {
  alert('Por favor selecciona un archivo');
  return;
}
```

### Error: "Verificación rechazada"
**Posibles causas**:
- Las imágenes no son de la misma persona
- Mala calidad de imagen
- INE borroso o con reflejos
- Selfie con mala iluminación

**Solución**: Toma nuevas fotos con mejor calidad

### Error: "Timeout"
**Solución**: El servicio biométrico puede estar lento. Intenta:
- Reducir el tamaño de las imágenes
- Intentar nuevamente en unos segundos
- Verificar conexión a internet

## 📝 Notas

- El **Device ID** se genera automáticamente y se guarda en localStorage
- Si borras localStorage, se generará un nuevo Device ID
- Cada navegador/dispositivo tiene su propio Device ID
- El modo incógnito generará un Device ID temporal

## 🔒 Seguridad

- ❌ **NO** uses este ejemplo en producción sin autenticación adicional
- ✅ Implementa HTTPS en producción
- ✅ Añade rate limiting para prevenir abusos
- ✅ Valida tokens JWT en el backend
- ✅ Implementa refresh tokens para sesiones largas

## 📚 Recursos Adicionales

- [Documentación completa](../BIOMETRIC_VERIFICATION.md)
- [Guía de testing](../TESTING_GUIDE.md)
- [Resumen de implementación](../IMPLEMENTATION_SUMMARY.md)

## 💡 Tips

1. **Prueba en diferentes navegadores** para simular diferentes dispositivos
2. **Usa el modo incógnito** para simular usuarios nuevos
3. **Limpia localStorage** para resetear el Device ID: `localStorage.clear()`
4. **Revisa la consola** del navegador para ver logs detallados
5. **Usa DevTools** > Network para ver las peticiones HTTP

## ✉️ Soporte

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que el servidor backend esté corriendo
3. Comprueba que las imágenes sean válidas
4. Lee los mensajes de error detalladamente
