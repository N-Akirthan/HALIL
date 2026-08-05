export interface WorkingHours {
  id: number;
  dayOfWeek: string; // ex: "MONDAY"
  openTime: string | null; // format "HH:mm"
  closeTime: string | null; // format "HH:mm"
}
