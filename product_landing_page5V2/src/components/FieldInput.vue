<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { ref } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';
import FieldCommon from '@/components/FieldCommon.vue';
import { useTranslation } from '@/composition/useTranslation'
const { t, i18next } = useTranslation('common')

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
	<div class="input">
		<!-- <div class="input__label" :class="{ error: error }">
			<span v-if="type === 'email'">
        {{ t('form.email') }}
			</span>
			<span v-else>
        {{ t('form.password') }}
			</span>
		</div> -->

		<FieldCommon :name="name" :error="error" @click="inputRef?.focus()">
			<SvgIcon v-if="icon" class="icon input__wrapper--leftIcon" :name="icon" />
			<input ref="inputRef" class="input" :type="type" :placeholder="placeholder" :name="name" v-model="value"
				@blur="emit('blur', $event)" />
		</FieldCommon>
	</div>
</template>

<style lang="scss" scoped>
.input{
    &__label{
        padding-bottom: em(10);
        &.error{
            color: #ff3333;
        }
    }
}

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
	width: em(16);
	height: em(16);
	margin: 0 em(16);
	flex-shrink: 0;
}

input.input {
	color-scheme: dark;
	width: 100%;
	max-width: none;
	min-width: 0;
	border: none;
	background: transparent;
  font: inherit;
	@include text(#fff, em(18), 400, 125%);

	&:focus-visible {
		outline: none;
	}
}

// input[type=password],
// input[type=email],
// input[type=text]{
//     // padding: em(12) em(12) em(12) em(45);
//     // border: em(1) solid #ffffff90;
//     // border-radius: em(12);
//     // background: transparent;
//     font-size: em(18);
//     line-height: 125%;
//     color: #ffffff;
//     // width: 100%;
//     &:focus{
//         border: em(1) solid #ffffff;
//     }
// }

// 	&:focus-visible {
//  		outline: none;
//  	}
// }
</style>
