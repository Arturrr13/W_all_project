<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import { useTranslation } from '@/composition/useTranslation'
import { getRedirectLink, createDomainLinkSafe } from '@/lib'
import { getLanguagePartFromCode } from '@/utils'

//?popup=register-completion&type=credentials
const loginRedirect = createDomainLinkSafe('/?popup=regform')

const { t, i18next } = useTranslation('common')

const lang =  ref(getLanguagePartFromCode(i18next.language))

const props = defineProps({
    acitve: Boolean
})

const emit = defineEmits(['close'])

onMounted(() => setTimeout(() => lang.value = getLanguagePartFromCode(i18next.language), 500))

const close = ref(false)

const closePopUp = () => {
    close.value = true
    
    setTimeout(() => {
        close.value = false
        emit('close')
    }, 600)
}
</script>

<template>
    <div class="popUp" :class="{ active: props.acitve, close: close }">
        <div class="popUp__body">
            <div class="popUp__body--title">
                <p class="congrat">
                    {{ t('banner.congrat') }}
                </p>
                <p class="uWon">
                    {{ t('banner.uWon') }}
                </p>
            </div>

            <div class="popUp__body--prize">
                <p class="bonus">
                    <span v-if="lang === 'pt'">
						{{ t('banner.bonus') }} 300%!
					</span>
					<span v-else>
						300% {{ t('banner.bonus') }}!
					</span>
                </p>
                <p class="fs">
                    + 200 {{ t('banner.fs') }}
                </p>
            </div>

            <div class="popUp__body--singUp">
				<a :href="loginRedirect" aria-label="sing up" title="sing up" rel="nofollow" target="_blank">
					{{ t('banner.SignUp') }}
				</a>
			</div>
        </div>
        <div class="popUp__cloud popUp__cloud--left">
			<img src="/img/cloudL.png" alt="cloud">
		</div>
		<div class="popUp__cloud popUp__cloud--right">
			<img src="/img/cloudR.png" alt="cloud">
		</div>
    </div>
</template>

<style lang="scss" scoped>
.popUp{
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%);
    backdrop-filter: blur(em(6));
    position: absolute;
    top: 0;
    left: 0;
    width: 101dvw;
    height: 101%;
    z-index: 10;
    display: none;
    animation: openPopUp .5s linear both;
    &.active{
        @include flex(false, center, center, false);
    }

    &.close{
        animation: closePopUp .5s linear both;
    }

    &__cloud{
		position: absolute;
		z-index: -1;

		&--left{
			width: em(1156);
			bottom: em(-30);
			left: em(-275);
		}

		&--right{
			width: em(1183);
			bottom: em(-100);
			right: em(-175);
		}
	}
}

.popUp__body{
    position: relative;
    padding: em(175) em(110) em(125) em(120);
    background: url(/img/BG/popUp.png) no-repeat;
    background-size: 100% 100%;
    @include flex(column, center, center, em(80));
    text-align: center;

    &--title{
        .congrat{
            @include text(#fff, em(40), 700, 1em);
        }
        .uWon{
            @include text(#fff, em(32), 400, 1em);
        }
    }

    &--prize{
        .bonus{
            @include text(#FFF743, em(66), 400, 1em);
        }
        .fs{
            @include text(#55FD52, em(48), 400, 1em);
        }

        .bonus, .fs{
            text-shadow: 0 em(2) em(5) rgba(0, 0, 0, 0.25);
		    font-family: "Titan One";
		    text-transform: uppercase;
        }
    }

    &--singUp{
        background-image: url(/img/BG/uWin.png);
	    background-repeat: no-repeat;
	    background-size: 100% 100%;
	    width: em(530);
	    height: em(106);
	    @include flex(false, center, center, false);
	    text-align: center;
        transition: all .35s ease-in-out;

        a{
            @include text(#fff, em(36), 400, 1em);
            font-family: "Titan One";
		    text-transform: uppercase;
            width: 100%;
            height: 100%;
            @include flex(false, center, center, false);
        }

        &:hover{
            filter: drop-shadow(em(26) 0 em(30) #db30b6);
            transform: scale(1.05);
        }
    }
}

@keyframes openPopUp {
    0% {
        clip-path: inset(50% 50% 50% 50%);
    }
    100% {
        clip-path: inset(0 0 0 0);
    }
}

@keyframes closePopUp {
    0% {
        clip-path: inset(0 0 0 0);
    }
    100% {
        clip-path: inset(50% 50% 50% 50%);
    }
}
</style>