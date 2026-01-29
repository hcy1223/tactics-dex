<template>
  <div class="home">
    <h1>TFT Dex</h1>
    <p>选择上方的标签开始浏览</p>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px - 48px);
  color: var(--color-neutral-700);
}

h1 {
  font-size: 36px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 16px;
}

p {
  font-size: 16px;
  color: var(--color-neutral-500);
}
</style>
