import type { Unit, UseUnitsReturn } from '~/types/unit'
import _unitsData from '~/data/units.json'

const unitsData: Unit[] = _unitsData as Unit[] // Explicitly cast to Unit[]

const BATCH_SIZE = 12

export const useUnits = (): UseUnitsReturn => {
  const units = ref<Unit[]>([])
  const loadedCount = ref(0)

  const total = unitsData.length

  const loadMore = (): void => {
    if (loadedCount.value >= total) return

    const start = loadedCount.value
    const end = Math.min(start + BATCH_SIZE, total)

    const batch = unitsData.slice(start, end)
    units.value.push(...batch)
    loadedCount.value = end
  }

  const hasMore = computed<boolean>(() => loadedCount.value < total)

  return {
    units,
    loadMore,
    hasMore,
    total,
  }
}
