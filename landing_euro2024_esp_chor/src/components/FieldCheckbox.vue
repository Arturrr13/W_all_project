<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { computed } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean | string | number;
    invalid?: boolean;
    onValue?: boolean | string | number;
    offValue?: boolean | string | number;
  }>(),
  {
    invalid: false,
    onValue: true,
    offValue: false,
  }
);
const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'blur', val: FocusEvent): void;
}>();
const value = useVModel(props, 'modelValue', emit);
const checked = computed(() => props.modelValue === props.onValue);
const onChange = () => {
  value.value = checked.value ? props.offValue : props.onValue;
};
</script>

<template>
  <label
    class="checkbox"
    :class="{ invalid: invalid }"
  >
    <input
      class="checkboxInput"
      type="checkbox"
      name="terms"
      :checked="checked"
      :value="value"
      @change="onChange"
      @blur="emit('blur', $event)"
    />
    <SvgIcon
      class="checkboxMark"
      name="checkbox-mark"
    />
  </label>
</template>

<style lang="scss" scoped>
.checkbox {
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  border: 1px solid #999999;
  border-radius: 2px;
}
.invalid {
  border-color: #fd4646;
}
.checkboxInput {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkboxMark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 200ms ease;
  width: 11px;
  height: 9px;
  color: #1976d2;
}
.checkboxInput:checked + .checkboxMark {
  opacity: 1;
}
</style>
