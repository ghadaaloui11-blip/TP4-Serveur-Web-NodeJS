const express = require("express");

const router = express.Router();

const users = [];
let prochainId = 1;

router.get("/", (req, res) => {
  res.json(users);
});

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const position = users.findIndex((u) => u.id === id);

  if (position === -1) {
    return res.status(404).json({ erreur: "Utilisateur introuvable" });
  }

  const supprime = users.splice(position, 1)[0];
  res.json({ message: "Utilisateur supprimé", user: supprime });
});

module.exports = router;
