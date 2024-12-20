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
  height: em(72);
  display: flex;
  align-items: center;
  position: relative;
  background: #410C72;

  border-radius: em(10);
  border: em(1) solid transparent;
  &:focus-within {
    border: em(1) solid #ffffff;
  }
}
.fieldInvalid {
  border: em(1) solid #ff3333;
}
.error {
  bottom: em(-9);
  right: em(10);
  border-radius: em(10);
  padding: em(2) em(10);
  @include text(#fff, 1.05em, 400, 1em);
  position: absolute;
  background: #ff3333;
  z-index: 1;
}
</style>
