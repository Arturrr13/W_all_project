<script setup>
import '@splidejs/splide/css/core'
import { Splide } from '@splidejs/splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import { ref, onMounted } from 'vue'

import { getLanguagePartFromCode } from '@/utils'
import { useTranslation } from '@/composition/useTranslation'
const { t, i18next } = useTranslation('common')

const props = defineProps({
    folder: String,
    bp: Number
})

const spl = ref(null)
const local = ref('en')

const payment = ['Visa', 'Mastercard', 'Tether', 'Skrill', 'Litecoin', 'Bitcoin', 'OpenBanking']
const paymentPortugal = ['Multibanco', 'MBWay', 'Skrill', 'Visa', 'Mastercard', 'Tether', 'Litecoin', 'Neteller']
const paymentHungary = ['Visa', 'Mastercard', 'Tether', 'Revolut', 'Skrill', 'Litecoin', 'Bitcoin']
const provider = ['PragmaticPlay', 'HacksawGaming', 'BetsyGames', 'PGSoft', 'BoomingGames', 'NolimitCity', 'PlaynGo', 'PushGaming', 'RelaxGaming', 'Spinomenal']
const activeArr = ref(1)

local.value = getLanguagePartFromCode(i18next.language)

if(props.folder === 'hero'){
    local.value === 'en' ? activeArr.value = payment : 
    local.value === 'pt' ? activeArr.value = paymentPortugal :
    activeArr.value = paymentHungary
} else {
    activeArr.value = provider
}

onMounted(() => {
    new Splide(spl.value, {
        type: 'loop',
        drag: 'free',
        focus: 'center',
        fixedHeight: '4em',
        gap: '3.75em',
        autoWidth: true,
        perPage: 3,
        pagination: false,
        arrows: false, 
        autoScroll: {
            speed: 1
        },
        breakpoints: {
        	768: {
                gap: '1.5em'
        	}
        }
    }).mount({ AutoScroll })
})
</script>

<template>
    <section ref="spl" class="splide" aria-label="Run Line">
        <div class="splide__gradient"></div>

        <div class="splide__track">
        	<ul class="splide__list">
        		<li 
                    class="splide__slide" 
                    v-for="index in activeArr" 
                    :key="index">
                    <!-- <img :src="`img/sections/${props.folder}/runline/${index}.png`" alt="spons"> -->
                    <img class="hoverImg" :src="`img/sections/${props.folder}/runline/${index}Hover.png`" alt="spons">
                </li>
        	</ul>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.splide{
    position: relative;

    &__slide{
        transition: all .35s ease-in-out;
        position: relative;
        &:hover{
            cursor: pointer;
            scale: 1.1;

            .hoverImg{
                filter: grayscale(0);
            }
        }

        .hoverImg{
            transition: all .35s ease-in-out;
            filter: grayscale(1);
        }
    }

    &__gradient{
        position: absolute;
        top: 0;
        left: -2%;
        width: 104%;
        height: 100%;

        &::before, &::after{
            content: '';
            position: absolute;
            top: 0;
            z-index: 1;
            height: 100%;
            width: 10%;
        }

        &::before{
            background: linear-gradient(90deg, rgba(15,12,40,1) 25%, rgba(0,0,0,0) 100%);
            left: 0;
        }

        &::after{
            right: 0;
            background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(15,12,40,1) 75%);
        }
    }
}
</style>