export interface SendAppointment {
  note: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "hh:mm:ss"
  endTime: string; // "hh:mm:ss"
  title: string;
  done: boolean;
  client: { id: number };
}
