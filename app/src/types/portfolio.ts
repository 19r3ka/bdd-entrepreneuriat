export interface PortfolioMetric {
  id: string
  label: string
  value: string | number
  subtext: string
  icon: string
  iconColorClass: string // e.g., 'text-primary', 'text-orange-500'
}

export type ActivityStatus = 'VERIFIED' | 'MISSING_INFO' | 'PENDING'

export interface RecentActivity {
  id: string
  name: string
  type: string // e.g., 'Entrepreneur', 'Agri-Business'
  avatarUrl: string
  date: string
  status: ActivityStatus
  statusLabel: string // e.g. "Missing Tax ID"
}

export interface SectorData {
  label: string
  value: number // percentage or raw count
  color: string // hex
}
