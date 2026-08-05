export interface SendTask {
  title: string;
  note: string;
  date: string; // "YYYY-MM-DD"
  hour: string; // "hh:mm:ss"
  done: boolean;
  client: { id: number };
}
