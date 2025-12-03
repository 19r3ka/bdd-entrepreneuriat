import { computed, ref, toValue, type MaybeRef } from 'vue';
import type { Business } from '@/types/business';
import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';
import { useBusinessHealthStore } from '@/stores/useBusinessHealthStore';

export function usePortfolioHealth(
    businessesRef: MaybeRef<Business[]>,
    metricsRef: MaybeRef<MomentumMetric[]>,
    quickWinsRef: MaybeRef<QuickWin[]>
) {
    const healthStore = useBusinessHealthStore();
    
    // State for jobs disaggregation filter
    const selectedJobsDisagg = ref<'total' | 'women' | 'youth' | 'disability'>('total');

    // 1. Total Businesses
    const totalBusinesses = computed(() => toValue(businessesRef).length);

    // Active businesses: those with activity within past year
    const activeBusinesses = computed(() => {
        const businesses = toValue(businessesRef);
        const quickWins = toValue(quickWinsRef);
        const metrics = toValue(metricsRef);

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        return businesses.filter(b => {
            const hasRecentQuickWin = quickWins.some(qw => 
                qw.businessId === b.id && 
                new Date(qw.createdAt || qw.updatedAt || '') >= oneYearAgo
            );
            
            const hasRecentMetric = metrics.some(m => {
                if (m.businessId !== b.id) return false;
                return m.indicators?.some(ind => 
                    ind.readings?.some(reading => 
                        new Date(reading.asOf) >= oneYearAgo
                    )
                );
            });
            
            return hasRecentQuickWin || hasRecentMetric;
        }).length;
    });

    const inactiveBusinesses = computed(() => totalBusinesses.value - activeBusinesses.value);

    // 2. Profile Completeness
    const profileCompleteness = computed(() => {
        const businesses = toValue(businessesRef);
        if (businesses.length === 0) return 0;
        let completedPoints = 0;
        let totalPoints = businesses.length * 7;
        
        businesses.forEach(b => {
            if (b.name) completedPoints++;
            if (b.primaryBusinessArea) completedPoints++;
            if (b.location) completedPoints++;
            if (b.contact?.email) completedPoints++;
            if (b.contact?.telephone) completedPoints++;
            if (b.entrepreneurId) completedPoints++;
            if (b.activityStartDate) completedPoints++;
        });
        
        return Math.round((completedPoints / totalPoints) * 100);
    });

    // Businesses needing attention (< 100% complete)
    const needsAttentionCount = computed(() => {
        const businesses = toValue(businessesRef);
        return businesses.filter(b => {
            let filled = 0;
            const totalFields = 7;
            
            if (b.name) filled++;
            if (b.primaryBusinessArea) filled++;
            if (b.location) filled++;
            if (b.contact?.email) filled++;
            if (b.contact?.telephone) filled++;
            if (b.entrepreneurId) filled++;
            if (b.activityStartDate) filled++;
            
            return filled < totalFields;
        }).length;
    });

    // 3. Jobs Metric
    const jobsMetric = computed(() => healthStore.getJobsCreated(toValue(metricsRef), toValue(quickWinsRef), 'Year'));

    const displayedJobsValue = computed(() => {
        if (selectedJobsDisagg.value === 'total') {
            return jobsMetric.value.value;
        }
        const disagg = jobsMetric.value.disaggregation?.[selectedJobsDisagg.value];
        return disagg?.toString() || '0';
    });

    // 4. Finance Unlocked
    const financeUnlocked = computed(() => {
        const quickWins = toValue(quickWinsRef);
        const metrics = toValue(metricsRef);
        let total = 0;
        
        quickWins.forEach(qw => {
            qw.indicatorValues.forEach(iv => {
                if (iv.indicatorId.toLowerCase().includes('finance') || 
                    iv.indicatorId.toLowerCase().includes('capital') ||
                    iv.indicatorId.toLowerCase().includes('funding') ||
                    iv.indicatorId.toLowerCase().includes('loan') ||
                    iv.indicatorId.toLowerCase().includes('grant')) {
                    if (typeof iv.currentValue === 'number') {
                        total += iv.currentValue;
                    }
                }
            });
        });
        
        metrics.forEach(m => {
            if (m.category === 'finance_access') {
                m.indicators?.forEach(ind => {
                    const latestReading = ind.readings?.[ind.readings.length - 1];
                    if (latestReading && typeof latestReading.value === 'number') {
                        total += latestReading.value;
                    }
                });
            }
        });
        
        return Math.round(total);
    });

    // 5. Average Maturity Score
    const avgMaturityScore = computed(() => {
        const businesses = toValue(businessesRef);
        const quickWins = toValue(quickWinsRef);

        if (businesses.length === 0) return 0;
        
        const businessesWithMilestones = new Map<string, number[]>();
        
        quickWins.forEach(qw => {
            if (qw.milestone !== undefined && typeof qw.milestone === 'number') {
                if (!businessesWithMilestones.has(qw.businessId)) {
                    businessesWithMilestones.set(qw.businessId, []);
                }
                businessesWithMilestones.get(qw.businessId)!.push(qw.milestone);
            }
        });
        
        if (businessesWithMilestones.size === 0) return 0;
        
        let totalAvgMaturity = 0;
        businessesWithMilestones.forEach((milestones) => {
            const avgForBusiness = milestones.reduce((sum, m) => sum + m, 0) / milestones.length;
            totalAvgMaturity += avgForBusiness;
        });
        
        return parseFloat((totalAvgMaturity / businessesWithMilestones.size).toFixed(1));
    });

    return {
        selectedJobsDisagg,
        totalBusinesses,
        activeBusinesses,
        inactiveBusinesses,
        profileCompleteness,
        needsAttentionCount,
        jobsMetric,
        displayedJobsValue,
        financeUnlocked,
        avgMaturityScore
    };
}
