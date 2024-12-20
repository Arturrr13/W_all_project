<script setup>
import { onMounted, ref } from 'vue'
import RegistrationForm from '@/components/RegistrationForm.vue'
import PopUp from '@/components/PopUp.vue'
import { useHead } from '@vueuse/head'
import { getLanguagePartFromCode } from '@/utils'
import { useTranslation } from '@/composition/useTranslation'
import {getRedirectLink} from '@/lib'
import {createDomainLinkSafe} from '@/lib'

//?popup=register-completion&type=credentials
const loginRedirect = createDomainLinkSafe('/?popup=regform')

const { t, i18next } = useTranslation('common')

// i18next.changeLanguage('pt')

useHead({
	htmlAttrs: () => ({
		lang: getLanguagePartFromCode(i18next.language),
	}),
	title: t('WEISS'),
})

const wheelArr = ref(['wheel.cashback', 'wheel.usdt', 'wheel.bonus', 'wheel.fs', 'wheel.doge', 'wheel.tr', 'wheel.btc', 'wheel.bonus2', 'wheel.fs2', 'wheel.trx'])

const lang =  ref(getLanguagePartFromCode(i18next.language))

const wheel = ref(),
	rotate = ref(0),
	lastSpin = ref(0),
	spin = ref(0),
	rndComb = ref([]),
	fsText = ref(0),
	bonusText = ref(0),
	popUpStatus = ref(false),
	disable = ref(false)

while(rndComb.value.length < 3){ 
	let rndInt = Math.floor(Math.random() * 3) + 1
	!rndComb.value.includes(rndInt) ? rndComb.value.push(rndInt) : null
}

onMounted(() => {
	wheel.value = document.querySelector('.body__wheel--bg')

	if(localStorage.data){
		const data = JSON.parse(localStorage.data)
		bonusText.value = data.bonus
		fsText.value = data.fs
		spin.value = data.spin
		lastSpin.value = data.lastSpin
		rndComb.value = data.rndComb
		rotate.value = data.rotate

		wheel.value.style.transform = `rotate(${rotate.value}deg)`

		spin.value > 0 ? document.querySelector('.body__uWin--bonusTx').classList.add('active') : null
		spin.value == 3 ? popUpStatus.value = true : null

		setTimeout(() => lang.value = getLanguagePartFromCode(i18next.language), 500)
	}
})

const spinWheel = () => {
	if(!disable.value){
		disable.value = true
		lang.value = getLanguagePartFromCode(i18next.language)

		let newValue = 720 - lastSpin.value % 720
		rndComb.value[spin.value] == 1 ? rotate.value += newValue + 35
		: rndComb.value[spin.value] == 2 ? rotate.value += newValue + 180 
		: rotate.value += newValue + 216 
	
		const center = document.querySelector('.body__wheel--center')
		const overflow = document.querySelector('.overflow')
		const bonusTx = document.querySelector('.body__uWin--bonusTx')
		center.style.animation = 'none'
		overflow.style.animation = 'none'

		wheel.value.animate([
		  	{ transform: `rotate(${lastSpin.value}deg)`},
		  	{ transform: `rotate(${rotate.value}deg)`},
		], {
		  	duration: 3000,
		  	fill: 'both',
		  	easing: 'ease-in-out'
		})
	
		setTimeout(() => {
			rndComb.value[spin.value] == 1 ? bonusText.value += 100
			: rndComb.value[spin.value] == 2 ? fsText.value += 200
			: bonusText.value += 200
			
			bonusTx.classList.remove('active')
			setTimeout(() => bonusTx.classList.add('active'), 100)

			lastSpin.value = rotate.value
			spin.value++
			spin.value < 4 ? disable.value = false : true
	
			localStorage.data = JSON.stringify({
				bonus: bonusText.value,
				fs: fsText.value,
				spin: spin.value,
				lastSpin: lastSpin.value,
				rndComb: rndComb.value,
				rotate: rotate.value
			})
		}, 3000)

		setTimeout(() => {
			center.style.animation = 'centerAnim 1.5s ease-in-out infinite alternate'
			overflow.style.animation = 'wheelAnim 3s ease-in-out infinite alternate'
			spin.value == 3 ? popUpStatus.value = true : null
		}, 4500)
	}
}
</script>

<template>
	<div class="body-wrap">
		<div class="body">
			<div class="body__header">
				<div class="body__header--logo">
					<img src="/img/logo.png" alt="WEISS">
				</div>

				<div class="body__header--singUp">
					<a :href="loginRedirect" aria-label="sing up" title="sing up" rel="nofollow" target="_blank">
						{{ t('banner.SignUp') }}
					</a>
				</div>
			</div>

			<div class="body__uWin">
				<span :class="{ opacity: fsText || bonusText }" class="body__uWin--mainTx">
					{{ t('banner.uWin') }}
				</span>
				<div class="body__uWin--bonusTx">
					<p class="uWinT">
						{{ t('banner.uWinT') }}
					</p>
					<p class="bonusT body__uWin--mainTx" v-if="bonusText">
						<span v-if="lang === 'pt'">
							{{ t('banner.bonus') }} {{ bonusText }}%
						</span>
						<span v-else>
							{{ bonusText }}% {{ t('banner.bonus') }}
						</span>
					</p>
					<p class="fsT" v-if="fsText">
						+ {{ fsText + t('banner.fs') }}
					</p>
				</div>
			</div>

			<div class="body__wheel">
				<div class="overflow">
					<div class="body__wheel--bg">
						<div class="wheel">
							<div id="inner-wheel">
								<div v-for="(item, index) in wheelArr" :key="index" class="sec" :style="`--i: ${index + 1}`">
									<p class="fa" :class="{ cashback: item === 'wheel.cashback' }">{{ t(`${item}`) }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="body__wheel--center" @click="spin < 3 ? spinWheel() : null">
					<div>
						<p v-if="spin < 1">
							{{ t('banner.center') }}
						</p>
						<p class="spinAgain" :class="{ active: spin > 0 }">
							{{ t('banner.spinAgain') }}
						</p>
					</div>
				</div>

				<div class="body__wheel--lights">
					<img src="/img/wheel/lights.png" alt="wheel">
				</div>

				<div class="body__wheel--arr">
					<img src="/img/wheel/arr.png" alt="wheel">
					<img class="light1" src="/img/wheel/light1.png" alt="lights">
					<img class="light2" src="/img/wheel/light2.png" alt="lights">
					<img class="light3" src="/img/wheel/light2.png" alt="lights">
					<img class="light4" src="/img/wheel/light3.png" alt="lights">
				</div>

				<div class="body__wheel--g1">
					<img src="/img/wheel/g1.png" alt="wheel">
				</div>

				<div class="body__wheel--g2">
					<img src="/img/wheel/g2.png" alt="wheel">
				</div>
			</div>

			<!-- <div class="body__candy">
				<div 
					class="body__candy--el" 
					v-for="index in 3" :key="index"
					:class="{ opacity: spin >= index, active: spin == index - 1 }"
				>
					<img src="/img/candy.png" alt="candy">
				</div>
			</div> -->
		</div>

		<!-- <registration-form :acitve="popUpStatus" @close="popUpStatus = false"/> -->
		<pop-up :acitve="popUpStatus" @close="popUpStatus = false"/>
	</div>
</template>

<style lang="scss" scoped>
.body{
	padding-top: em(50);
}

.body__header{
	@include flex(false, center, space-between, false);
	padding: 0 em(84);
	position: absolute;
    width: 100%;

	&--logo{
		width: em(230);
	}

	&--singUp{
		border-radius: em(16);
		background: #FFF;
		width: fit-content;
		@include flex(false, center, center, false);
		border: em(1) solid transparent;
		transition: all .25s ease-in-out;
		a{
			@include text(#34414D, em(18), 400, 133%);
			padding: em(14) em(21);
		}

		&:hover{
			box-shadow: 0 0 em(30) 0 #fff;
		}
	}
}

.body__uWin{
	background-image: url(/img/BG/uWin.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
	width: fit-content;
	padding: 0 em(130);
	height: em(140);
	@include flex(false, center, center, false);
	margin: 0 auto;
	text-align: center;

	&--mainTx{
		@include text(#FFF743, em(50), 400, 1em);
		text-shadow: 0 em(2) em(5) rgba(0, 0, 0, 0.25);
		font-family: "Titan One";
		text-transform: uppercase;

		&.opacity{
			opacity: 0;
		}
	}

	&--bonusTx{
		opacity: 0;
		position: absolute;
		&.active{
			animation: textAnim 1s ease-in-out both;
		}
		
		.uWinT{
			@include text(#ffffff, em(22), 500, 1em);
			text-transform: uppercase;
		}
		.fsT{
			@include text(#55FD52, em(28), 400, 1em);
			text-shadow: 0 em(2) em(5) rgba(0, 0, 0, 0.25);
			font-family: "Titan One";
			text-transform: uppercase;
		}
	}
}

.overflow{
	overflow: hidden;
	animation: wheelAnim 3s ease-in-out infinite alternate;
	z-index: 1;
}

.body__wheel{
	position: relative;
	width: fit-content;
    margin: 0 auto;
	padding-top: em(20);
	@include flex(false, center, center, false);
	animation: visAnim 1s ease-in-out;

	&--center, &--arr, &--lights, &--g1, &--g2{
		position: absolute;
	}

	&--bg{
		width: em(800);
		height: em(800);
		background-image: url(/img/wheel/bg.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		// animation: wheelAnim 3s ease-in-out infinite alternate;
	}

	&--center{
		width: em(180);
		height: em(180);
		background: url(/img/wheel/center.png) no-repeat;
    	background-size: 100% 100%;
		text-align: center;
		z-index: 2;
		@include flex(false, center, center, false);
		animation: centerAnim 1.5s ease-in-out infinite alternate;
		
		&:hover{
			cursor: pointer;
			animation-play-state: paused;
		}

		p{
			transition: all .35s ease-in-out;
			@include text(#ffffff, em(32), 400, 1em);
			text-shadow: em(-1.5) 0 #FF21E2, 0 em(1.5) #FF21E2, em(1.5) 0 #FF21E2, 0 em(-1.5) #FF21E2;
			font-family: "Titan One";
			text-transform: uppercase;
			word-break: break-word;
		}

		div{
			width: 85%;
		}

		.spinAgain{
			opacity: 0;
			position: absolute;
			transition: all .75s ease-in-out;
			&.active{
				opacity: 1;
				position: static;
			}
		}
	}

	&--lights{
		width: 91%;
		animation: lightAnim .45s ease-in-out infinite alternate;
		z-index: 1;
	}

	&--arr{
		width: em(400);
    	right: em(-15);
    	transform: translateY(em(-13)) rotate(1deg);
		z-index: 1;

		.light1, .light2, .light3, .light4{
			position: absolute;
			animation: lightAnim .45s ease-in-out infinite alternate;
		}

		.light1{
			width: auto;
    		right: em(15);
    		transform: rotate(3deg);
		}

		.light2{
			height: auto;
			right: em(60);
    		top: em(1);
    		width: em(290);
		}

		.light3{
			height: auto;
			width: em(290);
    		right: em(50);
    		bottom: em(-10);
    		transform: rotate(37deg);
		}

		.light4{
			width: em(100);
			right: em(-10);
		}
	}

	&--g1{
		width: 170%;
    	transform: translateY(-3%);
	}

	&--g2{
		width: 95%;
		bottom: -10%;
	}
}

.body__candy{
	@include flex(false, center, center, em(20));
	padding-top: em(10);
	animation: candyIdleAnim 2s ease-in-out infinite alternate;

	&--el{
		width: em(90);

		&.opacity{
			animation: candyAnim 1s ease-in-out both;
		}

		&.active{
			animation: candyActiveAnim 2s ease-in-out infinite alternate;
		}
	}
}

.wheel {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
    justify-content: center;
    align-items: center;
	transform: rotate(-10.5deg);
}

#inner-wheel {
	width: 100%;
	height: 100%;
	position: absolute;
    top: 0;
    left: 0;
}

.sec {
	position: absolute;
    width: 50%;
    height: 50%;
    background: transparent;
    transform-origin: bottom right;
    transform: rotate(calc(36deg * var(--i)));
    display: flex;
    justify-content: center;
    align-items: center;
}

.fa {
	transform: rotate(-133deg);
	@include text(#4D1585, em(24), 700, 1em);
	text-transform: uppercase;
	width: 100%;
	padding: 0 57% 0 6%;
    word-break: break-word;
	text-align: center;
}

.cashback{
	@include text(#4D1585, em(22), 700, 1em);
	padding: 0 56% 0 4%;
}

.sec:nth-child(even){
	p{
		color: #ffffff;
	}
}

@keyframes visAnim {
    0% {
        opacity: 0; scale: .1;
    }
    100% {
        opacity: 1; scale: 1;
    }
}

@keyframes lightAnim {
    0% {
        filter: contrast(.5);
    }
    100% {
        filter: contrast(1);
    }
}

@keyframes candyActiveAnim {
    0% {
        filter: drop-shadow(0 0 0 #FF21E2); scale: 1;
    }
    100% {
        filter: drop-shadow(0 0 em(14) #FF21E2); scale: 1.1;
    }
}

@keyframes textAnim {
    0% {
        scale: .5; opacity: 0;
    }
    100% {
        scale: 1; opacity: 1;
    }
}

@keyframes candyAnim {
    0% {
        scale: 1;
    }
	50% {
        scale: 1.1; opacity: 1;
    }
    100% {
        scale: 1; opacity: 0;
    }
}

@keyframes candyIdleAnim {
    0% {
        transform: translateY(em(-10));
    }
    100% {
        transform: translateY(0);
    }
}
</style>
