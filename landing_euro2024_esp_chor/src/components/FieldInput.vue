<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { ref } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';
import FieldCommon from '@/components/FieldCommon.vue';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    icon?: string;
    type?: string;
    placeholder?: string;
    name: string;
    error?: string;
  }>(),
  {
    type: 'text',
  }
);
const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'blur', val: FocusEvent): void;
}>();
const inputRef = ref<HTMLInputElement | null>(null);
const value = useVModel(props, 'modelValue', emit);
</script>

<template>
  <FieldCommon
    :name="name"
    :error="error"
    @click="inputRef?.focus()"
  >
    <SvgIcon
      v-if="icon"
      class="icon"
      :name="icon"
    />
    <input
      ref="inputRef"
      class="input"
      :type="type"
      :placeholder="placeholder"
      :name="name"
      v-model="value"
      @blur="emit('blur', $event)"
    />
  </FieldCommon>
</template>

<style lang="scss" scoped>
.icon {
  width: 16px;
  height: 16px;
  margin-left: 16px;
  flex-shrink: 0;
}
.input {
  color-scheme: dark;
  width: 100%;
  max-width: none;
  min-width: 0;
  border: none;
  background: transparent;
  margin-left: 8px;
  color: #000000dd;
  &:focus-visible {
    outline: none;
  }
}
</style>
