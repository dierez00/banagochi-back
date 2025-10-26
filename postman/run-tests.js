/**
 * Script para ejecutar las pruebas de Postman desde la terminal usando Newman
 * 
 * Instalación previa:
 * npm install -g newman newman-reporter-htmlextra
 * 
 * Uso:
 * node postman/run-tests.js
 * 
 * Opciones:
 * node postman/run-tests.js --verbose     # Modo verbose con más detalles
 * node postman/run-tests.js --bail        # Detener en el primer error
 */

const newman = require('newman');
const path = require('path');
const fs = require('fs');

// Paths de archivos
const collectionPath = path.join(__dirname, 'Operational-Service-Complete.postman_collection.json');
const environmentPath = path.join(__dirname, 'Operational-Service.postman_environment.json');
const resultsDir = path.join(__dirname, 'results');

// Crear directorio de resultados si no existe
if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
}

// Configuración
const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');
const shouldBail = args.includes('--bail');

console.log('🚀 Iniciando pruebas de Operational Service...\n');
console.log('📋 Configuración:');
console.log(`   Collection: ${path.basename(collectionPath)}`);
console.log(`   Environment: ${path.basename(environmentPath)}`);
console.log(`   Verbose: ${isVerbose ? 'Sí' : 'No'}`);
console.log(`   Bail on Error: ${shouldBail ? 'Sí' : 'No'}\n`);

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

newman.run({
    collection: require(collectionPath),
    environment: require(environmentPath),
    
    // Reportes
    reporters: ['cli', 'json', 'htmlextra'],
    reporter: {
        cli: {
            noAssertions: !isVerbose,
            noSummary: false,
            noFailures: false,
            noConsole: false
        },
        json: {
            export: path.join(resultsDir, `test-results-${timestamp}.json`)
        },
        htmlextra: {
            export: path.join(resultsDir, `test-results-${timestamp}.html`),
            title: 'Operational Service - Test Report',
            logs: true,
            darkTheme: true,
            showEnvironmentData: true,
            skipEnvironmentVars: [],
            showGlobalData: false,
            skipGlobalVars: [],
            skipSensitiveData: true,
            showMarkdownLinks: true,
            timezone: 'America/Mexico_City',
            browserTitle: 'Operational Service Tests'
        }
    },
    
    // Opciones de ejecución
    iterationCount: 1,
    delayRequest: 500, // 500ms delay between requests
    bail: shouldBail,
    color: 'auto',
    timeout: 60000, // 60 seconds timeout
    timeoutRequest: 30000, // 30 seconds per request
    insecure: false, // No verificar SSL (útil en desarrollo)
    
}, (err, summary) => {
    if (err) {
        console.error('\n❌ Error ejecutando las pruebas:', err.message);
        process.exit(1);
    }

    // Resumen de ejecución
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE PRUEBAS');
    console.log('='.repeat(60) + '\n');

    // Estadísticas de requests
    const stats = summary.run.stats;
    console.log('📡 REQUESTS:');
    console.log(`   Total:    ${stats.requests.total}`);
    console.log(`   ✅ Exitosos: ${stats.requests.passed} (${((stats.requests.passed/stats.requests.total)*100).toFixed(1)}%)`);
    console.log(`   ❌ Fallidos: ${stats.requests.failed} (${((stats.requests.failed/stats.requests.total)*100).toFixed(1)}%)`);
    
    // Estadísticas de assertions
    console.log('\n🧪 ASSERTIONS (Tests):');
    console.log(`   Total:    ${stats.assertions.total}`);
    console.log(`   ✅ Exitosos: ${stats.assertions.passed} (${((stats.assertions.passed/stats.assertions.total)*100).toFixed(1)}%)`);
    console.log(`   ❌ Fallidos: ${stats.assertions.failed} (${((stats.assertions.failed/stats.assertions.total)*100).toFixed(1)}%)`);

    // Tiempo de ejecución
    const duration = summary.run.timings;
    console.log('\n⏱️  TIEMPOS:');
    console.log(`   Inicio:    ${new Date(duration.started).toLocaleTimeString()}`);
    console.log(`   Fin:       ${new Date(duration.completed).toLocaleTimeString()}`);
    console.log(`   Duración:  ${((duration.completed - duration.started) / 1000).toFixed(2)}s`);

    // Detalles de errores
    if (summary.run.failures.length > 0) {
        console.log('\n' + '='.repeat(60));
        console.log('⚠️  DETALLES DE ERRORES');
        console.log('='.repeat(60) + '\n');
        
        summary.run.failures.forEach((failure, index) => {
            console.log(`${index + 1}. ❌ ${failure.error.name}`);
            console.log(`   Request: ${failure.source.name}`);
            console.log(`   Mensaje: ${failure.error.message}`);
            if (failure.error.test) {
                console.log(`   Test:    ${failure.error.test}`);
            }
            console.log('');
        });
    }

    // Archivos generados
    console.log('='.repeat(60));
    console.log('📄 ARCHIVOS GENERADOS');
    console.log('='.repeat(60) + '\n');
    console.log(`   JSON:  ${path.join(resultsDir, `test-results-${timestamp}.json`)}`);
    console.log(`   HTML:  ${path.join(resultsDir, `test-results-${timestamp}.html`)}`);

    // Resultado final
    console.log('\n' + '='.repeat(60));
    if (summary.run.failures.length > 0) {
        console.log('❌ RESULTADO: FALLIDO');
        console.log('='.repeat(60) + '\n');
        process.exit(1);
    } else {
        console.log('✅ RESULTADO: EXITOSO - ¡Todas las pruebas pasaron!');
        console.log('='.repeat(60) + '\n');
        process.exit(0);
    }
});
