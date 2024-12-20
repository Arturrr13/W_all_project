<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ name: string; color?: string }>();
const symbolId = computed(() => `#icon-${props.name.replace(/\//g, '-')}`);
</script>

<template>
  <svg aria-hidden="true">
    <use
      :href="symbolId"
      :fill="color"
    />
  </svg>
</template>

<style lang="scss" module></style>
