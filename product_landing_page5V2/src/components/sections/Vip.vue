<script setup>
import SvgIcon from '@/components/SvgIcon.vue'
import { useTranslation } from '@/composition/useTranslation'
const { t, i18next } = useTranslation('common')
import { getLanguagePartFromCode } from '@/utils'
import '@splidejs/splide/css/core'
import { Splide } from '@splidejs/splide'
import Player from '../UI/Player.vue'
import { ref, onMounted } from 'vue'

const cards = ref([
    {
        tt: 'Up to 2K USDT',
        tb: 'increased jackpots'
    },
    {
        tt: 'No KYC needed',
        tb: 'for crypto-payments'
    },
    {
        tt: 'A private VIP manager',
        tb: 'available 24/7'
    },
    {
        tt: 'Priority membership',
        tb: 'from 10K USDT deposit'
    },
    {
        tt: 'Individually customized',
        tb: 'VIP rewards system'
    }
])

const emit = defineEmits(['registration'])
const spl = ref(null)
const amount = ref(0)

onMounted(() => {
    new Splide(spl.value, {
        drag: 'free',
        gap: '0.75em',
        trimSpace: false,
        perPage: 1.175,
        focus: 0.075,
        perMove: 1,
        pagination: false,
        arrows: false,
    }).mount()

    let interval
    const value = document.querySelector('.value')

    const intervalFun = () => {
        amount.value += t('main.counter')
        if (amount.value + t('main.counter') > t('main.vipAmount')){
            amount.value = t('main.vipAmount')
            value.classList.add('winAnim')
            clearInterval(interval)

            setTimeout(() => {
                value.classList.remove('winAnim')
                amount.value = 0
                interval = setInterval(intervalFun, 15)
            }, 4500)
        }
    }

    interval = setInterval(intervalFun, 15)
})
</script>

<template>
    <div class="vip section__wrapper">
        <div class="vip__title">
            <div class="vip__title--top">
                <SvgIcon
                    class="titleSvg"
                    :name="`title/vip`"
                />
                <h3 class="t-48">
                    {{ t('main.vip') }}
                </h3>
            </div>
            <div class="vip__title--bot t-24">
                <p>
                    {{ t('main.vipSec') }}
                </p>
            </div>
        </div>

        <div class="vip__maxwin">
            <div class="vip__maxwin--amount">
                <p class="value">
                    {{ amount.toLocaleString() +' '+ t('main.vipCurrency') }}
                </p>
                <p class="MW">
                    MAX WIN
                </p>

                <div v-for="index in 6" :key="index" class="coin" :class="`coin--${index}`">
                    <img :src="`img/sections/vip/coins/${index}.png`" alt="coin">
                </div>
            </div>
        </div>

        <div class="vip__cards">
            <div class="vip__cards--card" v-for="index in 5" :key="index">
                <div class="vip__cards--chip">
                    <img :src="`img/sections/vip/chips/${index}.png`" alt="chip">
                </div>

                <p class="vip__cards--tt t-24 t-24-m">
                    {{ t(`main.vipSlider.${index}.tt`) }}
                </p>

                <p class="t-20">
                    {{ t(`main.vipSlider.${index}.tb`) }}
                </p>
            </div>
        </div>

        <section ref="spl" class="splide splide__vip" aria-label="slider">
            <div class="splide__track">
            	<ul class="splide__list prizes__slide">
            		<li 
                        class="splide__slide vip__cards--card" 
                        v-for="index in 5" :key="index"
                    >
                        <div class="vip__cards--chip">
                            <img :src="`img/sections/vip/chips/${index}.png`" alt="chip">
                        </div>
                    
                        <p class="vip__cards--tt t-24 t-24-m">
                            {{ t(`main.vipSlider.${index}.tt`) }}
                        </p>
                    
                        <p class="t-20">
                            {{ t(`main.vipSlider.${index}.tb`) }}
                        </p>
                    </li>
            	</ul>
            </div>
        </section>
        <div class="uGame__btn btn">
            <a aria-label="button" title="VIP" rel="nofollow" @click="$emit('registration')">
                <img class="uGame__btn--img" :src="`img/sections/uGames/btn.png`" alt="btn">

                {{ t('main.vipBtn') }}
            </a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.titleSvg{
    width: em(40);
    height: em(40);
}

.vip{
    @include flex(column, false, false, em(40));

    &__title{
        @include flex(column, center, center, em(10));

        &--top{
            @include flex(false, center, center, em(10));
            padding-bottom: em(20);
        }
    }

    &__maxwin{
        border-radius: em(180);
        border: em(2) solid #bcb2ff42;
        padding: em(80);

        &--amount{
            width: 100%;
            height: em(440);
            background: url(/img/sections/vip/vipBG.png), no-repeat;
            background-size: 100% 100%;
            border-radius: em(120);
            //border: em(2) solid #bcb2ff42;
            box-shadow: 0 em(48) em(120) 0 #040024, 0 em(32) em(80) 0 #28215A;
            @include flex(column, center, center, false);
            overflow: hidden;
            position: relative;

            .value{
                @include text(#ffffff, em(65), 700, 1em);

                &.winAnim{
                    animation: winAnim 4s ease-in-out both;
                }
            }

            .MW{
                @include text(#ffffff, em(80), 400, 1em);
            }

            .coin{
                position: absolute;

                &--1{
                    width: em(185);
                    right: em(-58);
                    top: em(48);
                    animation: coinAnim 2.5s ease-in-out infinite alternate;
                }

                &--2{
                    width: em(270);
                    top: em(-95);
                    right: em(50);
                    animation: coinAnim 3.5s ease-in-out infinite alternate;
                }

                &--3{
                    width: em(245);
                    top: em(-93);
                    left: em(40);
                    animation: coinAnim 2.33s ease-in-out infinite alternate;
                }

                &--4{
                    width: em(255);
                    bottom: em(-5);
                    left: em(30);
                    animation: coinAnim 3.33s ease-in-out infinite alternate;
                }

                &--5{
                    width: em(156);
                    left: em(-48);
                    top: em(48);
                    animation: coinAnim 2s ease-in-out infinite alternate;
                }

                &--6{
                    width: em(170);
                    right: em(35);
                    bottom: em(-8);
                    animation: coinAnim 2.15s ease-in-out infinite alternate;
                }
            }
        }
    }

    &__cards{
        @include flex(false, false, space-between, em(20));
        flex-wrap: wrap;
        &--card{
            border-radius: em(32);
            background: radial-gradient(100% 100% at 50% 0%, #5D5597 0%, #151233 100%) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0.48) 0%, rgba(255, 255, 255, 0.16) 100%) border-box;
            border: em(1) solid transparent;
            @include flex(column, center, false, em(5));
            flex-basis: 32.1%;
            padding: em(24) em(24) em(32) em(24);
            text-align: center;
            &:nth-child(4), &:nth-child(5){
                flex-basis: 49%;
            }
        }

        &--tt{
            padding-top: em(5);
        }

        &--chip{
            width: em(76);
            animation: rotation 7s infinite linear;
            img{
                object-fit: contain;
            }
        }
    }

    &__btn{
        margin: 0 auto;
    }
}

.splide__vip{
    display: none;
}

@keyframes rotation {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@keyframes coinAnim {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(-15%);
    }
}

@keyframes winAnim {
    0% {
        opacity: 1;
    }
    10% {
        opacity: 0;
    }
    20% {
        opacity: 1;
    }
    30% {
        opacity: 0;
    }
    40% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style>