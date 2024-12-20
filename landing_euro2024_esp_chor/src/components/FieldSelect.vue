<script setup lang="ts">
import FieldCommon from '@/components/FieldCommon.vue';
import { useVModel } from '@vueuse/core';
import { vOnClickOutside } from '@vueuse/components';
import { computed, ref } from 'vue';
import { useFloating } from '@floating-ui/vue';

const props = defineProps<{
  modelValue: string;
  name: string;
  error?: string;
  options: Array<Record<string, any>>;
  valueKey: string;
  labelKey?: string;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'blur', val: FocusEvent): void;
}>();
const inputRef = ref<HTMLInputElement | null>(null);
const value = useVModel(props, 'modelValue', emit);

const menu = ref(false);

const handleCloseMenu = () => {
  menu.value = false;
};
const onFieldClick = () => {
  inputRef.value?.focus();
  menu.value = !menu.value;
};

const selectedItem = computed(() =>
  props.options.find((item) => item[props.valueKey] === value.value)
);

const reference = ref(null);
const floating = ref(null);
const { x, y, strategy } = useFloating(reference, floating, {
  placement: 'bottom-end',
});
</script>

<template>
  <FieldCommon
    ref="reference"
    :name="name"
    :error="error"
    class="field"
    @click="onFieldClick"
  >
    <div>
      <slot
        name="selected"
        v-if="selectedItem"
        :item="selectedItem"
      >
        {{
          String((labelKey && selectedItem[labelKey]) || selectedItem[valueKey])
        }}
      </slot>
    </div>
    <span class="dropdownArrow">{{ menu ? '▲' : '▼' }}</span>
    <input
      class="input"
      type="text"
      readonly
      v-model="value"
      @blur="emit('blur', $event)"
    />
    <ul
      ref="floating"
      class="dropdown"
      v-on-click-outside="handleCloseMenu"
      v-if="menu"
      :style="{
        position: strategy,
        top: `${y ?? 0}px`,
        left: `${x ?? 0}px`,
        width: 'max-content',
      }"
    >
      <li
        class="item"
        :class="{
          selectedItem: value === item[valueKey],
        }"
        v-for="item in options"
        :key="String(item[valueKey])"
        @click="value = item[valueKey]"
      >
        <slot
          name="label"
          :item="item"
        >
          {{ (labelKey && String(item[labelKey])) || item[valueKey] }}
        </slot>
      </li>
    </ul>
  </FieldCommon>
</template>

<style lang="scss" scoped>
.field {
  padding: 0 8px;
}
.input {
  align-self: flex-start;
  opacity: 0;
  flex: 0 0;
  position: absolute;
  width: 100%;
  pointer-events: none;
}
.dropdownArrow {
  transform: scaleY(0.5);
  display: inline-block;
  color: #666;
  margin-left: 4px;
}
.dropdown {
  z-index: 1;
  padding: 0;
  text-align: left;
  list-style: none;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;

  max-width: 296px;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: #353535;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #999999;
  }
  &::-webkit-scrollbar-corner,
  &::-webkit-scrollbar-track {
    background-color: #e7ebf0;
  }
}
.item {
  cursor: pointer;
  padding: 4px 15px;
  &:hover {
    background-color: #f3f3f3;
  }
}
.dropdown:not(:hover) .selectedItem {
  background-color: #f3f3f3;
}
</style>
