<script setup>
import { getRedirectLink } from '@/lib'
import { useHead } from '@vueuse/head'
import { getLanguagePartFromCode } from '@/utils'
import { useTranslation } from '@/composition/useTranslation'
import Calculator from '@/components/Calculator.vue'
import { ref } from 'vue'

const { t, i18next } = useTranslation('common');
useHead({
  htmlAttrs: () => ({
    lang: getLanguagePartFromCode(i18next.language),
  }),
  title: t('WEISS'),
})

const redirectLink = getRedirectLink() || undefined

const data = ref()

fetch(new URL(`/json/main.json`, import.meta.url).href)
    .then(response => response.json())
    .then(e => data.value = e)

const parallax = (e) => {
	document.querySelectorAll('.parallaxEl').forEach(el => {
		if(window.innerWidth > 1024){
			const speed = el.getAttribute('data-speed')
			const x = (window.innerWidth - e.pageX * speed) / 100
			const y = (window.innerHeight - e.pageY * speed) / 100
			el.style.transform = `translateX(${x}px) translateY(${y}px)`
		} else {
			el.style.transform = `translateX(0) translateY(0)`
		}
	})
}
</script>

<template>
  <div class="wrap" v-if="data" @mousemove="parallax">
		<div class="content">
			<div class="logo">
				<img src="/img/logo.png" alt="weiss">
			</div>
	
			<calculator :data="data"/>
	
			<div class="resp__block">
				<div class="resp__block--top">
					<div class="resp__block--clLogo">
            			<img src="/img/liga.png" alt="uefa">
					</div>
	
					<p class="resp__block--date">
						{{ data.date }}
					</p>
				</div>
	
				<div class="resp__block--gameInfo">
					<p>
						{{ data.t3F }}
						<span class="green">
							{{ data.t3G }}
						</span>
					</p>
				</div>
			</div>
	
      <div class="btn__wr mainBtn">
        <a type="button" :href="redirectLink">
          {{ data.btnGB }}
        </a>
      </div>
		</div>

		<div class="teams">
			<div class="teams--left teams--style parallaxEl" data-speed="1">
        		<img src="/img/team1.png" alt="uefa">
			</div>
			<div class="teams--right teams--style parallaxEl" data-speed="-1">
        		<img src="/img/team2.png" alt="uefa">
			</div>
		</div>

		<div class="characters">
			<div class="characters--left parallaxEl" data-speed="-2">
        		<img src="/img/p1.png" alt="uefa">
			</div>
			<div class="characters--right parallaxEl" data-speed="-2">
        		<img src="/img/p2.png" alt="uefa">
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.wrap{
    height: 100dvh;
    width: 100%;
	position: relative;
	@include flex(false, false, center, false);
	overflow: hidden;
}

.content{
	position: relative;
    z-index: 1;
}

.teams{
	position: absolute;
	@include flex(false, center, space-between, false);
	width: em(1380);
	top: em(200);
	&--style{
		width: em(360);
		border: em(1) solid rgba(255, 255, 255, 0.10);
		box-shadow: 0 em(20) em(40) 0 rgba(4, 17, 61, 0.50);
		background: rgba(12, 78, 229, 0.70);
		backdrop-filter: blur(em(5));
		border-radius: 50%;
		padding: em(45);
	}
}

.characters{
	position: absolute;
	@include flex(false, center, space-between, false);
	width: em(1470);
	bottom: em(-6);
	transform: translateX(em(20));
	&--left{
		width: em(730);
	}
	&--right{
		width: em(730);
	}
}

.logo{
	width: em(260);
	padding: em(40) 0;
	margin: 0 auto;
}

.resp__block{
	@include flex(column, center, false, em(40));
	padding-bottom: em(36);
	&--clLogo{
		width: em(180);
		padding: em(40) 0;
	}

	&--date{
		@include text(#fff, 1.5em, 500, 130%);
	}

	&--gameInfo{
		max-width: em(370);
		border-radius: em(16);
		background: rgba(0, 16, 71, 0.60);
		padding: em(20) em(40) em(24) em(40);
		p{
			@include text(#fff, 1.75em, 400, 130%);
		}
	}
}
</style>
