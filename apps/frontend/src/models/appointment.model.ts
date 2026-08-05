import { Client } from "./client.model";

export interface Appointment {
  id: number;
  note: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "hh:mm:ss"
  endTime: string; // "hh:mm:ss"
  title: string;
  done: boolean;
  client: Client;
}
