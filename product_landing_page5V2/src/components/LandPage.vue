<script setup lang="ts">
import MainLayout from '@/components/MainLayout.vue';
import RegistrationForm from '@/components/RegistrationForm.vue';
import { useHead } from '@vueuse/head';
import { getLanguagePartFromCode } from '@/utils';
import { useTranslation } from '@/composition/useTranslation';
import { ref } from 'vue';

const { t, i18next } = useTranslation('common');
useHead({
  htmlAttrs: () => ({
    lang: getLanguagePartFromCode(i18next.language),
  }),
  title: t('title'),
})
</script>

<template>
  <MainLayout class="container">
    <div class="form-wrapper">
      <RegistrationForm class="form"/>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
}
.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.form {
  min-width: 360px;
  width: 480px;
}
</style>
