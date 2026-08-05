import { Client } from "./client.model";
import { WorkingHours } from "./working-hours.model";

export interface User {
  id: number;
  name?: string;
  password: string;
  surname?: string;
  email: string;
  role?: string;
  workingHours?: WorkingHours[];
  favoriteClients?: Client[];
}
