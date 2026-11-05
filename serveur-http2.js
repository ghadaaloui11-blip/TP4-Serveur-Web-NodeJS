const http2 = require("http2");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const users = [];

function envoyerPage(stream, fichier, code = 200) {
  const chemin = path.join(__dirname, "public", fichier);
  const flux = fs.createReadStream(chemin);
  flux.on("open", () => {
    stream.respond({
      ":status": code,
      "content-type": "text/html; charset=utf-8",
    });
    flux.pipe(stream);
  });
  flux.on("error", () => {
    stream.respond({
      ":status": 500,
      "content-type": "text/plain; charset=utf-8",
    });
    stream.end("Erreur serveur");
  });
}

function lireCorps(stream) {
  return new Promise((resolve) => {
    let corps = "";
    stream.on("data", (d) => (corps += d));
    stream.on("end", () => {
      resolve(corps);
    });
  });
}

async function traiter(stream, headers) {
  stream.on("error", (err) => console.log("Erreur stream :", err.message));

  const method = headers[":method"];
  const url = new URL(headers[":path"], "http://localhost").pathname;

  if (method === "GET" && url === "/") return envoyerPage(stream, "index.html");

  if (method === "GET" && url === "/inscription")
    return envoyerPage(stream, "inscription.html");

  if (method === "GET" && url === "/subscribe") {
    stream.respond({ ":status": 302, location: "/inscription" });
    return stream.end();
  }

  if (method === "POST" && url === "/inscription") {
    const corps = await lireCorps(stream);

    const params = new URLSearchParams(corps);
    const nom = params.get("nom");
    const email = params.get("email");
    const password = params.get("password");

    if (!nom || !email || !password) {
      stream.respond({
        ":status": 400,
        "content-type": "text/plain; charset=utf-8",
      });
      return stream.end("Champs manquants");
    }

    users.push({ id: users.length + 1, nom: nom, email: email });
    stream.respond({ ":status": 201 });
    return stream.end();
  }

  if (method === "GET" && url === "/users") {
    stream.respond({
      ":status": 200,
      "content-type": "application/json; charset=utf-8",
    });
    return stream.end(JSON.stringify(users));
  }

  if (method === "GET" && url === "/contact")
    return envoyerPage(stream, "contact.html");

  envoyerPage(stream, "404.html", 404);
}

const serveur = http2.createServer();
serveur.on("stream", traiter);
serveur.listen(PORT);
console.log(`Serveur http2 sur http://localhost:${PORT}`);
