<script setup lang="ts">
defineProps<{
  name: string;
  error?: string;
}>();
</script>

<template>
  <div
    class="field"
    :class="{
      fieldInvalid: !!error,
    }"
  >
    <slot />
    <label
      class="error"
      v-if="error"
      :for="name"
      >{{ error }}</label
    >
  </div>
</template>

<style lang="scss" scoped>
.field {
  height: 40px;
  display: flex;
  align-items: center;
  position: relative;

  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.23);
  &:focus-within {
    border-color: #1976d2;
    border-width: 2px;
  }
}
.fieldInvalid {
  border-color: #fd4646;
  border-width: 2px;
}
.error {
  position: absolute;
  top: calc(100% + 2px);
  right: 0;
  padding: 8px;
  border-radius: 4px;
  background: #fd4646;
  color: white;
  font-weight: 500;
  font-size: 10px;
  z-index: 1;
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: -2px;
    left: 7px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 3px 7px 3px;
    border-color: transparent transparent #fd4646 transparent;
  }
}
</style>
