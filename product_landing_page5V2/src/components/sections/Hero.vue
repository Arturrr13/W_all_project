<script setup>
import Runline from '../UI/Runline.vue'
import ChooseLanguage from '@/components/ChooseLanguage.vue'
import { getLanguagePartFromCode } from '@/utils'
import { useTranslation } from '@/composition/useTranslation'
const { t, i18next } = useTranslation('common')
import { ref } from 'vue'

const lang = ref() 
lang.value = getLanguagePartFromCode(i18next.language)

const emit = defineEmits(['registration'])
</script>

<template>
    <div class="hero section__wrapper">
        <choose-language @item="el => lang = el"/>
        <div class="hero__top">
            <div class="logo">
                <a href="#">
                    <img src="/img/logo.png" alt="weiss">
                </a>
            </div>

            <!-- <p class="hero__top--welcomeTx">
                {{ t('main.wb') }}
            </p>

            <p class="hero__top--fsTx t-90">
                {{ t('main.bonus') }} <br class="dsnone">{{ t('main.bonusFs') }}
            </p>

            <p class="hero__top--bonusTx">
                {{ t('main.bonusSec') }}<br>
                <b>{{ t('main.bonusSecB') }}</b>
            </p> -->
        </div>

        <!-- <div class="hero__bottom">
            <div class="hero__bottom--btn btn">
                <a aria-label="button" title="Registration" rel="nofollow" @click="$emit('registration')">
                    {{ t('main.reg') }}
                </a>
            </div>

            <div class="hero__bottom--nomination">
                <div class="hero__bottom--nominationImg">
                    <img src="/img/sections/hero/nomination.png" alt="nomination">
                </div>

                <div class="hero__bottom--nominationTx" :class="{ reverse: lang === 'ru' }">
                    <p class="hero__bottom--nominationTitle">
                        {{ t('main.newCas') }}<br>{{ t('main.newCasSec') }}
                    </p>
                    <p class="hero__bottom--nominationNom">
                        {{ t('main.nom') }}
                    </p>
                </div>
            </div>
        </div>

        <div class="hero__runline">
            <runline :folder="'hero'"/>
        </div>

        <div class="hero__CH">
            <div class="hero__CH--light3"></div>

            <div class="hero__CH--pers">
                <img src="/img/sections/hero/CH.png" alt="ch">
            </div>

            <div class="hero__CH--token">
                <img src="/img/sections/hero/token.png" alt="token">
            </div>

            <div class="hero__CH--zipper">
                <img src="/img/sections/hero/zipper.png" alt="zipper">
            </div>

            <div class="hero__CH--light"></div>
            <div class="hero__CH--light2"></div>
        </div> -->
    </div>
</template>

<style lang="scss" scoped>
.section__wrapper{
    padding: 0;
    padding-top: em(60);
}

.logo{
    width: em(190);
    // padding-bottom: em(80);
}

.hero{
    position: relative;
    &__top{
        
        &--welcomeTx{
            @include text(#A6A3FF, em(28), 400, normal);
            text-transform: uppercase;
            padding-bottom: .75em;
        }

        &--bonusTx{
            @include text(#ffffff, em(60), 400, normal);
            padding-top: .3em;
            text-transform: uppercase;
        }

        &--fsTx{
            max-width: 8em;
            text-transform: uppercase;
        }
    }

    &__bottom{
        @include flex(false, center, space-between, false);
        z-index: 2;
        position: relative;
        padding: em(12) em(60) em(20) 0;
        
        &--nomination{
            box-shadow: 0 0 em(48) 0 #E3DEFF29 inset,
            0 em(8) em(16) em(-8) #FFFFFF inset,
            0 em(39) em(56) em(-36) #FFFFFF80 inset;
            border-radius: em(24);
            @include flex(false, false, false, em(24));
            padding: em(24);
            width: max-content;
            position: relative;
            text-transform: uppercase;
            &::before{
                content: '';
                position: absolute;
                z-index: -1;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.241) 100%);
                backdrop-filter: blur(em(4));
                -webkit-backdrop-filter: blur(em(4));
                border-radius: 1em;
            }
        }

        &--nominationImg{
            width: em(120);
        }

        &--nominationTx{
            @include flex(column, flex-start, space-between, false);

            &.reverse{
                flex-direction: column-reverse;
            }
        }

        &--nominationTitle{
            @include text(#FFFFFF, em(28), 700, normal)
        }

        &--nominationNom{
            @include text(#FFFFFF99, em(14), 400, normal)
        }
    }

    &__CH{
        position: absolute;
        bottom: 0;
        right: em(-200);

        &--pers{
            width: em(700);
            z-index: 1;
            position: relative;
        }

        &--light{
            width: em(305);
            height: em(305);
            background: radial-gradient(50% 50% at 50% 50%, #CFBCFF 0%, rgba(207, 188, 255, 0.00) 100%);  
            mix-blend-mode: plus-lighter;
            filter: blur(em(75));
            border-radius: 50%;
            position: absolute;
            right: em(90);
            top: em(116);
            z-index: 1;
        }

        &--light2{
            width: em(100);
            height: em(100);
            background: radial-gradient(50% 50% at 50% 50%, #CFBCFF 0%, rgba(207, 188, 255, 0.00) 100%);
            mix-blend-mode: plus-lighter;
            filter: blur(em(20));
            border-radius: 50%;
            position: absolute;
            top: em(60);
            left: em(90);
            z-index: 1;
            animation: light2Anim 3.5s ease-in-out infinite alternate;
        }

        &--light3{
            width: em(400);
            height: em(400);
            background: #817EFF;
            mix-blend-mode: plus-lighter;
            filter: blur(em(250));
            border-radius: 50%;
            position: absolute;
            top: em(110);
            left: em(40);
            animation: light3Anim 3.5s ease-in-out infinite alternate;
        }

        &--token{
            width: em(202);
            position: absolute;
            right: em(120);
            top: em(146);
            z-index: 2;
            animation: tokenAnim 5s ease-in-out infinite alternate;
        }

        &--zipper{
            width: em(360);
            position: absolute;
            right: em(30);
            top: em(-136);
            animation: zipperAnim 3.5s ease-in-out infinite alternate;
        }
    }
}

@keyframes zipperAnim {
    0% {
        filter: contrast(0);
    }
    100% {
        filter: contrast(5);
    }
}

@keyframes light3Anim {
    0% {
        opacity: 0.3;
    }
    100% {
        opacity: 1;
    }
}

@keyframes light2Anim {
    0% {
        opacity: 0.3; transform: translateY(0) translateX(0);
    }
    100% {
        opacity: 1; transform: translateY(em(-15)) translateX(em(25));
    }
}

@keyframes tokenAnim {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(em(-25));
    }
}
</style>