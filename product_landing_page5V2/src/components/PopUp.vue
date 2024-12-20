<script setup>
import FormInput from './UI/FormInput.vue'
import { ref } from 'vue'

const props = defineProps({
    acitve: Boolean
})

const emit = defineEmits(['close'])

const close = ref(false)
const validation = ref({
    email: false,
    password: false,
    checkbox: false
})

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
        <div class="form">
            <div class="form__head">
                <img src="../assets/img/popUp.png" alt="zeus">
            </div>

            <div class="form__padd">
                <form-input :type="'email'" @email-valid="data => validation.email = data" class="form__emailInput"/>
                <form-input :type="'password'" @password-valid="data => validation.password = data"/>
                
                <div class="form__agreeBlock">
                    <div class="form__agreeBlock--checkbox" :class="{ active: validation.checkbox }">
                        <input type="checkbox" checked @click="validation.checkbox = !validation.checkbox"> 
                    </div>
                    <p class="form__agreeBlock--text">
                        By ticking this box to register for this website, the user declares to be over 18 years old and to have read, understood and accepted the Terms and Conditions.
                    </p>
                </div>
    
                <div type="button" class="form__closeBtn" @click="closePopUp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <mask id="mask0_883_2158" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                        <rect width="24" height="24" fill="#D9D9D9"/>
                        </mask>
                        <g mask="url(#mask0_883_2158)">
                        <path d="M12 13.4L7.10005 18.3C6.91672 18.4834 6.68338 18.575 6.40005 18.575C6.11672 18.575 5.88338 18.4834 5.70005 18.3C5.51672 18.1167 5.42505 17.8834 5.42505 17.6C5.42505 17.3167 5.51672 17.0834 5.70005 16.9L10.6 12L5.70005 7.10005C5.51672 6.91672 5.42505 6.68338 5.42505 6.40005C5.42505 6.11672 5.51672 5.88338 5.70005 5.70005C5.88338 5.51672 6.11672 5.42505 6.40005 5.42505C6.68338 5.42505 6.91672 5.51672 7.10005 5.70005L12 10.6L16.9 5.70005C17.0834 5.51672 17.3167 5.42505 17.6 5.42505C17.8834 5.42505 18.1167 5.51672 18.3 5.70005C18.4834 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4834 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4834 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4834 18.1167 18.3 18.3C18.1167 18.4834 17.8834 18.575 17.6 18.575C17.3167 18.575 17.0834 18.4834 16.9 18.3L12 13.4Z" fill="white"/>
                        </g>
                    </svg>
                </div>
    
                <div 
                    class="form__btn btn"
                    :class="{ disabled: !validation.email || !validation.password || !validation.checkbox }"
                >
                    <a href="#" aria-label="button" title="Create an account" rel="nofollow">
                        Create an account
                    </a>
                    <div class="form__btn--block disabled--block"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.popUp{
    background: rgba(0, 0, 0, 0.60);
    backdrop-filter: blur(em(5));
    position: fixed;
    top: 0;
    width: 100dvw;
    height: 100%;
    z-index: 10;
    display: none;
    animation: openPopUp .5s linear both;
    &.active{
        @include flex(false, center, center, false);
    }

    &.close{
        animation: closePopUp .5s linear both;
    }
}

.form{
    position: relative;
    width: em(480);
    border-radius: em(32);
    background: #0F0C28;

    &__head{
        width: 100%;
        img{
            border-radius: em(32) em(32) 0 0;
        }
    }

    &__padd{
        width: 100%;
        padding: em(16) em(24) em(24) em(24);
    }

    &__closeBtn{
        width: em(40);
        height: em(40);
        border-radius: em(12);
        background: #FFFFFF29;
        @include flex(false, center, center, false);
        transition: all .35s ease-in-out;
        position: absolute;
        top: em(25);
        right: em(25);
        svg{
            width: em(24);
            height: em(24);
        }
        &:hover{
            cursor: pointer;
            background: #ff3333;
        }
    }

    &__emailInput{
        margin-bottom: em(16);
    }

    &__agreeBlock{
        @include flex(false, center, false, em(12));
        padding: em(24) 0 em(32);
        &--checkbox{
            width: em(22);
            height: em(22);
            border-radius: em(2);
            border: em(1) solid #8885FD;
            @include flex(false, center, center, false);
            flex-shrink: 0;
            transition: all .25s ease;
            &:hover{
                box-shadow: 0 0 0 em(1) #8885FD;
                cursor: pointer;
            }
            &.active{
                background: #8885FD;
                &::after{
                    content: '';
                    width: em(10);
                    height: em(10);
                    border-bottom: em(3) solid #0F0C28;
                    border-left: em(3) solid #0F0C28;
                    transform: rotate(-45deg);
                }
                &:hover{
                    background: transparent;
                    &::after{
                        border-color: #8885FD;
                    }
                }
            }
        }
        &--text{
            @include text(#fff, em(12), 400, 120%);
            text-align: start;
        }
    }

    &__btn{
        width: 100%;
        position: relative;

        a{
            padding: em(12) 0;
        }

        &--block{
            position: absolute;
            display: none;
            top: 0;
            left: 0;
            z-index: 2;
            background: transparent;
            width: 100%;
            height: 100%;
        }

        &.disabled{
            opacity: 0.75;
            background: #ff3333;
            color: #FFF;
            
            .form__btn--block{
                display: block;
            }

            &:hover{
                cursor: not-allowed;
            }
        }

    }
}

input[type=checkbox]{
    position: absolute;
    opacity: 0;
    width: em(22);
    height: em(22);
    &:hover{
        cursor: pointer;
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