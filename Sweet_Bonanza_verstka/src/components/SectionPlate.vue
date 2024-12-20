<script setup lang="ts"></script>

<template>
  <section class="section-wrapper"><slot /></section>
</template>

<style lang="scss" scoped>
.section-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 16px;
  font-weight: 400;
  font-size: 12px;

  background-color: rgb(255, 255, 255);
  color: #000000dd;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  overflow: hidden;
}
</style>
