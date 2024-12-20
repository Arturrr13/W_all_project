<script setup>
import SvgIcon from '@/components/SvgIcon.vue'
import { useTranslation } from '@/composition/useTranslation'
const { t, i18next } = useTranslation('common')
import '@splidejs/splide/css/core'
import { Splide } from '@splidejs/splide'
import { ref, onMounted } from 'vue'

const emit = defineEmits(['registration'])
const spl = ref(null)

onMounted(() => {
    new Splide(spl.value, {
        drag: 'free',
        gap: '0.75em',
        autoWidth: true,
        pagination: false,
        arrows: false,
    }).mount()
})

//const getImageUrl = (name) => new URL(`/img/sections/token/${name}.png`, import.meta.url).href
</script>

<template>
    <div class="token section__wrapper">
        <div class="token__title">
            <div class="token__title--top">
                <!-- <img class="titleSvg" src="/img/sections/token/title.svg" alt="title"> -->
                <SvgIcon
                    class="titleSvg"
                    :name="`title/token`"
                />
                <h3 class="t-48">
                    WEISS Fuel Token
                </h3>
            </div>
            <div class="token__title--bot">
                <p>
                    {{ t('main.token') }}
                </p>
            </div>
        </div>

        <div class="token__main">
            <div class="token__main--text">
                <p>
                    {{ t('main.tokenEnj') }}
                </p>
            </div>

            <div class="token__main--cards">
                <div class="token__main--card" v-for="index in 3" :key="index">
                    <div class="path">
                        <p class="t-24">
                            {{ t(`main.tokenSlider.${index}.f`) ? t(`main.tokenSlider.${index}.f`) : '' }}
                            <span class="t-24-m">
                                {{ t(`main.tokenSlider.${index}.b`) }}
                            </span>
                            {{ t(`main.tokenSlider.${index}.s`) ? t(`main.tokenSlider.${index}.s`) : '' }}
                        </p>

                    </div>
                    <div class="frame"></div>
                </div>
            </div>

            <div class="token__main--coin" v-for="index in 3" :key="index" :class="`coin${index}`">
                <img :src="`img/sections/token/${index}.png`" alt="coin">
            </div>
        </div>

        <div class="token__light" v-for="index in 3" :key="index" :class="`token__light${index}`"></div>

        <section ref="spl" class="splide splide__token" aria-label="slider">
            <div class="splide__track">
            	<ul class="splide__list prizes__slide">
                    <li class="splide__slide slide__fake"></li>
            		<li 
                        class="splide__slide token__main--card" 
                        v-for="index in 3" :key="index"
                    >
                        <div class="path">
                            <p class="t-24">
                                {{ t(`main.tokenSlider.${index}.f`) ? t(`main.tokenSlider.${index}.f`) : '' }}
                                <span class="t-24-m">
                                    {{ t(`main.tokenSlider.${index}.b`) }}
                                </span>
                                {{ t(`main.tokenSlider.${index}.s`) ? t(`main.tokenSlider.${index}.s`) : '' }}
                            </p>
                        </div>
                        <div class="frame"></div>
                    </li>
                    <li class="splide__slide slide__fake"></li>
            	</ul>
            </div>
        </section>
        <div class="uGame__btn btn">
            <a aria-label="button" title="Holder" rel="nofollow" @click="$emit('registration')">
                <img class="uGame__btn--img" :src="`img/sections/uGames/btn.png`" alt="btn">

                {{ t('main.tokenBtn') }}
            </a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.titleSvg{
    width: em(40);
    height: em(40);
}

.token{
    @include flex(column, false, false, em(40));
    position: relative;

    &__title{
        @include flex(column, center, center, em(10));

        &--top{
            @include flex(false, center, center, em(10));
        }

        &--bot{
            @include text(#ffffff, em(32), 400, normal);
        }
    }

    &__main{
        @include flex(false, center, space-between, false);
        position: relative;

        &--text{
            max-width: em(550);
            p{
                @include text(#ffffff, em(64), 700, normal);
            }
        }

        &--cards{
            @include flex(column, flex-start, false, em(10));
        }

        &--card{
            color: #0F0C28;
            background: radial-gradient(100% 100% at 50% 0%, #5B58EF 0%, #181658 100%) padding-box, radial-gradient(100% 100% at 50% 0%, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.04) 100%) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0.48) 0%, rgba(255, 255, 255, 0.16) 100%) border-box;
            border: em(1) solid transparent;
            padding-left: em(70);
            margin-top: em(10);
            border-radius: em(32);
            position: relative;
            
            .path{
                @include flex(false, center, flex-start, false);
                height: em(140);
                background: url(../../assets/img/sections/token/path.svg), no-repeat;
                //background-size: 100% 100%;
                background-size: contain;
                background-position: 100% 0%;
                background-repeat: no-repeat;
                padding: 0 em(5) 0 em(60);
                transform: translate(em(-10), em(-10));
            }

            .t-24{
                max-width: em(275);
            }

            .frame{
                position: absolute;
                bottom: em(24);
                left: em(24);
                width: em(32);
                height: em(64);
                border-radius: em(64);
                border: em(1) solid #FFF;
                background: linear-gradient(180deg, #8481FF 0%, #302D9B 100%), linear-gradient(180deg, #5B58EF 0%, #181658 100%);       
                box-shadow: 0 em(8) 16px 0 rgba(4, 0, 36, 0.60) inset;
                &::after{
                    content: '';
                    position: absolute;
                    width: em(32);
                    height: em(64);
                    border-radius: em(64);
                    border: em(1) solid transparent;
                    background: linear-gradient(180deg, #8481FF 0%, #302D9B 100%);         
                    mix-blend-mode: plus-lighter;
                    filter: blur(em(12));
                }
            }
        }

        &--coin{
            position: absolute;
        }

        .coin1{
            width: em(150);
            left: em(200);
            bottom: em(-60);
            animation: tokenAnim 5s ease-in-out infinite alternate;
        }

        .coin2{
            width: em(124);
            top: em(155);
            left: em(540);
            animation: tokenAnim 2.5s ease-in-out infinite alternate;
        }

        .coin3{
            width: em(124);
            top: 0;
            left: em(350);
            animation: tokenAnim 4s ease-in-out infinite alternate;
        }
    }

    &__light{
        position: absolute;
        width: em(250);
        height: em(250);
        opacity: 0.8;
        mix-blend-mode: plus-lighter;
        filter: blur(em(150));
        animation: lightAnim 3.5s ease-in-out infinite alternate;
    }

    &__light1{
        position: absolute;
        right: em(128);
        top: em(92);
        background: #8A58DE;  
    }

    &__light2{
        position: absolute;
        left: em(456);
        bottom: 0;
        background: #5C2A70;
    }

    &__light3{
        position: absolute;
        left: em(88);
        top: em(250);
        background: #302B83;
    }

    &__btn{
        margin: 0 auto;
        z-index: 1;
        position: relative;
    }
}

.splide__token{
    display: none;
    // max-width: em(972);
    // margin-left: auto;
}

.splide__slide{
    position: relative;
    width: em(520);
}

@keyframes tokenAnim {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(em(-25));
    }
}

@keyframes lightAnim {
    0% {
        opacity: 0.3;
    }
    100% {
        opacity: 1;
    }
}

.slide__fake{
    width: em(36);
    border: none;
}

@media  screen and (max-width:1025px){
    .slide__fake{
        display: block;
    }
}

@media  screen and (max-width:768px){
    .splide__slide{
        width: em(336);
    }

    .slide__fake{
        width: em(12);
    }
}
</style>