export interface SendWorkingHours {
  dayOfWeek: string; // ex: "MONDAY"
  openTime: string | null; // "HH:mm" ou null si fermé
  closeTime: string | null; // "HH:mm" ou null si fermé
}
