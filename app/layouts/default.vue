<template>
  <div>
    <Header />
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.main {
  margin-top: 60px;
  padding: 24px;
  background: var(--bg-base);
  min-height: 100vh;
}
</style>
