<template>
  <div class="units-page">
    <h1 class="page-title">
      英雄图鉴
    </h1>
    <p class="page-subtitle">
      {{ totalUnits }} 位英雄
    </p>

    <div class="units-grid">
      <UnitCard
        v-for="unit in units"
        :key="unit.id"
        :unit="unit"
      />
    </div>

    <!-- 加载触发器 - 用于无限滚动 -->
    <div
      v-if="hasMore"
      ref="loadTrigger"
      class="load-trigger"
    >
      <div class="loading-indicator">
        <div class="loading-spinner" />
        <span>加载中...</span>
      </div>
    </div>

    <!-- 已加载完毕提示 -->
    <div
      v-else
      class="end-message"
    >
      <span>已展示所有英雄</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
useHead({
  title: '英雄图鉴 - TFT Dex',
})

const { units, loadMore, hasMore, total } = useUnits()
const totalUnits = computed(() => total)

// 无限滚动 - 使用 IntersectionObserver
const loadTrigger = ref<HTMLElement | null>(null)

onMounted(() => {
  // 初始加载
  loadMore()

  // 设置 IntersectionObserver
  if (loadTrigger.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore.value) {
            loadMore()
          }
        })
      },
      {
        rootMargin: '200px', // 提前200px开始加载
        threshold: 0,
      },
    )

    observer.observe(loadTrigger.value)

    // 清理
    onUnmounted(() => {
      observer.disconnect()
    })
  }
})
</script>

<style scoped>
.units-page {
  max-width: 840px;
  margin: 0 auto;
  padding: 32px 24px;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin: 0 0 12px 0;
}

.page-subtitle {
  font-size: 16px;
  color: var(--color-neutral-500);
  margin: 0 0 32px 0;
}

.units-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .units-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .units-grid {
    grid-template-columns: 1fr;
  }
}

.load-trigger {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-neutral-500);
  font-size: 14px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-neutral-200);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.end-message {
  display: flex;
  justify-content: center;
  padding: 40px 0;
  color: var(--color-neutral-400);
  font-size: 14px;
}
</style>
