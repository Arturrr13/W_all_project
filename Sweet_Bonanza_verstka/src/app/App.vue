<script setup lang="ts">
import LandPage from '@/components/LandPage.vue';
import { useLangDebug } from '@/composition/useLangDebug';
import { onMounted } from 'vue';
useLangDebug()

onMounted(() => {
  var myScreenOrientation = window.screen.orientation
  if(myScreenOrientation.lock) myScreenOrientation.lock(myScreenOrientation.type)
  if(myScreenOrientation.lockOrientation) myScreenOrientation.lockOrientation(myScreenOrientation.type)
})
</script>

<template>
  <div class="main">
    <LandPage />
  </div>
</template>

<style scoped lang="scss">
.main{
  height: 100dvh;
	position: relative;
	overflow: hidden;
}
</style>
