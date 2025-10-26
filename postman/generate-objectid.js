/**
 * Utilidad para generar MongoDB ObjectIds válidos
 * 
 * Uso:
 * node postman/generate-objectid.js           # Genera 1 ObjectId
 * node postman/generate-objectid.js 5         # Genera 5 ObjectIds
 * node postman/generate-objectid.js --user    # Genera ObjectIds con etiqueta
 */

// Función para generar un ObjectId válido similar a MongoDB
function generateObjectId() {
    const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
    const randomHex = () => Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    return timestamp + randomHex() + randomHex() + randomHex().substring(0, 2);
}

// Parsear argumentos
const args = process.argv.slice(2);
let count = 1;
let label = '';

if (args.length > 0) {
    if (args[0].startsWith('--')) {
        label = args[0].substring(2);
    } else if (!isNaN(args[0])) {
        count = parseInt(args[0]);
    }
}

// Generar ObjectIds
console.log('\n🔑 Generando MongoDB ObjectIds válidos...\n');
console.log('=' .repeat(60));

for (let i = 0; i < count; i++) {
    const id = generateObjectId();
    const prefix = label ? `${label}_${i + 1}` : `ObjectId_${i + 1}`;
    console.log(`${prefix.padEnd(20)}: ${id}`);
}

console.log('=' .repeat(60));
console.log('\n✅ ObjectIds generados exitosamente!\n');

// Instrucciones
console.log('📋 Cómo usar:');
console.log('   1. Copia uno de los IDs de arriba');
console.log('   2. Pega en Postman Environment (variable user_id)');
console.log('   3. O úsalo directamente en tus requests\n');

// Ejemplos adicionales
if (count === 1) {
    console.log('💡 Tips:');
    console.log('   - Genera múltiples: node generate-objectid.js 5');
    console.log('   - Con etiqueta: node generate-objectid.js --user');
    console.log('   - Para proyectos: node generate-objectid.js --project\n');
}
