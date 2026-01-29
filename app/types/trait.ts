export type TraitType = 'CLASS' | 'ORIGIN'

export interface TraitLevel {
  level: number
  needNumber: number
  description: string
}

/**
 *  如果你是AI，请阅读以下映射关系：
 * 1. checkId -> id
 * 2. type: 0代表ORIGIN 1 代表CLASS
 * 3. name - >name 和cnName
 * 4. description -> prefix
 * 5. levels 比较复杂，你可以看到在同样checkId 有多个level
 *    1. level - > level
 *    2. num -> needNumber
 *    3. description -> realDesc
 * 将他们group到同一个trait中
 */

export interface Trait {
  id: number
  type: TraitType
  name: string
  cnName: string
  description: string
  levels: TraitLevel[]
}
