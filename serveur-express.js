/*const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;
const users = [];

let prochainId = 1;

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/inscription", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "inscription.html"));
});

app.get("/subscribe", (req, res) => {
  res.redirect("/inscription");
});

app.post("/users", (req, res) => {
  const { nom, email, password } = req.body || {};

  if (!nom || !email || !password) {
    return res
      .status(400)
      .json({ erreur: "nom, email et password sont requis" });
  }

  const user = { id: prochainId++, nom: nom, email: email };
  users.push(user);
  res.status(201).json({ message: "Inscription réussie", user: user });
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const { nom, email } = req.body || {};

  if (!nom || !email) {
    return res.status(400).json({ erreur: "nom et email sont requis" });
  }

  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ erreur: "Utilisateur introuvable" });
  }

  user.nom = nom;
  user.email = email;
  res.json({ message: "Utilisateur modifié", user: user });
});

app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const position = users.findIndex((u) => u.id === id);

  if (position === -1) {
    return res.status(404).json({ erreur: "Utilisateur introuvable" });
  }

  const supprime = users.splice(position, 1);
  res.json({ message: "Utilisateur supprimé", user: supprime });
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(PORT);
console.log(`Serveur express sur http://localhost:${PORT}`);*/

const express = require("express");
const path = require("path");
const usersRouter = require("./routes/users");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/inscription", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "inscription.html"));
});

app.get("/subscribe", (req, res) => {
  res.redirect("/inscription");
});

app.use("/users", usersRouter);

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(PORT);
console.log(`Serveur express sur http://localhost:${PORT}`);
