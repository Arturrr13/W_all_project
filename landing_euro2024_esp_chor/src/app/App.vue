<script setup lang="ts">
import LandPage from '@/components/LandPage.vue';
import { useLangDebug } from '@/composition/useLangDebug';
useLangDebug();
</script>

<template>
  <div class="main">
    <LandPage />
  </div>
</template>

<style scoped>
.main {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
