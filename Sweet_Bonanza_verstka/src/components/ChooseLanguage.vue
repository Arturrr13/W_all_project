<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTranslation } from '@/composition/useTranslation';
import FieldSelect from '@/components/FieldSelect.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { getCountryCodeFromLanguage, getLanguagePartFromCode } from '@/utils';

const { i18next } = useTranslation('common');

const selected = ref(getLanguagePartFromCode(i18next.language));
watch(selected, (ln) => {
  i18next.changeLanguage(ln);
});

const languages = [
  {
    value: 'cs',
    label: 'Czech',
  },
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'hu',
    label: 'Hungarian',
  },
  {
    value: 'lt',
    label: 'Lithuanian',
  },
  {
    value: 'lv',
    label: 'Latvian',
  },
  {
    value: 'pt',
    label: 'Portuguese',
  },
  {
    value: 'ru',
    label: 'Russian',
  },
  {
    value: 'sk',
    label: 'Slovak',
  },
];
</script>

<template>
  <FieldSelect
    name="lang"
    v-model="selected"
    :options="languages"
    value-key="value"
  >
    <template #label="{ item }">
      <div class="itemLabel">
        <SvgIcon
          class="flagIcon"
          :name="`flag/${getCountryCodeFromLanguage(item.value)}`"
        />
        <span>{{ item.label }}</span>
      </div>
    </template>
    <template #selected="{ item }">
      <div class="itemLabel">
        <SvgIcon
          class="flagIcon"
          :name="`flag/${getCountryCodeFromLanguage(item.value)}`"
        />
        <span>{{ item.label }}</span>
      </div>
    </template>
  </FieldSelect>
</template>

<style lang="scss" scoped>
.itemLabel {
  display: flex;
  align-items: center;
}
.flagIcon {
  width: 20px;
  height: 14px;
  margin-right: 4px;
}
</style>
