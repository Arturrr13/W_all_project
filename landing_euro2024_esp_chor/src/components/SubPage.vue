<script setup lang="ts">
import MainLayout from '@/components/MainLayout.vue';
import { useTranslation } from '@/composition/useTranslation';

const { t } = useTranslation('common');
</script>

<template>
  <MainLayout>
    {{ t('lorem') }}
  </MainLayout>
</template>

<style lang="scss" scoped></style>
