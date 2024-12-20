<script setup>
import { useTranslation } from '@/composition/useTranslation'
const { t,i18next } = useTranslation('common')
import '@splidejs/splide/css/core'
import { Splide } from '@splidejs/splide'
import { ref, onMounted,watch } from 'vue'
import { getLanguagePartFromCode } from '@/utils'


// const slider = ref([
//     {
//         name: 'Drops & Wins Slots',
//         amount: '40 000 EURO'
//     },
//     {
//         name: 'Crash & Win',
//         amount: '3 500 EURO'
//     },
//     {
//         name: 'WEFT Showdown',
//         amount: '20 000 WEFT'
//     },
//     {
//         name: 'WEISS Neon Ride',
//         amount: '100 000 WEFT'
//     }
// ]);

// const sliderCZ = ref([
//     {
//         name: 'Drops & Wins Slots',
//         amount: '1 010 000 CZK '
//     },
//     {
//         name: 'Crash & Win',
//         amount: '88 000 CZK'
//     },
//     {
//         name: 'WEFT Showdown',
//         amount: '20 000 WEFT'
//     },
//     {
//         name: 'WEISS Neon Ride',
//         amount: '100 000 WEFT'
//     }
// ]);


// const selectedLang = ref(getLanguagePartFromCode(i18next.language));
//   console.log(i18next)

// watch(selectedLang, (ln) => {
//   i18next.changeLanguage(ln);
// });

const spl = ref(null)
const emit = defineEmits(['registration'])

onMounted(() => {
    new Splide(spl.value, {
        //type: 'loop',
        drag: 'free',
        gap: '0.75em',
        //trimSpace: false,
        //focus: 0.45,
        //perPage: 2.25,
        //perMove: 1,
        pagination: false,
        arrows: false,
        autoWidth: true,
        breakpoints: {
            // 1024: {
        	// 	perPage: 2.95,
            //     focus: 0.15,
        	// },
        	// 768: {
        	// 	perPage: 1.175,
            //     focus: 0.075,
        	// },
        }
    }).mount()
})

const moveSpaceman = (e) => {
	const speaceman = document.querySelector('.prizes__slide--spaceman')
	if(window.innerWidth > 768){
		const speed = -100

		const x = (window.innerWidth - e.pageX * speed) / 100

		speaceman.style.transform = `translateX(${x - 200}px)`
	}
}
</script>

<template>
    <div class="prizes">
        <div class="prizes__title">
            <div class="prizes__title--top">
                <p>
                    {{ t('main.prizes') }}
                </p>
            </div>
            <div class="prizes__title--bot">
                <p class="t-120">
                    {{ t('main.prizesSec') }}<br class="br-1024">{{ t('main.prizesSecAmount') }}
                </p>
                <p class="t-90">
                    {{ t('main.prizesTh') }}
                </p>
            </div>

            <div class="prizes__title--light"></div>
        </div>

        <div class="uGame__btn btn prizes__btn">
            <a aria-label="button" title="VIP" rel="nofollow" @click="$emit('registration')">
                <img class="uGame__btn--img" :src="`img/sections/uGames/btn.png`" alt="btn">
                {{ t('main.prizesBtn') }}
            </a>
        </div>
        
        <section ref="spl" class="splide slide__prizes" aria-label="slider">
            <div class="prizes__slide--spaceman">
                <img src="/img/sections/prizes/spaceman.png" alt="spaceman">
            </div>
                <!-- {{t('main.prizeSlider')}} -->

            <div class="splide__track" @mousemove="moveSpaceman">
                

            	<ul class="splide__list prizes__slide">
                    <li class="splide__slide slide__fake"></li>
            		<li 
                        class="splide__slide" 
                        v-for="(item, index) in 4" 
                        :key="index"
                        @click="$emit('registration')"    
                    >
                        <div class="prizes__slide--text">
                            <p class="t-18 t-24-m">
                                <!-- {{item.name}} -->
                                {{ t(`main.prizeSlider.${index+1}.name`) }}
                            </p>
                            <p class="t-18 pur">
                                {{ t(`main.prizeSlider.${index+1}.amount`) }}
                                <!-- {{item.amount }} -->
                            </p>
                        </div>

                        <img :src="`img/sections/prizes/${index + 1}.png`" alt="slot">

                        <div class="prizes__slide--prPool" v-if="index == 0">
                            <p>
                                {{ t('main.prizesSlide1') }}
                            </p>
                            <p>
                                prize pool
                            </p>
                        </div>
                        <div class="prizes__slide--prPool" v-if="index == 1">
                            <p>
                                {{ t('main.prizesSlide2') }}
                            </p>
                            <p>
                                prize pool
                            </p>
                        </div>
                    </li>
                    <li class="splide__slide slide__fake"></li>
            	</ul>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.prizes{
    padding: em(60) 0;

    &__title{
        text-align: center;
        position: relative;

        &--top{
            @include text(#A6A3FF, em(28), 400, 105%);
            text-transform: uppercase;
            padding-bottom: em(15);
        }

        &--bot{
            .t-120{
                @include text(#fff, em(120), 700, 100%)
            }
        }

        &--light{
            position: absolute;
            width: em(400);
            height: em(400);
            left: em(556);
            bottom: em(-250);
            border-radius: 50%;
            opacity: 0.8;
            background: #7EB2FF;
            mix-blend-mode: plus-lighter;
            filter: blur(em(250));
        }
    }

    &__slide{
        position: relative;

        &--text{
            padding: em(24);
            background: radial-gradient(100% 100% at 50% 0%, #5D5597 0%, #151233 100%);
            border-radius: 0 0 em(32) em(32);
            .pur{
                color: #FFFFFF99;
                text-transform: uppercase;
            }
        }

        &--spaceman{
            width: em(390);
            position: absolute;
            top: em(-450);
            left: em(130);
        }


        &--prPool{
            position: absolute;
            top: em(80);
            right: em(15);
            text-align: end;
            @include flex(column, flex-end, false, false);

            p{
                @include text(#fff, em(24), 700, 110%);
                text-transform: uppercase;
                max-width: em(150);

                &:nth-child(2){
                    color: #C4DFFF;
                    font-size: em(22);
                }
            }
        }
    }

    &__btn{
        margin: em(60) auto;
        z-index: 1;
        position: relative;
    }
}

// .slide__prizes{
//     max-width: em(1350);
//     margin-left: auto;
// }

.splide__slide{
    position: relative;
    border-radius: em(32);
    background: radial-gradient(100% 100% at 50% 0%, #5d559700 0%, #15123300 100%) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0.48) 0%, rgba(255, 255, 255, 0.16) 100%) border-box;
    border: em(1) solid transparent;
    @include flex(column-reverse, false, false, false);
    width: em(380);
    img{
        border-radius: em(32) em(32) 0 0;
        height: 10.625em;
    }

    &:hover{
        cursor: pointer;
    }
}

.br-1024{
    display: none;
}

.slide__fake{
    width: em(176);
    border: none;
    background: transparent;
}

@media  screen and (max-width:1025px){
    .splide__slide{
        width: em(330);
    }

    .slide__fake{
        width: em(36);
    }
}

@media  screen and (max-width:768px){
    .splide__slide{
        width: em(330);
    }

    .slide__fake{
        width: em(12);
    }
}
</style>