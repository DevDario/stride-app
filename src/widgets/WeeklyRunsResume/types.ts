export interface WeeklyRunEntry {
  value: number;
  label?: string;
}

export interface WeeklyRunSummary {
  totalDistance: string;
  percentageChange: number;
  chartData: WeeklyRunEntry[];
  calories: number;
  elevationGain: string;
  avgPace: string;
}
