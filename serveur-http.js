const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const users = [];

function envoyerPage(res, fichier, code = 200) {
  const chemin = path.join(__dirname, 'public', fichier);
  const flux = fs.createReadStream(chemin);
  flux.on('open', () => {
    res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' });
    flux.pipe(res);
  });
  flux.on('error', () => {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Erreur serveur');
  });
}

function lireCorps(req) {
  return new Promise((resolve) => {
    let corps = '';
    req.on('data', (d) => (corps += d));
    req.on('end', () => {
      resolve(corps);
    });
  });
}

async function serverTerminer(req, res) {
  const method = req.method;
  const url = new URL(req.url, 'http://localhost').pathname;

  if (method === 'GET' && url === '/') return envoyerPage(res, 'index.html');

  if (method === 'GET' && url === '/inscription') return envoyerPage(res, 'inscription.html');

  if (method === 'GET' && url === '/subscribe') {
    res.writeHead(302, { Location: '/inscription' });
    return res.end();
  }

  if (method === 'POST' && url === '/inscription') {
    const corps = await lireCorps(req);

    const params = new URLSearchParams(corps);
    const nom = params.get('nom');
    const email = params.get('email');
    const password = params.get('password');

    if (!nom || !email || !password) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Champs manquants');
    }

    users.push({ id: users.length + 1, nom: nom, email: email });
    res.writeHead(302, { Location: '/users' });
    return res.end();
  }

  if (method === 'GET' && url === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(users));
  }

  if (method === 'GET' && url === '/contact') return envoyerPage(res, 'contact.html');

  envoyerPage(res, '404.html', 404);
}

http
.createServer(serverTerminer)
.listen(PORT, () =>
  console.log(`Serveur http sur http://localhost:${PORT}`));