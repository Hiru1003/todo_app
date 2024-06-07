from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel # type: ignore

app = FastAPI()
origins = [
    "http://localhost:3000",  # React frontend URL
    "http://localhost:5173",  # Vite development server URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    task: str
    date: Optional[str] = None
    priority: str
    completedAt: Optional[str] = None

tasks: List[Task] = []
done_tasks: List[Task] = []


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
    if task_id < 0 or task_id >= len(tasks):
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks.pop(task_id)
    return task

@app.post("/tasks/{task_id}/done", response_model=Task)
def move_task_to_done(task_id: int):
    if task_id < 0 or task_id >= len(tasks):
        raise HTTPException(status_code=404, detail="Task not found")

    task = tasks.pop(task_id)
    task.completedAt = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    done_tasks.append(task)
    return task


@app.delete("/done-tasks/{task_id}", response_model=Task)
def delete_done_task(task_id: int):
    if task_id < 0 or task_id >= len(done_tasks):
        raise HTTPException(status_code=404, detail="Done task not found")
    
    task = done_tasks.pop(task_id)
    return task

@app.get("/summary")
def get_summary():
    total_tasks = len(tasks)
    done_tasks_count = len(done_tasks)
    return {"total_tasks": total_tasks, "done_tasks": done_tasks_count}



if __name__ == "__main__":
    import uvicorn # type: ignore
    uvicorn.run(app, host="0.0.0.0", port=8000)





#python -m venv venv
#source venv/bin/activate
#uvicorn main:app --reload
