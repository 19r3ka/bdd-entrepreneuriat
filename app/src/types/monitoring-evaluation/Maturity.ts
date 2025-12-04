export type MaturityAssessment = {
  id: string
  businessId: string
  achievedMilestoneIds: string[]
  computedScores: Record<string, number>
  notes?: string
  createdAt: Date
  updatedAt: Date
}
