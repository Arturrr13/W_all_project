<script setup>
import SvgIcon from '@/components/SvgIcon.vue'
import { ref } from 'vue'

const socials = ref([
    {
        name: 'Instagram',
        link: 'https://www.instagram.com/weiss.bet/'
    },
    {
        name: 'Telegram',
        link: 'https://t.me/weissbet_official'
    },
    {
        name: 'Twitter (X)',
        link: 'https://x.com/WEISSBET'
    },
    {
        name: 'Discord',
        link: 'https://discord.com/invite/EZkDqEpe6t'
    }
])

//const getImageUrl = (name) => new URL(`../../assets/img/sections/footer/${name}.svg`, import.meta.url).href
</script>

<template>
    <div class="footer section__wrapper">
        <div class="footer__social" v-for="(item, index) in socials" :key="index">
            <a class="footer__social--link" :href="item.link" aria-label="social" title="social" rel="nofollow" target="_blank">
                <div class="footer__social--icon">
                    <!-- <img :src="`img/sections/footer/${index + 1}.svg`" alt="social"> -->
                    <SvgIcon
                        class="socialSvg"
                        :name="`social/${index + 1}`"
                    />
                </div>
                <p class="footer__social--name t-20">
                    {{ item.name }}
                </p>
            </a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.footer{
    @include flex(false, center, space-between, false);

    &__social{
        transition: all .25s ease-in-out;
        background: radial-gradient(100% 100% at 50% 0%, #5D5597 0%, #151233 100%) padding-box, radial-gradient(50% 100% at 50% 0%, #3C3663 0%, #221F39 100%) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0.48) 0%, rgba(255, 255, 255, 0.16) 100%) border-box;
        border: em(1) solid transparent;
        border-radius: em(32);

        &--link{
            @include flex(false, center, center, em(15));
            color: #ffffff;
            padding: em(40) 0;
            width: em(273);
        }

        &--icon{
            width: em(24);
            height: em(24);
        }

        &:hover{
            box-shadow:  0 0 0 em(8) #4F488329;
        }
    }
}

.socialSvg{
    width: 100%;
    height: 100%;
}
</style>