/**
 * Unit 类型定义
 */

export type UnitRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Unit {
  id: string
  name: string
  cost: number
  rarity: UnitRarity | string
  traits: string[] | string[][]
}

export interface UnitCardProps {
  unit: Unit
}

export interface UseUnitsReturn {
  units: Ref<Unit[]>
  loadMore: () => void
  hasMore: ComputedRef<boolean>
  total: number
}
