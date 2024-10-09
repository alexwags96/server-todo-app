require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const User = require("./models/User");
const todosRouter = require("./routes/todos");
const cors = require("cors");
require("./passportConfig");

const app = express();

const port = process.env.PORT || 3000;

// Connexion à MongoDB
const MONGO_uri = process.env.MONGO_URI;
mongoose.connect(MONGO_uri);

// Middleware pour les sessions et Passport
app.use(
  cors({
    origin: "http://localhost:5173", // Remplacez par l'URL de votre frontend
    credentials: true, // Permet l'envoi des cookies si nécessaire
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 heure en millisecondes
      sameSite: "lax", // Pour que le cookie soit accessible sur le même site
      httpOnly: true, // Empêche l'accès au cookie depuis JavaScript (protection CSRF)
      secure: false, // Mets `true` si tu utilises HTTPS en production
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/todos", todosRouter);

// Route pour l'inscription
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Cet utilisateur existe déjà");
    }

    // Si l'utilisateur n'existe pas, créer un nouvel utilisateur
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).send("Utilisateur créé");
  } catch (err) {
    res.status(400).send("Erreur lors de l'inscription");
  }
});

// Route pour la connexion
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Connexion réussie", user: req.user });
});

// Route pour se déconnecter
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Déconnexion réussie" });
  });
});

// Route protégée (accessible uniquement si connecté)
app.get("/protected", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("Contenu protégé");
  } else {
    res.status(401).send("Non autorisé");
  }
});
// Routes
app.get("/", (req, res) => {
  res.status(200).send("Hello");
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
