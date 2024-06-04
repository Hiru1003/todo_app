import React, { useState } from 'react';
import './App.css';

function App() {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Low');
  const [taskDate, setTaskDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [taskPriorities, setTaskPriorities] = useState({});

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
      const taskToAdd = { task: newTask, date: taskDate, completedAt: null }; 
      setTasks([...tasks, taskToAdd]);
      setTaskPriorities({ ...taskPriorities, [newTask]: priority });
      setNewTask('');
      setTaskDate('');
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
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
    // Retain the priority for the edited task
    const taskKey = updatedTasks[editingIndex].task;
    updatedTasks[editingIndex].priority = taskPriorities[taskKey];
    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditedTask('');
  };

  const moveTaskToDone = (index) => {
    const taskToMove = tasks[index];
    const completedAt = new Date().toLocaleString(); // Record completion time
    taskToMove.completedAt = completedAt;
    deleteTask(index);
    setDoneTasks([...doneTasks, taskToMove]);
  };

  const deleteDoneTask = (index) => {
    const updatedDoneTasks = [...doneTasks];
    updatedDoneTasks.splice(index, 1);
    setDoneTasks(updatedDoneTasks);
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
          <h2>Tasks</h2>
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
                {taskPriorities[task.task] && (
                  <span className={`priority-badge ${taskPriorities[task.task].toLowerCase()}`}>
                    {taskPriorities[task.task]}
                  </span>
                )}
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
            <span className="task-date">Task Completed At : {task.completedAt}</span>
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
