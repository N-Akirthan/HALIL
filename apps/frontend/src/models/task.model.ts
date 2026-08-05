import { Client } from "./client.model";

export interface Task {
  id: number;
  title: string;
  note: string;
  date: string; // "YYYY-MM-DD"
  hour: string; // "hh:mm:ss"
  done: boolean;
  client: Client;
}
