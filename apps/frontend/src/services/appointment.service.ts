import { Appointment } from "@/models/appointment.model";
import { getAuthHeaders } from "./user.service";
import { SendAppointment } from "@/payload/request/send-appointment";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllAppointments(): Promise<Appointment[]> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };

  const res = await fetch(`${API_BASE_URL}/appointments`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage = errorBody?.detail || "Failed to fetch appointments.";
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function createAppointment(
  payload: SendAppointment
): Promise<Appointment> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage = errorBody?.detail || "Failed to create appointment.";
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function updateAppointment(
  id: number,
  payload: Appointment
): Promise<Appointment> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage = errorBody?.detail || "Failed to update appointment.";
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function deleteAppointment(id: number): Promise<void> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };

  const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const errorMessage = errorBody?.detail || "Failed to delete appointment.";
    throw new Error(errorMessage);
  }
}
