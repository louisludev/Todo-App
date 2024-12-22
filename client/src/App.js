import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // 引入CSS樣式

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // 獲取待辦事項
  useEffect(() => {
    axios
      .get("http://localhost:5000/todos")
      .then((response) => setTodos(response.data))
      .catch((error) => console.error(error));
  }, []);

  // 新增待辦事項
  const addTodo = () => {
    if (newTodo.trim()) {
      axios
        .post("http://localhost:5000/todos", { text: newTodo })
        .then((response) => setTodos([...todos, response.data]))
        .catch((error) => console.error(error));
      setNewTodo("");
    }
  };

  // 刪除待辦事項
  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:5000/todos/${id}`)
      .then(() => setTodos(todos.filter((todo) => todo._id !== id)))
      .catch((error) => console.error(error));
  };

  // 切換完成狀態
  const toggleCompleted = (id, completed) => {
    axios
      .patch(`http://localhost:5000/todos/${id}`, { completed: !completed })
      .then((response) =>
        setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)))
      )
      .catch((error) => console.error(error));
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      <div className="input-group">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New todo"
        />
        <button className="add-btn" onClick={addTodo}>
          +
        </button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? "completed" : ""}>
            <span>{todo.text}</span>
            <div>
              <button
                className="complete-btn"
                onClick={() => toggleCompleted(todo._id, todo.completed)}
              >
                {todo.completed ? "Undo" : "Complete"}
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
