const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios")

const app = express();
const port = process.env.PORT;
const connectionstring = process.env.CONNECTION_DB;
const db_name = process.env.DB_NAME;
const token_jenkins = process.env.TOKEN_JENKINS;
const jenkins_endpoint = process.env.ENPOINT_JENKINS;

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

// TRIGGER 
app.post("/trigger-jenkins", async (req, res) => {
  try {

    const response = await axios.post(
      `${jenkins_endpoint}?token=${token_jenkins}`
    );

    res.json({
      message: "Jenkins Job Triggered Successfully",
      status: response.status
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to trigger Jenkins",
      error: error.message
    });
  }
});

app.listen(port, () => console.log("Server running"));

