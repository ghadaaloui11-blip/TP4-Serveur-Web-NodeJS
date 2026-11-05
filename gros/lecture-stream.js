const fs = require('fs');

const avant = process.memoryUsage().rss; 
let morceaux = 0;
let octets = 0;
let maxi = avant;

const rs = fs.createReadStream('gros.txt');    

rs.on('data', (chunk) => {
  morceaux++;
  octets += chunk.length;
  //maxi = Math.max(maxi, process.memoryUsage().rss);
});

rs.on('end', () => {
  maxi = Math.max(maxi, process.memoryUsage().rss);
  console.log('Morceaux :', morceaux);
  console.log('Octets   :', octets);
  console.log('RSS avant:', avant);
  console.log('RSS apres:', maxi );
});
