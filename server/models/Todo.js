// models/Todo.js
const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    }, // Référence à l'utilisateur
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;
