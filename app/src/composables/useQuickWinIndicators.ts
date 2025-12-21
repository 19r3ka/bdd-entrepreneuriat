import { ref } from 'vue';
import type { QuickWinIndicatorValue as QuickWinIndicatorValueType } from '@/types/monitoring-evaluation/QuickWin';
import { type OutputIndicator } from '@/schemas/monitoring-evaluation/indicators/output';
import { useOutputIndicatorStore } from '@/stores/useOutputIndicatorStore';
import { IndicatorUnitEnum, type IndicatorUnit } from '@/schemas/enums';

/**
 *
 */
export function useQuickWinIndicators() {
  const indicatorStore = useOutputIndicatorStore();
  const indicatorsMap = ref<Record<string, OutputIndicator>>({});

  const addIndicator = (
    indicator: OutputIndicator,
    currentList: QuickWinIndicatorValueType[],
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    if (currentList.some(i => i.indicatorId === indicator.id)) {
      return;
    }

    const newValue: QuickWinIndicatorValueType = {
      indicatorId: indicator.id,
      baseline: undefined,
      target: undefined,
      currentValue: undefined,
      notes: '',
    };

    indicatorsMap.value[indicator.id] = indicator;
    setFieldValue('indicatorValues', [...currentList, newValue]);
  };

  const removeIndicator = (
    index: number,
    currentList: QuickWinIndicatorValueType[],
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    const newList = [...currentList];
    newList.splice(index, 1);
    setFieldValue('indicatorValues', newList);
  };

  const updateIndicatorValue = (
    index: number,
    field: keyof QuickWinIndicatorValueType,
    value: string | number | boolean | undefined | null,
    currentList: QuickWinIndicatorValueType[],
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    const newList = [...currentList];
    if (newList[index]) {
      newList[index] = { ...newList[index], [field]: value };
      setFieldValue('indicatorValues', newList);
    }
  };

  const getIndicatorName = (id: string) => indicatorsMap.value[id]?.name || 'Unknown Indicator';
  const getIndicatorUnit = (id: string) => indicatorsMap.value[id]?.unit || '';

  const isNumericUnit = (id: string) => {
    const unit = getIndicatorUnit(id);
    return [
      IndicatorUnitEnum.enum.count,
      IndicatorUnitEnum.enum.percent,
      IndicatorUnitEnum.enum.hours,
      IndicatorUnitEnum.enum.currency,
      IndicatorUnitEnum.enum.index,
    ].includes(unit as any);
  };

  const isBooleanUnit = (id: string) => (getIndicatorUnit(id) as string) === 'boolean';

  const addSuggestedIndicator = async (
    suggestion: { name: string; unit: any; category?: string },
    currentList: QuickWinIndicatorValueType[],
    setFieldValue: (field: string, value: unknown) => void,
    defaultCategory: string
  ) => {
    let indicator = await indicatorStore.findIndicatorByName(suggestion.name);

    if (!indicator) {
      indicator = await indicatorStore.addIndicator({
        name: suggestion.name,
        unit: suggestion.unit as IndicatorUnit,
        category: (suggestion.category as any) || defaultCategory,
        description: `Auto-created from ${suggestion.category} suggestion`,
        isStandard: false,
        usageCount: 0,
        type: 'output',
      });
    }

    if (indicator) {
      addIndicator(indicator, currentList, setFieldValue);
    }
  };

  return {
    indicatorsMap,
    addIndicator,
    removeIndicator,
    updateIndicatorValue,
    getIndicatorName,
    getIndicatorUnit,
    isNumericUnit,
    isBooleanUnit,
    addSuggestedIndicator,
  };
}
