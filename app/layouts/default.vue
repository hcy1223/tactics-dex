<template>
  <div>
    <AppHeader />
    <main class="main">
      <div class="page-container">
        <slot />
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
</style>
