<template>
  <div>
    <AppHeader />
    <main class="main">
      <div class="page-container">
        <NuxtPage class="page-transition-wrapper" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.main {
  margin-top: 60px;
  background: var(--bg-base);
  min-height: 100vh;
}

.page-container {
  position: relative;
}

.page-transition-wrapper {
  opacity: 1;
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.page-transition-wrapper.leave-active,
.page-transition-wrapper.enter-active {
  transition: all 0.35s ease;
}

.page-transition-wrapper.leave-to,
.page-transition-wrapper.enter-from {
  opacity: 0;
  transform: translateY(8px);
}
</style>
