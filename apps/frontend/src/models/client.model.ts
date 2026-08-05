import { Appointment } from "./appointment.model";
import { OpeningHours } from "./opening-hours.model";
import { Task } from "./task.model";

export interface Client {
  id: number;
  name: string;
  address: string;
  email?: string;
  phone?: string;
  phone2?: string;
  landline_phone?: string;
  manager?: string;
  main_contact?: string;
  accountant?: string;
  accountant_phone?: string;
  commercial?: string;
  note?: string;
  isOpen?: boolean;
  tasks?: Task[];
  appointments?: Appointment[];
  openingHours?: OpeningHours[];
  color?: string;
}
