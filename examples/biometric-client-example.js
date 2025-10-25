// Ejemplo de uso del sistema de verificación biométrica

// ============================================
// 1. GENERADOR DE DEVICE ID
// ============================================

/**
 * Obtiene o crea un deviceId único para el dispositivo actual
 * Se almacena en localStorage para persistencia
 */
function getOrCreateDeviceId() {
  const STORAGE_KEY = 'deviceId';
  
  // Intentar obtener deviceId existente
  let deviceId = localStorage.getItem(STORAGE_KEY);
  
  if (!deviceId) {
    // Generar nuevo UUID v4
    deviceId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, deviceId);
    console.log('Nuevo dispositivo creado:', deviceId);
  } else {
    console.log('Dispositivo existente:', deviceId);
  }
  
  return deviceId;
}

// ============================================
// 2. REGISTRO DE USUARIO CON VERIFICACIÓN BIOMÉTRICA
// ============================================

async function registerUser(name, email, password, selfieFile, ineFile) {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', JSON.stringify([{ type: 'user' }]));
    formData.append('selfie', selfieFile);
    formData.append('ine', ineFile);

    const response = await fetch('http://localhost:4000/api/users/register', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el registro');
    }

    console.log('Usuario registrado exitosamente:', data);
    console.log('Verificación biométrica:', data.biometricVerification);

    return data;
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
}

// ============================================
// 3. LOGIN CON DISPOSITIVO CONOCIDO (SIN BIOMETRÍA)
// ============================================

async function loginKnownDevice(email, password) {
  try {
    const deviceId = getOrCreateDeviceId();
    const deviceName = navigator.userAgent.match(/\(([^)]+)\)/)?.[1] || 'Unknown Device';

    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        deviceId,
        deviceName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si es un dispositivo nuevo, necesitamos verificación biométrica
      if (data.isNewDevice && data.requiresBiometric) {
        console.log('Dispositivo nuevo detectado. Se requiere verificación biométrica.');
        return { requiresBiometric: true, data };
      }
      throw new Error(data.message || 'Error en el login');
    }

    console.log('Login exitoso:', data);
    
    // Guardar token en localStorage
    localStorage.setItem('authToken', data.token);

    return data;
  } catch (error) {
    console.error('Error en el login:', error);
    throw error;
  }
}

// ============================================
// 4. LOGIN CON DISPOSITIVO NUEVO (CON BIOMETRÍA)
// ============================================

async function loginNewDevice(email, password, selfieFile, ineFile) {
  try {
    const deviceId = getOrCreateDeviceId();
    const deviceName = navigator.userAgent.match(/\(([^)]+)\)/)?.[1] || 'Unknown Device';

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('deviceId', deviceId);
    formData.append('deviceName', deviceName);
    formData.append('selfie', selfieFile);
    formData.append('ine', ineFile);

    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el login');
    }

    console.log('Login con nuevo dispositivo exitoso:', data);
    console.log('Verificación biométrica:', data.biometricVerification);
    
    // Guardar token en localStorage
    localStorage.setItem('authToken', data.token);

    return data;
  } catch (error) {
    console.error('Error en el login:', error);
    throw error;
  }
}

// ============================================
// 5. VER DISPOSITIVOS CONECTADOS
// ============================================

async function getUserDevices(userId) {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`http://localhost:4000/api/users/${userId}/devices`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error obteniendo dispositivos');
    }

    console.log('Dispositivos conectados:', data.devices);
    return data.devices;
  } catch (error) {
    console.error('Error obteniendo dispositivos:', error);
    throw error;
  }
}

// ============================================
// 6. CERRAR SESIÓN EN UN DISPOSITIVO ESPECÍFICO
// ============================================

async function logoutDevice(userId, deviceId) {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`http://localhost:4000/api/users/${userId}/logout-device`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deviceId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error cerrando sesión');
    }

    console.log('Sesión cerrada en dispositivo:', deviceId);
    return data;
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    throw error;
  }
}

// ============================================
// 7. CERRAR SESIÓN EN TODOS LOS DISPOSITIVOS
// ============================================

async function logoutAllDevices(userId) {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`http://localhost:4000/api/users/${userId}/logout-all`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error cerrando sesiones');
    }

    console.log('Sesión cerrada en todos los dispositivos');
    
    // Limpiar token local
    localStorage.removeItem('authToken');
    
    return data;
  } catch (error) {
    console.error('Error cerrando sesiones:', error);
    throw error;
  }
}

// ============================================
// 8. EJEMPLO DE USO EN FORMULARIO HTML
// ============================================

// HTML de ejemplo:
/*
<form id="registerForm">
  <input type="text" id="name" placeholder="Nombre" required>
  <input type="email" id="email" placeholder="Email" required>
  <input type="password" id="password" placeholder="Contraseña" required>
  <input type="file" id="selfie" accept="image/*" required>
  <input type="file" id="ine" accept="image/*" required>
  <button type="submit">Registrar</button>
</form>

<form id="loginForm">
  <input type="email" id="loginEmail" placeholder="Email" required>
  <input type="password" id="loginPassword" placeholder="Contraseña" required>
  <input type="file" id="loginSelfie" accept="image/*">
  <input type="file" id="loginIne" accept="image/*">
  <button type="submit">Iniciar Sesión</button>
</form>
*/

// JavaScript para el formulario de registro:
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const selfieFile = document.getElementById('selfie').files[0];
  const ineFile = document.getElementById('ine').files[0];
  
  try {
    const result = await registerUser(name, email, password, selfieFile, ineFile);
    alert('Registro exitoso! Verificación biométrica: ' + result.biometricVerification.score);
  } catch (error) {
    alert('Error en el registro: ' + error.message);
  }
});

// JavaScript para el formulario de login:
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const selfieFile = document.getElementById('loginSelfie').files?.[0];
  const ineFile = document.getElementById('loginIne').files?.[0];
  
  try {
    // Intentar login normal primero
    const result = await loginKnownDevice(email, password);
    
    // Si requiere verificación biométrica
    if (result.requiresBiometric) {
      if (!selfieFile || !ineFile) {
        alert('Este es un dispositivo nuevo. Por favor, suba su selfie e INE.');
        return;
      }
      // Intentar con verificación biométrica
      const biometricResult = await loginNewDevice(email, password, selfieFile, ineFile);
      alert('Login exitoso con verificación biométrica!');
    } else {
      alert('Login exitoso!');
    }
  } catch (error) {
    alert('Error en el login: ' + error.message);
  }
});

// ============================================
// 9. FLUJO COMPLETO AUTOMÁTICO
// ============================================

async function smartLogin(email, password, selfieFile = null, ineFile = null) {
  try {
    // Primero intentar login sin biometría
    console.log('Intentando login...');
    const result = await loginKnownDevice(email, password);
    
    // Si no requiere biometría, login exitoso
    if (!result.requiresBiometric) {
      console.log('✅ Login exitoso sin verificación biométrica');
      return result;
    }
    
    // Si requiere biometría pero no se proporcionaron los archivos
    if (!selfieFile || !ineFile) {
      console.log('⚠️ Se requiere verificación biométrica. Por favor proporcione selfie e INE.');
      throw new Error('Se requieren archivos de verificación biométrica');
    }
    
    // Intentar login con verificación biométrica
    console.log('Dispositivo nuevo detectado. Realizando verificación biométrica...');
    const biometricResult = await loginNewDevice(email, password, selfieFile, ineFile);
    console.log('✅ Login exitoso con verificación biométrica');
    
    return biometricResult;
  } catch (error) {
    console.error('❌ Error en login:', error);
    throw error;
  }
}

// Exportar funciones si se usa como módulo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getOrCreateDeviceId,
    registerUser,
    loginKnownDevice,
    loginNewDevice,
    getUserDevices,
    logoutDevice,
    logoutAllDevices,
    smartLogin,
  };
}
