#[macro_use] extern crate rocket;

use rocket::serde::{json::Json, Deserialize, Serialize};
use rocket::State;
use rocket::http::Status;
use rocket::response::status;
use std::sync::Mutex;

#[derive(Serialize, Deserialize, Clone)]
struct Task {
    id: usize,
    description: String,
}

struct TaskList {
    tasks: Mutex<Vec<Task>>,
}

#[derive(Serialize, Debug)]
struct ApiError {
    message: String,
}

impl<'r> rocket::response::Responder<'r, 'static> for ApiError {
    fn respond_to(self, _: &'r rocket::Request<'_>) -> rocket::response::Result<'static> {
        let response = rocket::Response::build()
            .sized_body(std::io::Cursor::new(serde_json::to_string(&self).unwrap()))
            .status(Status::InternalServerError)
            .finalize();
        Ok(response)
    }
}

fn acquire_lock<T>(lock: &Mutex<T>) -> Result<std::sync::MutexGuard<'_, T>, ApiError> {
    lock.lock().map_err(|e| ApiError { message: format!("Failed to acquire lock: {}", e) })
}

#[post("/tasks", format = "json", data = "<task>")]
fn create_task(task_list: &State<TaskList>, task: Json<Task>) -> Result<Json<Task>, ApiError> {
    let mut tasks = acquire_lock(&task_list.tasks)?;
    tasks.push(task.into_inner());
    Ok(Json(tasks.last().unwrap().clone()))
}

#[get("/tasks")]
fn get_tasks(task_list: &State<TaskList>) -> Result<Json<Vec<Task>>, ApiError> {
    let tasks = acquire_lock(&task_list.tasks)?;
    Ok(Json(tasks.clone()))
}

#[delete("/tasks/<id>")]
fn delete_task(task_list: &State<TaskList>, id: usize) -> Result<status::Custom<Json<Vec<Task>>>, ApiError> {
    let mut tasks = acquire_lock(&task_list.tasks)?;
    if let Some(pos) = tasks.iter().position(|x| x.id == id) {
        tasks.remove(pos);
        Ok(status::Custom(Status::Ok, Json(tasks.clone())))
    } else {
        Err(ApiError { message: format!("Task with id {} not found", id) })
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