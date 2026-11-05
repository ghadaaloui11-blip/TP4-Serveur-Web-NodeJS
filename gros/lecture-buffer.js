const fs = require('fs');

const avant = process.memoryUsage().rss;
const data = fs.readFileSync('gros.txt');      
const apres = process.memoryUsage().rss;

console.log('Taille  fichier :', data.length);
console.log('RSS avant :', avant );
console.log('RSS après :', apres );