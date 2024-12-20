<script setup>
import SvgIcon from '@/components/SvgIcon.vue'
import { useTranslation } from '@/composition/useTranslation'
const { t, i18next } = useTranslation('common')
import '@splidejs/splide/css/core'
import { Splide } from '@splidejs/splide'
import Runline from '../UI/Runline.vue'
import Player from '../UI/Player.vue'
import { ref, onMounted } from 'vue'

const slider = ref([
    {
        1: {
            name: 'Big Bamboo',
            slot: 'Push Gaming',
            img: 12
        },
        2: {
            name: 'Wild Bandito',
            slot: 'PG Soft',
            img: 5
        },
        3: {
            name: 'Ark of Ra',
            slot: 'Circular Arrow',
            img: 9
        }
    },
    {
        1: {
            name: 'The Dog House - Dog or alive',
            slot: 'Push Gaming',
            img: 10
        },
        2: {
            name: 'Sugar Rush',
            slot: 'Pragmatic Play',
            img: 11
        },
        3: {
            name: 'Rip City',
            slot: 'Hacksaw Gaming',
            img: 4
        }
    }
    ,
    {
        1: {
            name: 'Gates of Olimpus 1000',
            slot: 'Pragmatic Play',
            img: 14
        },
        2: {
            name: 'HEROIC SPINS',
            slot: 'Pragmatic Play',
            img: 13
        },
        3: {
            name: 'Wanted Dead Or A Wild',
            slot: 'Hacksaw Gaming',
            img: 15
        }
    }
])

const emit = defineEmits(['registration'])
const spl = ref(null)

onMounted(() => {
    new Splide(spl.value, {
        drag: 'free',
        gap: '0.75em',
        //trimSpace: false,
        perPage: 1.5,
        focus: 'start',
        perMove: 1,
        pagination: false,
        arrows: false,
    }).mount()
})

//const getImageUrl = (name) => new URL(`../../assets/img/sections/uGames/gallery/${name}.png`, import.meta.url).href
</script>

<template>
    <div class="uGame section__wrapper">
        <div class="uGame__title">
            <!-- <img class="titleSvg" src="/img/sections/uGames/title.svg" alt="title"> -->
            <SvgIcon
                class="titleSvg"
                :name="`title/uGame`"
            />
            <h3 class="t-48">
                {{ t('main.uGames') }}
            </h3>
        </div>

        <div class="uGame__gallery">
            <div class="uGame__gallery--top">
                <div class="game" v-for="index in 4" :key="index" :class="{ dsnone: index == 4}" @click="$emit('registration')">
                    <img v-if="index != 1" :src="`img/sections/uGames/gallery/${index}.png`" alt="game">
                    <div 
                        v-else 
                        class="uGame__gallery--video" 
                    >
                        <player :video="'zeus'" :poster="'img/sections/uGames/gallery/1.png'"/>
                    </div>
                </div>
            </div>
            <div class="uGame__gallery--bot">
                <div class="game" v-for="index in 7" :key="index" @click="$emit('registration')">
                    <img :src="`img/sections/uGames/gallery/${index + 4}.png`" alt="game">
                </div>
            </div>
        </div>

        <section ref="spl" class="splide splide__uGame" aria-label="slider">
            <div class="splide__track">
            	<ul class="splide__list uGame__slide">
            		<li 
                        class="splide__slide uGame__slide--item" 
                        v-for="(item, index) in slider" :key="index"
                    >
                        <div class="uGame__slide--itemWr" v-for="(el, index) in item" :key="index" @click="$emit('registration')">
                            <div class="uGame__slide--itemGame">
                                <img :src="`img/sections/uGames/gallery/${el.img}.png`" alt="game">
                            </div>

                            <div class="uGame__slide--itemAbout">
                                <p class="name">
                                    {{ el.name }}
                                </p>
                            
                                <p class="slot">
                                    {{ el.slot }}
                                </p>
                            </div>
                        </div>
                    </li>
            	</ul>
            </div>
        </section>

        <div class="uGame__runline">
            <runline :folder="'uGames'"/>
        </div>

        <div class="uGame__btn btn">
            <a aria-label="button" title="play" rel="nofollow" @click="$emit('registration')">
                <img class="uGame__btn--img" :src="`img/sections/uGames/btn.png`" alt="btn">

                {{ t('main.uGamesBtn') }}
            </a>
        </div>
    </div>
</template>

<style lang="scss">
.titleSvg{
    width: em(40);
    height: em(40);
}

.uGame{
    @include flex(column, false, false, em(40));

    &__title{
        @include flex(false, center, center, em(10))
    }

    &__gallery{
        @include flex(column, false, false, em(20));

        &--top{
            @include flex(false, false, space-between, em(17));
            
            .game{
                img{
                    border-radius: em(32);
                }
                border-radius: em(32);
                border: em(1) solid #FFFFFF3D;
                width: 100%;
                &:nth-child(1){
                    width: 210%; // 450px
                    border: none;
                }

                &:hover{
                    cursor: pointer;
                }
            }
        }

        &--bot{
            @include flex(false, false, space-between, em(17));

            .game{
                img{
                    border-radius: em(24);
                }
                width: 100%;
                border-radius: em(24);
                border: em(1) solid #FFFFFF3D;

                &:hover{
                    cursor: pointer;
                }
            }
        }

        &--video{
            width: 100%;
            height: em(220);
            @include flex(false, center, center, false);
            position: relative;
            transition: all .35s ease-in-out;
            overflow: hidden;
            border-radius: em(24);
        }
    }

    &__btn{
        margin: 0 auto;
        animation: btnAnim 1.5s ease-in-out infinite alternate;
        a{
            @include flex(false, center, center, em(10));
        }

        &--img{
            width: em(30);
            animation: rotationAnim 7s infinite linear;
        }
    }

    &__slide{
        &--item{
            @include flex(column, false, false, em(16));
        }

        &--itemWr{
            @include flex(false, center, false, em(16));
            &:hover{
                cursor: pointer;
            }
        }

        &--itemGame{
            border-radius: em(12);
            border: em(1) solid rgba(255, 255, 255, 0.24);
            width: em(80);
            img{
                border-radius: em(12);
            }
        }

        &--itemAbout{
            max-width: em(130);

            .name{
                @include text(#ffffff, em(16), 500, 1em);
            }

            .slot{
                @include text(#ffffff, em(12), 400, 140%);
            }
        }
    }
}

.splide__uGame{
    display: none;
    max-width: em(366);
    margin-left: auto;
}

@keyframes btnAnim {
    0% {
        box-shadow: 0 0 0 0 #6865F399;
    }
    100% {
        box-shadow: 0 0 em(32) 0 #6865F399;
    }
}

@keyframes rotationAnim {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>