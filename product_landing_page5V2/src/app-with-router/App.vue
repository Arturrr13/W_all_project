<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import { useHead } from '@vueuse/head';
import { getLanguagePartFromCode } from '@/utils';
import { useLangDebug } from '@/composition/useLangDebug';

useLangDebug();
const { t, i18next } = useTranslation();
useHead({
  htmlAttrs: () => ({
    lang: getLanguagePartFromCode(i18next.language),
  }),
  title: t('title'),
});
</script>

<template>
  <header>
    <nav>
      <ul>
        <li>
          <RouterLink
            class="link"
            active-class="link-active"
            :to="{ name: 'home' }"
            >Main</RouterLink
          >
        </li>
        <li>
          <RouterLink
            class="link"
            active-class="link-active"
            :to="{ name: 'sub' }"
            >Sub</RouterLink
          >
        </li>
      </ul>
    </nav>
  </header>
  <div class="main">
    <RouterView />
  </div>
</template>

<style scoped>
header {
  color: #ffffffa6;
  background: #001529;
  height: 64px;
  line-height: 64px;
  padding: 0 50px;
}
.main {
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
nav ul {
  display: flex;
  margin: 0;
  font-variant: tabular-nums;
  padding: 0;
  font-size: 14px;
  line-height: inherit;
  text-align: left;
  list-style: none;
  outline: none;
}
nav li {
  display: inline-block;
  vertical-align: bottom;
}
.link {
  padding: 0 20px;
  border-bottom: 0;
  color: #fff;
  display: inline-block;
}
.link-active {
  background-color: #1890ff;
}
</style>
