/**
 * Unit 类型定义
 */

import type { Trait } from './trait'

/**
 * 如果你是AI，请遵照以下映射规则
 * 1. id -> id, str -> number
 * 2. name -> name
 * 3. price -> cost, str -> number
 * 4. traits比较特殊这里加载了对象数组，转化时元数据：
 *  - 对于origin type species字段代表了trait Id
 *  - 对于class type class 字段代表了 trait Id
 * 5. picture -> image
 * 6. skillName -> skill.name
 * 7. skillDesc -> skill.description
 *
 */
export interface Unit {
  id: number
  name: string
  cost: number
  image: string
  traits: Trait[]
  skill: Skill
}
export interface Skill {
  name: string
  description: string
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
