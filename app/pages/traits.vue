<template>
  <div class="traits-page">
    <div class="page-header">
      <h1 class="page-title">
        羁绊图鉴
      </h1>
      <p class="page-subtitle">
        按类型分组展示所有羁绊，点击行可展开等级效果
      </p>
    </div>

    <div class="traits-table-wrap">
      <table class="traits-table">
        <colgroup>
          <col class="col-name">
          <col class="col-type">
          <col class="col-desc">
          <col class="col-levels">
        </colgroup>
        <thead>
          <tr>
            <th class="col-name">
              名称
            </th>
            <th class="col-type">
              类型
            </th>
            <th class="col-desc">
              描述
            </th>
            <th class="col-levels">
              等级
            </th>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="trait in orderedTraits"
            :key="trait.id"
          >
            <tr
              class="trait-row"
              :class="{ expanded: isExpanded(trait.id) }"
            >
              <td class="col-name">
                <button
                  class="expand-button"
                  type="button"
                  :aria-expanded="isExpanded(trait.id)"
                  :aria-controls="`trait-levels-${trait.id}`"
                  @click="toggleTrait(trait.id)"
                >
                  <span class="expand-icon" />
                  <span class="trait-name">{{ trait.name }}</span>
                </button>
              </td>
              <td class="col-type">
                <span
                  class="type-badge"
                  :class="trait.type === 'ORIGIN' ? 'type-origin' : 'type-class'"
                >
                  {{ typeLabels[trait.type] }}
                </span>
              </td>
              <td class="col-desc">
                {{ trait.description }}
              </td>
              <td class="col-levels">
                <span class="levels-summary">
                  {{ trait.levels.length }} 级
                </span>
              </td>
            </tr>
            <tr
              v-show="isExpanded(trait.id)"
              :id="`trait-levels-${trait.id}`"
              class="levels-row"
            >
              <td colspan="4">
                <div class="levels-wrap">
                  <div
                    v-for="level in trait.levels"
                    :key="level.level"
                    class="level-item"
                  >
                    <span class="level-badge">{{ level.needNumber }} 人口</span>
                    <span class="level-desc">{{ level.description }}</span>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="traits-cards">
      <div class="cards-grid">
        <article
          v-for="trait in orderedTraits"
          :key="trait.id"
          class="trait-card"
        >
          <div class="card-header">
            <div class="card-title">
              <span class="trait-name">{{ trait.name }}</span>
              <span
                class="type-badge"
                :class="trait.type === 'ORIGIN' ? 'type-origin' : 'type-class'"
              >
                {{ typeLabels[trait.type] }}
              </span>
            </div>
            <button
              class="card-toggle"
              type="button"
              :aria-expanded="isExpanded(trait.id)"
              @click="toggleTrait(trait.id)"
            >
              {{ isExpanded(trait.id) ? '收起' : '展开' }}
            </button>
          </div>
          <p class="card-desc">
            {{ trait.description }}
          </p>
          <div
            v-show="isExpanded(trait.id)"
            class="card-levels"
          >
            <div
              v-for="level in trait.levels"
              :key="level.level"
              class="level-item"
            >
              <span class="level-badge">{{ level.needNumber }} 人口</span>
              <span class="level-desc">{{ level.description }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Trait } from '~/types/trait'
import traitsRaw from '~/data/trait-new.json'

useHead({
  title: '羁绊图鉴 - TFT Dex',
})

const traits = traitsRaw as Trait[]

const typeLabels = {
  ORIGIN: '地区',
  CLASS: '职业',
} as const

const groupedTraits = computed(() => {
  const groups = {
    ORIGIN: [] as Trait[],
    CLASS: [] as Trait[],
  }

  traits.forEach((trait) => {
    if (trait.type === 'ORIGIN') {
      groups.ORIGIN.push(trait)
      return
    }
    groups.CLASS.push(trait)
  })

  groups.ORIGIN.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
  groups.CLASS.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))

  return [
    { type: 'ORIGIN', title: '地区', items: groups.ORIGIN },
    { type: 'CLASS', title: '职业', items: groups.CLASS },
  ]
})

const orderedTraits = computed(() => groupedTraits.value.flatMap((group) => group.items))

const expandedTraits = ref<Set<number>>(new Set())

const isExpanded = (id: number) => expandedTraits.value.has(id)

const toggleTrait = (id: number) => {
  const next = new Set(expandedTraits.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  expandedTraits.value = next
}
</script>

<style scoped>
.traits-page {
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: var(--color-neutral-500);
  margin: 0;
}

.traits-table-wrap {
  background: var(--color-neutral-0);
  border-radius: 16px;
  border: 1px solid var(--color-neutral-200);
  overflow: hidden;
}

.traits-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: fixed;
}

.col-name {
  width: 22%;
}

.col-type {
  width: 12%;
}

.col-desc {
  width: 48%;
}

.col-levels {
  width: 18%;
}

.traits-table thead th {
  text-align: left;
  padding: 14px 16px;
  font-weight: 600;
  color: var(--color-neutral-700);
  background: var(--color-neutral-50);
  border-bottom: 1px solid var(--color-neutral-200);
  vertical-align: middle;
}

.trait-row td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-neutral-100);
  vertical-align: top;
}

.trait-row:hover td {
  background: var(--color-neutral-50);
}

.trait-row.expanded td {
  background: var(--color-neutral-0);
}

.expand-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  color: var(--color-neutral-900);
  cursor: pointer;
}

.expand-icon {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid var(--color-neutral-300);
  position: relative;
}

.trait-row.expanded .expand-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 2px;
  background: var(--color-neutral-600);
  transform: translate(-50%, -50%);
}

.expand-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 2px;
  background: var(--color-neutral-600);
  transform: translate(-50%, -50%);
}

.trait-row:not(.expanded) .expand-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 6px;
  background: var(--color-neutral-600);
  transform: translate(-50%, -50%);
}

.type-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.type-origin {
  background: rgba(55, 120, 255, 0.12);
  color: #2d5be3;
}

.type-class {
  background: rgba(245, 139, 56, 0.16);
  color: #d56a1e;
}

.levels-summary {
  color: var(--color-neutral-500);
  font-size: 12px;
  white-space: nowrap;
}

.levels-row td {
  padding: 0 16px 16px 48px;
  background: var(--color-neutral-0);
}

.levels-wrap {
  display: grid;
  gap: 10px;
}

.level-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--color-neutral-700);
}

.level-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 8px;
  background: var(--color-neutral-100);
  color: var(--color-neutral-700);
  font-size: 12px;
  font-weight: 600;
}

.cards-grid {
  display: grid;
  gap: 16px;
}

.traits-cards {
  display: none;
}

.trait-card {
  background: var(--color-neutral-0);
  border: 1px solid var(--color-neutral-200);
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-neutral-900);
}

.card-toggle {
  border: none;
  background: var(--color-neutral-100);
  color: var(--color-neutral-700);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
}

.card-desc {
  font-size: 13px;
  color: var(--color-neutral-600);
  margin: 12px 0 0 0;
}

.card-levels {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

@media (max-width: 820px) {
  .traits-table-wrap {
    display: none;
  }

  .traits-cards {
    display: block;
  }
}

@media (max-width: 640px) {
  .page-title {
    font-size: 26px;
  }
}
</style>
