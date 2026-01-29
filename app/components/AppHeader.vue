<template>
  <header class="header">
    <div class="logo">
      TFT Dex
    </div>

    <nav class="tabs">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="tab"
        :class="{ active: isActive(tab.path) }"
      >
        {{ tab.label }}
      </NuxtLink>
    </nav>

    <div class="right-spacer" />
  </header>
</template>

<script setup lang="ts">
interface Tab {
  path: string
  label: string
}

const tabs: Tab[] = [
  { path: '/units', label: '英雄' },
  { path: '/traits', label: '羁绊' },
  { path: '/items', label: '装备' },
  { path: '/augments', label: '强化符文' },
  { path: '/other', label: '其他' },
]

const route = useRoute()
const isActive = (path: string): boolean => route.path === path
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--color-neutral-200);
  display: flex;
  align-items: center;
  padding: 0 24px;
  z-index: 100;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-accent);
  margin-right: 48px;
}

.tabs {
  display: flex;
  gap: 32px;
}

.tab {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-neutral-600);
  text-decoration: none;
  transition: color 0.2s ease;
}

.tab:hover {
  color: var(--color-accent-hover);
}

.tab.active {
  color: var(--color-accent);
  font-weight: 600;
}

.right-spacer {
  flex: 1;
}
</style>
