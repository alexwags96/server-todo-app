// routes/todos.js
const express = require("express");
const Todo = require("../models/Todo");
const router = express.Router();
const passport = require("passport");

// Middleware pour vérifier si l'utilisateur est authentifié
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send("Unauthorized");
};

// Créer un nouveau todo
router.post("/", isAuthenticated, async (req, res) => {
  const { title } = req.body;
  // Vérification si le titre est vide
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Todo ne doit pas être vide" });
  }
  const newTodo = new Todo({
    userId: req.user._id, // ID de l'utilisateur connecté
    title,
  });

  try {
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).send("Erreur lors de la création du todo");
  }
});

// Obtenir tous les todos de l'utilisateur connecté
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    res.json(todos);
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération des todos");
  }
});

// Mettre à jour un todo
router.put("/:id", isAuthenticated, async (req, res) => {
  const { title, completed } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Todo ne doit pas être vide" });
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).send("Erreur lors de la mise à jour du todo");
  }
});

// Supprimer un todo
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.send("Todo supprimé");
  } catch (err) {
    res.status(400).send("Erreur lors de la suppression du todo");
  }
});

module.exports = router;
