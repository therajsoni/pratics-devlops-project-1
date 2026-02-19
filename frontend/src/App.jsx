import { useState, useEffect } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const backend_port = import.meta.env.VITE_BACKEND;
  const fetchTodos = async () => {
    const res = await fetch(`${backend_port}/todos`);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    await fetch(`${backend_port}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });
    setTitle("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${backend_port}/todos/${id}`, {
      method: "DELETE"
    });
    fetchTodos();
  };

  const triggerJenkins = async() => {
     await fetch(`${backend_port}//trigger-jenkins`, {
     method: "POST"
     });
  } 	
  console.log(backend_port);
  return (
    <div>

      <button onClick={triggerJenkins}>build trigger</button> 
      <h1>Todo App</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map(t => (
          <li key={t._id}>
            {t.title}
            <button onClick={() => deleteTodo(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

