export interface MaturityScore {
  axis: 'DIGITAL' | 'MARKET' | 'GREEN' | 'FINANCE' | 'FORMALIZATION';
  score: number; // 0-100
  label: string;
}

export interface Milestone {
  id: string;
  label: string;
  isCompleted: boolean;
  axis: MaturityScore['axis'];
}

export interface KPI {
  id: string;
  label: string;
  value: string | number; // "$4,500" or 8
  subtext: string; // "5 Women"
  sdgTag?: string; // "SDG 8"
  trend?: {
    value: string; // "+12%"
    direction: 'UP' | 'DOWN';
  };
  isEfficiency?: boolean; // Toggles the visual gauge style
}

export interface TimelineEvent {
  id: string;
  type: 'SUPPORT' | 'MEASUREMENT' | 'MATURITY';
  title: string;
  date: string; // formatted string
  description: string;
  tags?: string[];
}