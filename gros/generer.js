const fs = require('fs');
const ws = fs.createWriteStream('gros.txt');

for (let i = 0; i < 5_000_000; i++) {
  ws.write(`Ligne ${i} : Atelier Node JS - ISET Charguia\n`);
}
ws.end();

ws.on('finish', () => console.log('gros.txt généré (5000000 lignes)'));