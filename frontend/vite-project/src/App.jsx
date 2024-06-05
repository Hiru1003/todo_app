import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import blueShape from '../src/assets/img.png'
import greenShape from '../src/assets/img2.png'

const API_URL = 'http://127.0.0.1:8000/';

function App() {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Low');
  const [taskDate, setTaskDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTask, setEditedTask] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}tasks`).then(response => {
      setTasks(response.data);
    });
    axios.get(`${API_URL}done-tasks`).then(response => {
      setDoneTasks(response.data);
    });
  }, []);

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleDateChange = (event) => {
    setTaskDate(event.target.value);
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      const taskToAdd = { task: newTask, date: taskDate, priority: priority, completedAt: null };
      axios.post(`${API_URL}tasks`, taskToAdd).then(response => {
        setTasks([...tasks, response.data]);
        setNewTask('');
        setTaskDate('');
      });
    }
  };

  const deleteTask = (index) => {
    axios.delete(`${API_URL}tasks/${index}`).then(() => {
      const updatedTasks = [...tasks];
      updatedTasks.splice(index, 1);
      setTasks(updatedTasks);
    });
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedTask(tasks[index].task);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditedTask('');
  };

  const saveEditedTask = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editingIndex].task = editedTask;
    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditedTask('');
  };

  const moveTaskToDone = (index) => {
    axios.post(`${API_URL}tasks/${index}/done`).then(response => {
      const taskToMove = response.data;
      const updatedTasks = tasks.filter((task, i) => i !== index);
      setTasks(updatedTasks);
      setDoneTasks([...doneTasks, taskToMove]);
    }).catch(error => {
      console.error('Error moving task to done:', error);
    });
  };

  const deleteDoneTask = (index) => {
    axios.delete(`${API_URL}done-tasks/${index}`).then(() => {
      const updatedDoneTasks = [...doneTasks];
      updatedDoneTasks.splice(index, 1);
      setDoneTasks(updatedDoneTasks);
    });
  };

  return (
    <div className="container">
      <img src={blueShape} alt="Blue Shape" className="top-left-shape" />
      <img src={greenShape} alt="Green Shape" className="bottom-right-shape" />
      <div className="input-column">
        <h1>To-Do List</h1>
        <div className="input-container">
          <input
            type="text"
            value={newTask}
            onChange={handleInputChange}
            placeholder="Add a new task..."
          />
          <select value={priority} onChange={handlePriorityChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            value={taskDate}
            onChange={handleDateChange}
          />
          <button onClick={addTask}>Add</button>
        </div>
    
        <div className="task-list-container">
          <h2 className='heading-task'>Tasks</h2>
          <ul className="task-cards">
            {tasks.map((task, index) => (
              <li key={index} className="task-card">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                  />
                  
                ) : (
                  <span className="task-text">{task.task}</span>
                )}
                <span className="task-date">{task.date}</span>
                <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
                
                <div className="task-buttons">
                  {editingIndex === index ? (
                    <>
                      <button onClick={saveEditedTask}>Save</button>
                      <button onClick={cancelEditing}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => startEditing(index)}>Edit</button>
                  )}
                  <button onClick={() => deleteTask(index)}>Delete</button>
                  <button onClick={() => moveTaskToDone(index)}>Done</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="done-tasks-container">
          <h2>Done</h2>
          <ul className="done-tasks">
            {doneTasks.map((task, index) => (
              <li key={index} className="task-card">
                <span className="task-text">{task.task}</span>
                <span className="task-date">Task Completed At: {task.completedAt}</span>
                <span className="completed-badge">Completed</span>
                <div className="task-buttons">
                  <button onClick={() => deleteDoneTask(index)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
