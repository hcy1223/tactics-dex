<template>
  <div class="page-placeholder">
    <h1>{{ title }}</h1>
    <p>页面建设中...</p>
  </div>
</template>

<script setup lang="ts">
const title = computed(() => {
  const titles: Record<string, string> = {
    units: '英雄图鉴',
    traits: '羁绊图鉴',
    items: '装备图鉴',
    augments: '强化符文',
    other: '其他',
  }
  const route = useRoute()
  return titles[route.name as string] || ''
})
</script>

<style scoped>
.page-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px - 48px);
}

h1 {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 12px;
}

p {
  font-size: 16px;
  color: var(--color-neutral-500);
}
</style>
