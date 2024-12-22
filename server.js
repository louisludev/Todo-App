const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // 解析 JSON 請求體

mongoose
  .connect("mongodb://localhost:27017/todoApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const todoSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// 獲取所有待辦事項
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// 創建新的待辦事項
app.post("/todos", async (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
  });
  await newTodo.save();
  res.json(newTodo);
});

// 刪除待辦事項
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.status(200).send("Todo deleted");
});

// 更新待辦事項的完成狀態
app.patch("/todos/:id", async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(updatedTodo);
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
