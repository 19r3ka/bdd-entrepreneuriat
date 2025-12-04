# TypeScript Build Error Fix Task List

**Generated**: 2025-12-03T20:24:44Z  
**Total Errors**: 242  
**Errors Fixed**: 16 (was 258)

## Priority Files (High Impact)

### P0: Critical (20+ errors each)

- [ ] `src/composables/useValidationForm.test.ts` - 27 errors
- [ ] `src/stores/useSupportStore.test.ts` - 25 errors
- [ ] `src/components/InteractiveMap.vue` - 24 errors

### P1: High (10-19 errors each)

- [ ] `src/stores/useMaturityStore.test.ts` - 17 errors
- [ ] `src/stores/useBusinessHealthStore.ts` - 15 errors
- [ ] `src/composables/useBusinessAreas.test.ts` - 14 errors
- [ ] `src/stores/useBusinessStore.test.ts` - 13 errors

### P2: Medium (5-9 errors each)

- [ ] `src/composables/useSlugLogic.test.ts` - 7 errors
- [ ] `src/composables/useErrorHandler.test.ts` - 7 errors
- [ ] `src/utils/schemaCompletion.test.ts` - 6 errors
- [ ] `src/composables/useStorage.test.ts` - 6 errors
- [ ] `src/composables/useCrudStore.ts` - 6 errors
- [ ] `src/stores/useEntrepreneurStore.test.ts` - 5 errors
- [ ] `src/components/common/ResourceDataTable.vue` - 5 errors

### P3: Low (2-4 errors each)

- [ ] `src/schemas/monitoring-evaluation/Support.test.ts` - 4 errors
- [ ] `src/composables/useCsv.test.ts` - 4 errors
- [ ] `src/composables/useCrudStore.test.ts` - 4 errors
- [ ] `src/utils/string.helpers.test.ts` - 3 errors
- [ ] `src/schemas/entrepreneur.test.ts` - 3 errors
- [ ] `src/composables/useStorage.ts` - 3 errors
- [ ] `src/components/monitoring-evaluation/ME-Timeline.vue` - 3 errors
- [ ] `src/utils/string.helpers.ts` - 2 errors
- [ ] `src/stores/useOutputIndicatorStore.ts` - 2 errors
- [ ] `src/services/local-db.test.ts` - 2 errors
- [ ] `src/constants/businessInitialValues.ts` - 2 errors
- [ ] `src/composables/useConfirmation.test.ts` - 2 errors
- [ ] `src/components/monitoring-evaluation/QuickWinForm.vue` - 2 errors
- [ ] `src/components/monitoring-evaluation/MeasurementForm.vue` - 2 errors
- [ ] `src/components/monitoring-evaluation/GoalForm.vue` - 2 errors
- [ ] `src/components/EntrepreneurForm.vue` - 2 errors
- [ ] `src/components/BusinessOverviewTab.vue` - 2 errors

### P4: Minimal (1 error each) - 30 files

Files with single errors - can be batch-fixed or deferred

## Error Type Distribution

### Common Error Patterns

1. **Test file issues** (~100+ errors)
   - Missing vitest types
   - Mock/spy type issues
   - Test data type mismatches

2. **Null safety** (~40+ errors)
   - Optional chaining needed
   - Null checks required
   - Undefined access

3. **Type mismatches** (~30+ errors)
   - Assignment type conflicts
   - Argument type issues
   - Return type problems

4. **Property access** (~40+ errors)
   - Non-existent properties
   - Type narrowing needed
   - Union type issues

## Fix Strategy

### Phase 3.1: Test Files (Est. 100+ errors)

**Option A**: Fix test infrastructure

- Add proper test type declarations
- Fix mock/spy patterns
- Update test data structures

**Option B**: Temporarily skip test type checking

- Add `// @ts-nocheck` to test files
- Focus on source code errors first
- Fix tests in separate pass

### Phase 3.2: InteractiveMap.vue (24 errors)

Critical component with many type issues

- Leaflet type integration
- Event handler types
- Map state management

### Phase 3.3: Store Files (30+ errors)

- useSupportStore.test.ts (25)
- useBusinessHealthStore.ts (15)
- useMaturityStore.test.ts (17)
- useBusinessStore.test.ts (13)

### Phase 3.4: Composables (40+ errors)

- useValidationForm.test.ts (27)
- useBusinessAreas.test.ts (14)
- Other composable tests (20+)

### Phase 3.5: Components (30+ errors)

- ResourceDataTable.vue (5)
- ME-Timeline.vue (3)
- Various M&E forms (8+)

### Phase 3.6: Utilities & Schemas (20+ errors)

- string.helpers (5 total)
- schemaCompletion.test.ts (6)
- Support.test.ts (4)

## Quick Wins

### Batch Fixes

1. Add optional chaining to all property access: `obj.prop` → `obj?.prop`
2. Add null checks before operations
3. Add type assertions where safe: `value as Type`
4. Fix obvious type mismatches

### Test File Strategy

Consider adding to affected test files:

```typescript
// @ts-nocheck
```

Or create separate `tsconfig.test.json` with relaxed rules

## Progress Tracking

- [x] Phase 1: Test configuration (16 errors fixed)
- [x] Phase 2: Business type refs (5 errors fixed)
- [ ] Phase 3.1: Test files
- [ ] Phase 3.2: InteractiveMap
- [ ] Phase 3.3: Store files
- [ ] Phase 3.4: Composables
- [ ] Phase 3.5: Components
- [ ] Phase 3.6: Utils & schemas

## Notes

- Test files account for ~40% of errors
- Source code has ~140 errors
- Most errors are fixable with type annotations and null checks
- Some may require refactoring (e.g., InteractiveMap)
