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
      class="icon iconResp"
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
.input__wrapper{
    position: relative;
    @include flex(false, center, false, false);

    &--errorText{
        opacity: 0;
        position: absolute;
        bottom: em(-5);
        right: em(15);
        background: #ff3333;
        border-radius: em(10);
        padding: em(2) em(10);
        @include text(#fff, .90em, 400, .90em);
    }
}

.icon {
	width: em(32);
	height: em(32);
	margin: 0 em(10) 0 em(20);
	flex-shrink: 0;
}

.input {
	width: 100%;
	border: none;
	background: transparent;
	@include text(#fff, em(18), 400, 1em);

	&:focus-visible {
		outline: none;
	}

  &::placeholder{
    color: #fff;
  }
}
</style>
