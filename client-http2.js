const http2 = require("http2");

function requete(client, methode, chemin, corps) {
  return new Promise((resolve, reject) => {
    const entetes = { ":method": methode, ":path": chemin };
    if (corps) {
      entetes["content-type"] = "application/x-www-form-urlencoded";
      entetes["content-length"] = Buffer.byteLength(corps);
    }

    const req = client.request(entetes);
    let statut;
    let location;
    let donnees = "";

    req.on("response", (h) => {
      statut = h[":status"];
      location = h["location"];
    });
    req.on("data", (d) => (donnees += d));
    req.on("end", () => resolve({ statut, location, donnees }));
    req.on("error", reject);

    req.end(corps);
  });
}

async function main() {
  const client = http2.connect("http://localhost:3000");
  client.on("error", (err) => console.log("Erreur cnx :", err.message));

  const accueil = await requete(client, "GET", "/");
  console.log("GET /         ", accueil.statut);

  const subscribe = await requete(client, "GET", "/subscribe");
  console.log(
    "GET /subscribe     ",
    subscribe.statut,
    "vers",
    subscribe.location
  );

  const post = await requete(
    client,
    "POST",
    "/inscription",
    "nom=ghada&email=aloui@mail.tn&password=1234"
  );
  console.log("POST /inscription     ", post.statut);

  const liste = await requete(client, "GET", "/users");
  console.log("GET /users     ", liste.statut, liste.donnees);

  const contact = await requete(client, "GET", "/contact");
  console.log("GET /contact      ", contact.statut);

  const inconnu = await requete(client, "GET", "/nimporte");
  console.log("GET /nimporte     ", inconnu.statut);

  client.close();
}

main();
