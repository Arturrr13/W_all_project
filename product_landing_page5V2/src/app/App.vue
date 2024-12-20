<!-- <script setup lang="ts">
import LandPage from '@/components/LandPage.vue';
import { useLangDebug } from '@/composition/useLangDebug';
useLangDebug();
</script> -->

<script setup>
import Hero from '@/components/sections/Hero.vue'
import UGames from '@/components/sections/UGames.vue'
import Token from '@/components/sections/Token.vue'
import Vip from '@/components/sections/Vip.vue'
import Prizes from '@/components/sections/Prizes.vue'
import FooterCom from '@/components/sections/Footer.vue'
import PopUp from '@/components/PopUp.vue'
import RegistrationForm from '@/components/RegistrationForm.vue'

import { getLanguagePartFromCode } from '@/utils'
import { getRedirectLink, redirectToAuth } from '@/lib'
import { useTranslation } from '@/composition/useTranslation'
import { useLangDebug } from '@/composition/useLangDebug'
import { useHead } from '@vueuse/head'
useLangDebug()

const { t, i18next } = useTranslation('common')

useHead({
  htmlAttrs: () => ({
    lang: getLanguagePartFromCode(i18next.language),
  }),
  title: t('WEISS'),
})

// i18next.changeLanguage('pt')

import Lenis from 'lenis'

import { ref, onMounted } from 'vue'

onMounted(() => {
  // smooth scroll
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
})

const popUpStatus = ref(false)
const activePopUp = () => {
  popUpStatus.value = true
  document.body.style.overflow = 'hidden'
}

const closePopUp = () => {
  popUpStatus.value = false
  document.body.style.overflow = 'auto'
}

const formSubmit = ref(false)

const redirect = () => {
  redirectToAuth(localStorage.getItem('token') ?? '')
  console.log('redirect')
}

const submitForm = () => {
  formSubmit.value = true;
  setTimeout(() => (formSubmit.value = false), 0)
}

const clickSimulate = () => {
  const item = document.querySelector('.final__btn')
  if(item) item.click()
  console.log('clickSimulate')
}
</script>

<template>
	<div class="wrap">
		<hero @registration="() => activePopUp()"/>
		<u-games @registration="() => activePopUp()"/>
		<token @registration="() => activePopUp()"/>
		<vip @registration="() => activePopUp()"/>
		<prizes @registration="() => activePopUp()"/>
		<footer-com />

		<!-- <pop-up :acitve="popUpStatus" @close="popUpStatus = false"/> -->

    <RegistrationForm :acitve="popUpStatus" @close="() => closePopUp()" :formSubmit="formSubmit" @formSuccess="clickSimulate"/>

    <a href="" class="final__btn" @click.prevent="redirect"></a>
	</div>
</template>

<style scoped>
.wrap{
	overflow: hidden;
}

.final__btn{
  opacity: 0;
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
