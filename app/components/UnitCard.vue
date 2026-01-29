<template>
  <div
    class="unit-card"
    :data-cost="unit.cost"
  >
    <div class="unit-image-wrapper">
      <div class="unit-image-placeholder">
        <span class="unit-initial">{{ unit.name.charAt(0) }}</span>
      </div>
      <div
        class="cost-badge"
        :class="`cost-${unit.cost}`"
      >
        {{ unit.cost }}
      </div>
    </div>

    <div class="unit-info">
      <h3 class="unit-name">
        {{ unit.name }}
      </h3>
      <div class="unit-traits">
        <span
          v-for="(trait, index) in normalizedTraits"
          :key="index"
          class="trait-tag"
        >
          {{ trait }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Unit } from '~/types/unit'

interface Props {
  unit: Unit
}

const props = defineProps<Props>()

const normalizedTraits = computed(() => {
  return props.unit.traits.flat()
})
</script>

<style scoped>
.unit-card {
  background: var(--bg-elevated);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 320px;
}

.unit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.unit-image-wrapper {
  position: relative;
  aspect-ratio: 1;
  background: linear-gradient(135deg, var(--color-neutral-100) 0%, var(--color-neutral-200) 100%);
  overflow: hidden;
}

.unit-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unit-initial {
  font-size: 64px;
  font-weight: 700;
  color: var(--color-neutral-400);
  user-select: none;
}

.cost-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Cost colors */
.cost-1 { background: linear-gradient(135deg, #9ca3af, #6b7280); }
.cost-2 { background: linear-gradient(135deg, #22c55e, #16a34a); }
.cost-3 { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.cost-4 { background: linear-gradient(135deg, #a855f7, #9333ea); }
.cost-5 { background: linear-gradient(135deg, #f59e0b, #d97706); }

.unit-info {
  padding: 20px;
}

.unit-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin: 0 0 12px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unit-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.trait-tag {
  font-size: 13px;
  color: var(--color-neutral-600);
  background: var(--color-neutral-100);
  padding: 6px 10px;
  border-radius: 6px;
  white-space: nowrap;
}
</style>
