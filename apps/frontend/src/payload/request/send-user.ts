import { Client } from "@/models/client.model";
import { SendWorkingHours } from "./send-working-hours";

export interface SendUser {
  name?: string;
  password?: string;
  surname?: string;
  email?: string;
  role?: string;
  workingHours?: SendWorkingHours[];
  favoriteClients?: Client[];
  color?: string;
}
