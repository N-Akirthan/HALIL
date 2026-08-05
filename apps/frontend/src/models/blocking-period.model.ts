import { Client } from "./client.model";

export interface BlockingPeriod {
  id: number;
  startDate: string;
  endDate: string;
  cause?: string;
  client?: Client;
}
