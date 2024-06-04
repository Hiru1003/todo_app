import React, { useState } from 'react';
import './App.css';

function App() {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTask, setEditedTask] = useState('');

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedTask(tasks[index]);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditedTask('');
  };

  const saveEditedTask = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editingIndex] = editedTask;
    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditedTask('');
  };

  return (
    <div className="container">
      <div className="input-column">
        <h1>To-Do List</h1>
        <div className="input-container">
          <input
            type="text"
            value={newTask}
            onChange={handleInputChange}
            placeholder="Add a new task..."
          />
          <button onClick={addTask}>Add</button>
        </div>
        <div className="task-list-container">
          <h2>Tasks</h2>
          <ul className="task-cards">
            {tasks.map((task, index) => (
              <li key={index} className="task-card">
                {index === editingIndex ? (
                  <>
                    <input
                      type="text"
                      value={editedTask}
                      onChange={(e) => setEditedTask(e.target.value)}
                    />
                    <div className="task-buttons">
                      <button onClick={saveEditedTask}>Save</button>
                      <button onClick={cancelEditing}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="task-text">{task}</span>
                    <div className="task-buttons">
                      <button onClick={() => startEditing(index)}>Edit</button>
                      <button onClick={() => deleteTask(index)}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
