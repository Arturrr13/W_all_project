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

const activeItems = ref(false)

const handleCloseMenu = () => {
  menu.value = false;
  activeItems.value = false
};
const onFieldClick = () => {
  // inputRef.value?.focus();
    menu.value = !menu.value;
    menu.value ? activeItems.value = true : null;
};

const itemClick = (el: any) => {
  activeItems.value = false
  value.value = el
}

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
    :class="{ active: menu }"
    @click="onFieldClick"
    v-on-click-outside="handleCloseMenu"
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
    <div class="dropdownArrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
        <path d="M5.5248 0.525L9.1498 4.15C9.1998 4.2 9.2373 4.25417 9.2623 4.3125C9.2873 4.37083 9.2998 4.43333 9.2998 4.5C9.2998 4.63333 9.25397 4.75 9.1623 4.85C9.07064 4.95 8.9498 5 8.7998 5L1.1998 5C1.0498 5 0.92897 4.95 0.837304 4.85C0.745638 4.75 0.699804 4.63333 0.699804 4.5C0.699804 4.46667 0.749804 4.35 0.849805 4.15L4.4748 0.525C4.55814 0.441666 4.64147 0.383333 4.7248 0.349999C4.80814 0.316666 4.8998 0.3 4.9998 0.3C5.0998 0.3 5.19147 0.316666 5.2748 0.349999C5.35814 0.383333 5.44147 0.441666 5.5248 0.525Z" fill="white"/>
      </svg>
    </div>
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
      
      v-if="menu"
      :style="{
        position: strategy,
        top: `${y ?? 0}px`,
        left: `0`,
      }"
    >
      <li
        class="item"
        :class="{
          selectedItem: value === item[valueKey],
        }"
        v-for="item in options"
        :key="String(item[valueKey])"
        @click="itemClick(item[valueKey])"
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
  padding: em(12) em(16);
  position: absolute;
  width: em(120);
  right: em(10);
  // top: em(60);
  height: max-content;
  transition: all .1s ease-in-out;
  z-index: 5;
  //border-radius: em(12);
  //background: radial-gradient(100% 100% at 50% 0%, #5D5597 0%, #151233 100%) padding-box, radial-gradient(50% 100% at 50% 0%, #3C3663 0%, #221F39 100%) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0.48) 0%, rgba(255, 255, 255, 0.16) 100%) border-box;
  //border: em(1) solid transparent;
  border-radius: em(16);
  border: em(1) solid #403e54;
  background: #1d1a35;

  // &.active {
  //   box-shadow: 0 0 0 em(4) rgba(79, 72, 131, 0.16);
  //   border-color:rgb(79, 72, 131);
  // }

  &:hover {
    cursor: pointer;
    background: #3a384f;
  }
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
  width: em(12);
  height: em(12);
  transition: all .35s ease-in-out;
  transform-origin: 50% 50%;
  transform: rotate(180deg);
  svg{
    width: em(12);
    height: em(12);
    display: block;
  }

  .active &{
    transform: rotate(0deg);
  }
}
.dropdown {
  z-index: 1;
  padding: 0;
  text-align: left;
  list-style: none;
  max-height: em(240);
  overflow-y: auto;
  // border-radius: em(12);
  // box-shadow: 0 0 0 em(4) rgba(79, 72, 131, 0.16);
  // background: radial-gradient(50% 100% at 50% 0%, #4F4883 0%, #302B4F 100%);
  width: em(120);
  border-radius: em(16);
  border: em(1) solid #403e54;
  background: #1d1a35;
  //transform: translateX(em(-4));
  transform: translateY(em(0));

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
  padding: em(12) em(16);
  display: flex;
  justify-content: flex-start;
  &:hover {
    background: #3a384f;
  }
}
.dropdown:not(:hover) .selectedItem {
  background: #3a384f;
}

@media  screen and (max-width:768px){
  .field {
    right: 0;
    top: em(10);
  }
}
</style>
