const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT;
const connectionstring = process.env.CONNECTION_DB;
const db_name = process.env.DB_NAME;

app.use(cors());
app.use(express.json());
// "mongodb://mongo:27017/todo"
mongoose.connect(`${connectionstring}/${db_name}`);

const TodoSchema = new mongoose.Schema({
  title: String
});

const Todo = mongoose.model("Todo", TodoSchema);

// CREATE
app.post("/todos", async (req, res) => {
  const todo = await Todo.create(req.body);
  res.json(todo);
});

// READ
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// DELETE
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

app.listen(port, () => console.log("Server running"));

