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
  height: em(56);
  display: flex;
  align-items: center;
  position: relative;

  border-radius: em(12);
  border: em(1) solid #ffffff90;
  &:focus-within {
    border: em(1) solid #ffffff;
  }
}
.fieldInvalid {
  border: em(1) solid #ff3333;
}
.error {
  bottom: em(-5);
  right: em(15);
  border-radius: em(10);
  padding: em(2) em(10);
  @include text(#fff, .90em, 400, .90em);
  position: absolute;
  background: #ff3333;
  z-index: 1;
  //background: #ff3333;
  //top: calc(100% + 2px);
  //right: 0;
  //padding: 8px;
  //border-radius: 4px;
  //color: white;
  //font-weight: 500;
  //font-size: 10px;
  // &:before {
  //   content: '';
  //   display: block;
  //   position: absolute;
  //   top: -2px;
  //   left: 7px;
  //   width: 0;
  //   height: 0;
  //   border-style: solid;
  //   border-width: 0 3px 7px 3px;
  //   border-color: transparent transparent #fd4646 transparent;
  // }
}
</style>
