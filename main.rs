#[macro_use]
extern crate rocket;

use rocket::serde::{json::Json, Deserialize, Serialize};
use rocket::State;
use std::sync::Mutex;

#[derive(Serialize, Deserialize, Clone)]
struct Task {
    id: usize,
    description: String,
}

struct TaskList {
    tasks: Mutex<Vec<Task>>,
}

#[post("/tasks", format = "json", data = "<task>")]
fn create_task(task_list: &State<TaskList>, task: Json<Task>) -> Json<Task> {
    let mut tasks = task_list.tasks.lock().unwrap();
    tasks.push(task.into_inner());
    Json(tasks.last().unwrap().clone())
}

#[get("/tasks")]
fn get_tasks(task_list: &State<TaskList>) -> Json<Vec<Task>> {
    let tasks = task_list.tasks.lock().unwrap();
    Json(tasks.clone())
}

#[delete("/tasks/<id>")]
fn delete_task(task_list: &State<TaskList>, id: usize) -> Option<Json<Vec<Task>>> {
    let mut tasks = task_list.tasks.lock().unwrap();
    if let Some(pos) = tasks.iter().position(|x| x.id == id) {
        tasks.remove(pos);
        Some(Json(tasks.clone()))
    } else {
        None
    }
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![create_task, get_tasks, delete_task])
        .manage(TaskList {
            tasks: Mutex::new(vec![]),
        })
}