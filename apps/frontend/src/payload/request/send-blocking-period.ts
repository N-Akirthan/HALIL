export interface SendBlockingPeriod {
  startDate: string;
  endDate: string;
  cause?: string;
  client: { id: number };
}
