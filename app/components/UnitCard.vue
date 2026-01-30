<template>
  <div
    class="unit-card"
    :data-cost="unit.cost"
  >
    <div class="card-header">
      <div class="header-content">
        <span class="unit-name">{{ unit.name }}</span>
        <div
          class="unit-cost"
          :class="`text-cost-${unit.cost}`"
        >
          <span class="cost-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="coin-svg"
            >
              <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H15V11H13V13H15V15H13V17H11V15H9V13H11V11H9V9H11V7Z" />
            </svg>
          </span>
          <span class="cost-value">{{ unit.cost }}</span>
        </div>
      </div>
      <!-- Rarity Strip moved inside header or handled via border -->
    </div>

    <div class="unit-image-wrapper">
      <div class="image-container">
        <NuxtImg
          :src="unit.image"
          :alt="unit.name"
          class="unit-image"
          loading="lazy"
        />
      </div>
    </div>

    <div class="unit-info">
      <div class="unit-traits">
        <span
          v-for="(trait, index) in normalizedTraits"
          :key="index"
          class="trait-tag"
        >
          {{ trait }}
        </span>
      </div>
      <div class="unit-skill">
        <div class="skill-name">
          {{ unit.skill.name }}
        </div>
        <div class="skill-desc">
          {{ unit.skill.description }}
        </div>
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
  return props.unit.traits.map((it) => it.cnName).flat()
})
</script>

<style scoped>
.unit-card {
  background: var(--bg-elevated);
  border-radius: 12px; /* Slightly sharper radius for game UI feel */
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-subtle);
  position: relative;
  height: 100%;
}

/* Rarity Strip at the top */
.unit-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 10;
  transition: background-color 0.3s ease;
}

/* Rarity colors for the top strip */
.unit-card[data-cost="1"]::before { background-color: #9ca3af; }
.unit-card[data-cost="2"]::before { background-color: #22c55e; }
.unit-card[data-cost="3"]::before { background-color: #3b82f6; }
.unit-card[data-cost="4"]::before { background-color: #a855f7; }
.unit-card[data-cost="5"]::before { background-color: #f59e0b; }
.unit-card[data-cost="7"]::before { background-color: #f59e0b; }

.unit-card:hover {
  transform: translateY(-4px);
}

/* Dynamic Hover Shadows based on rarity */
.unit-card[data-cost="1"]:hover { box-shadow: 0 12px 24px -8px rgba(156, 163, 175, 0.25); border-color: #9ca3af; }
.unit-card[data-cost="2"]:hover { box-shadow: 0 12px 24px -8px rgba(34, 197, 94, 0.25); border-color: #22c55e; }
.unit-card[data-cost="3"]:hover { box-shadow: 0 12px 24px -8px rgba(59, 130, 246, 0.25); border-color: #3b82f6; }
.unit-card[data-cost="4"]:hover { box-shadow: 0 12px 24px -8px rgba(168, 85, 247, 0.25); border-color: #a855f7; }
.unit-card[data-cost="5"]:hover { box-shadow: 0 12px 24px -8px rgba(245, 158, 11, 0.25); border-color: #f59e0b; }

.unit-image-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16/9;
  background: var(--bg-surface); /* Fallback */
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.unit-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.unit-card:hover .unit-image {
  transform: scale(1.08);
}

.unit-header-overlay {
  display: none;
}

.image-overlay {
  display: none;
}

.card-header {
  padding: 12px 16px 10px; /* Slight extra top padding for visual balance with the strip */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-subtle);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.unit-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-neutral-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.01em;
}

.unit-cost {
  display: flex;
  align-items: stretch;
  font-family: "Barlow Condensed", sans-serif;
  background: rgba(0,0,0,0.03); /* Subtle pill background */
  padding: 2px 8px;
  border-radius: 12px;
}

/* Dark mode adjustment if variable exists, otherwise this is safe */
@media (prefers-color-scheme: dark) {
  .unit-cost { background: rgba(255,255,255,0.05); }
}

.cost-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
  display: flex;
  align-items: stretch;
  justify-content: center;
}

.cost-value {
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  position: relative;
  top: 0;
}

/* Cost text colors */
.text-cost-1 { color: #6b7280; } /* Darker grey for better contrast on light bg */
.text-cost-2 { color: #16a34a; }
.text-cost-3 { color: #2563eb; }
.text-cost-4 { color: #9333ea; }
.text-cost-5 { color: #d97706; }

.coin-svg {
  width: 100%;
  height: 100%;
  fill: #fbbf24;
}

.unit-info {
  padding: 12px 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Changed from center to allow expansion */
}

.unit-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.unit-skill {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skill-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-neutral-700);
}

.skill-desc {
  font-size: 10px;
  line-height: 1.5;
  color: var(--color-neutral-600);
}

.trait-tag {
  font-size: 11px;
  color: var(--color-neutral-600);
  background: var(--color-neutral-100);
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  font-weight: 600;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.unit-card:hover .trait-tag {
  border-color: var(--border-subtle);
  background: var(--bg-surface);
}

.unit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.unit-image-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16/9;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);
  z-index: 1;
  pointer-events: none;
}

.unit-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.unit-card:hover .unit-image {
  transform: scale(1.05);
}

.unit-header-overlay {
  display: none;
}

.image-overlay {
  display: none;
}

.card-header {
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-subtle);
}

.unit-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-neutral-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unit-cost {
  display: flex;
  align-items: stretch;
  font-size: 16px;
  font-weight: 700;
  font-family: "Barlow Condensed", sans-serif;
}

.cost-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  display: flex;
  align-items: stretch;
  justify-content: center;
}

.coin-svg {
  width: 100%;
  height: 100%;
  fill: #fbbf24;
}

.unit-image-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16/9;
}

.header-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
}

.header-cost {
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  font-family: "Barlow Condensed", sans-serif; /* Optional: if font is available, otherwise default sans is fine */
}

.cost-symbol {
  font-size: 14px;
  margin-right: 1px;
  opacity: 0.9;
  font-weight: 600;
  margin-top: 2px;
}

/* Cost text colors */
.text-cost-1 { color: #9ca3af; }
.text-cost-2 { color: #22c55e; }
.text-cost-3 { color: #3b82f6; }
.text-cost-4 { color: #a855f7; }
.text-cost-5 { color: #f59e0b; }

.coin-svg {
  width: 100%;
  height: 100%;
  fill: #fbbf24;
}

.unit-info {
  padding: 12px 14px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.unit-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.trait-tag {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  font-size: 11px;
  color: var(--color-neutral-600);
  background: var(--color-neutral-100);
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  font-weight: 600;
}
</style>
