from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class Task(BaseModel):
    task: str
    date: Optional[str] = None
    priority: str
    completedAt: Optional[str] = None

tasks = []
done_tasks = []

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return tasks

@app.get("/done-tasks", response_model=List[Task])
def get_done_tasks():
    return done_tasks

@app.post("/tasks", response_model=Task)
def add_task(task: Task):
    tasks.append(task)
    return task

@app.delete("/tasks/{task_id}", response_model=Task)
def delete_task(task_id: int):
    task = tasks.pop(task_id)
    return task

@app.post("/tasks/{task_id}/done", response_model=Task)
def move_task_to_done(task_id: int):
    task = tasks.pop(task_id)
    task.completedAt = "Completed"
    done_tasks.append(task)
    return task

@app.delete("/done-tasks/{task_id}", response_model=Task)
def delete_done_task(task_id: int):
    task = done_tasks.pop(task_id)
    return task




#python3 -m venv venv
#source venv/bin/activate