<template>
  <div class="unit-detail-page">
    <div class="detail-card">
      <template v-if="unit">
        <div
          class="card-header"
          :data-cost="unit.cost"
        >
          <div class="header-content">
            <div class="title-group">
              <h1 class="unit-name">
                {{ unit.name }}
              </h1>
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
            <div class="unit-id">
              ID: {{ unit.id }}
            </div>
          </div>
          <div
            class="rarity-strip"
            :data-cost="unit.cost"
          />
        </div>

        <div class="card-body">
          <div class="image-panel">
            <NuxtImg
              :src="unit.image"
              :alt="unit.name"
              class="unit-image"
              loading="lazy"
            />
          </div>

          <div class="info-panel">
            <div class="section">
              <div class="section-title">
                羁绊
              </div>
              <div class="traits">
                <span
                  v-for="(trait, index) in normalizedTraits"
                  :key="index"
                  class="trait-tag"
                >
                  {{ trait }}
                </span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">
                技能
              </div>
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

      <div
        v-else
        class="empty-state"
      >
        <div class="empty-title">
          未找到该英雄
        </div>
        <div class="empty-desc">
          请检查链接是否正确
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Unit } from '~/types/unit'
import _unitsData from '~/data/units.json'

const unitsData: Unit[] = _unitsData as Unit[]
const route = useRoute()

const clickedUnitId = useState('clicked-unit-id', () => null)
const animateScale = ref(false)

const unitId = computed(() => {
  const value = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  return Number(value)
})

const unit = computed(() => unitsData.find((item) => item.id === unitId.value))

const normalizedTraits = computed(() => {
  return unit.value?.traits.map((it) => it.cnName).flat() ?? []
})

onMounted(() => {
  if (clickedUnitId.value === unitId.value) {
    animateScale.value = true
    setTimeout(() => {
      clickedUnitId.value = null
    }, 500)
  }
})

// 页面元数据
useHead({
  title: unit.value ? `${unit.value.name} - 英雄详情 - TFT Dex` : '英雄详情 - TFT Dex',
})
</script>

<style scoped>
.unit-detail-page {
  min-height: 100vh;
  background: #fff;
  padding: 32px 24px 56px;
  display: flex;
  justify-content: center;
  position: relative;
}

.unit-detail-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--bg-base);
  z-index: -1;
}

.detail-card {
  width: min(1040px, 100%);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  position: relative;
  padding: 20px 24px 18px;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-subtle);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.unit-name {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-neutral-900);
  margin: 0;
}

.unit-id {
  font-size: 12px;
  color: var(--color-neutral-500);
  font-weight: 600;
}

.unit-cost {
  display: inline-flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.03);
  padding: 4px 10px;
  border-radius: 12px;
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 700;
}

.cost-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cost-value {
  font-size: 16px;
}

.coin-svg {
  width: 100%;
  height: 100%;
  fill: #fbbf24;
}

.rarity-strip {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
}

.rarity-strip[data-cost="1"] { background-color: #9ca3af; }
.rarity-strip[data-cost="2"] { background-color: #22c55e; }
.rarity-strip[data-cost="3"] { background-color: #3b82f6; }
.rarity-strip[data-cost="4"] { background-color: #a855f7; }
.rarity-strip[data-cost="5"] { background-color: #f59e0b; }
.rarity-strip[data-cost="7"] { background-color: #f59e0b; }

.card-body {
  display: grid;
  grid-template-columns: minmax(280px, 360px) 1fr;
  gap: 24px;
  padding: 24px;
}

.image-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unit-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-neutral-600);
  letter-spacing: 0.08em;
}

.traits {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.trait-tag {
  font-size: 12px;
  color: var(--color-neutral-700);
  background: var(--color-neutral-100);
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: 600;
}

.skill-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-neutral-800);
}

.skill-desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-neutral-600);
}

.empty-state {
  padding: 64px 24px;
  text-align: center;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-neutral-800);
}

.empty-desc {
  margin-top: 6px;
  font-size: 13px;
  color: var(--color-neutral-500);
}

.text-cost-1 { color: #6b7280; }
.text-cost-2 { color: #16a34a; }
.text-cost-3 { color: #2563eb; }
.text-cost-4 { color: #9333ea; }
.text-cost-5 { color: #d97706; }

@media (max-width: 900px) {
  .card-body {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
