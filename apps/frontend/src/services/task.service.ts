import { Task } from "@/models/task.model";
import { SendTask } from "@/payload/request/send-task";
import { getAuthHeaders } from "./user.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createTask(payload: SendTask): Promise<Task> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage = errorBody?.detail || "Failed to create task.";
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function getAllTasks(): Promise<Task[]> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };

  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    let errorMessage = "Failed to fetch tasks from server.";
    try {
      const errorBody = text ? JSON.parse(text) : null;
      if (errorBody?.detail) {
        errorMessage = errorBody.detail;
      }
    } catch {
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  const text = await res.text();
  if (!text) {
    return [];
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Réponse invalide du serveur (pas du JSON).");
  }
}

export async function updateTask(id: number, payload: SendTask): Promise<Task> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage = errorBody?.detail || "Failed to update task.";
    throw new Error(errorMessage);
  }

  const data = res.json();
  console.log(data);
  return data;
}

export async function deleteTask(id: number): Promise<void> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };

  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage = errorBody?.detail || "Failed to delete task.";
    throw new Error(errorMessage);
  }
}
